// src/composables/useAudioPlayer.js
import { ref, onUnmounted } from 'vue'
import googleDriveApi from '../plugins/googleDriveApi'

export function useAudioPlayer() {
  const playlist = ref([])
  const currentTrackIndex = ref(-1)
  const isPlaying = ref(false)
  const isUnlocked = ref(false)
  const currentTime = ref(0)
  const duration = ref(0)
  const volume = ref(0.7)
  
  let audioElement = null
  let updateInterval = null

  // ฟังก์ชันแปลง Folder URL เป็น Folder ID
  const extractFolderId = (folderUrlOrId) => {
    if (!folderUrlOrId) return null
    
    // ถ้าเป็น URL เต็ม
    const match = folderUrlOrId.match(/folders\/([a-zA-Z0-9_-]+)/)
    if (match) return match[1]
    
    // ถ้าเป็น ID แล้ว
    return folderUrlOrId
  }

  // โหลดรายการเพลงจาก Google Drive ผ่าน Axios
  const loadPlaylist = async (folderUrlOrId) => {
    try {
      const folderId = extractFolderId(folderUrlOrId)
      
      if (!folderId) {
        throw new Error('Folder ID ไม่ถูกต้อง')
      }

      console.log('📂 กำลังโหลดเพลงจาก Folder ID:', folderId)

      // เรียก API ผ่าน Axios (API Key จะถูกเพิ่มโดย Interceptor)
      const response = await googleDriveApi.get('/files', {
        params: {
          q: `'${folderId}' in parents and (mimeType contains 'audio/' or name contains '.mp3')`,
          fields: 'files(id, name, mimeType, size)',
          orderBy: 'name'
        }
      })

      const files = response.data.files || []
      
      if (files.length === 0) {
        alert('⚠️ ไม่พบไฟล์เสียงในโฟลเดอร์นี้')
        return
      }

      playlist.value = files.map(file => ({
        id: file.id,
        name: file.name,
        mimeType: file.mimeType,
        size: file.size,
        // สร้าง URL สำหรับเล่นเพลง (ใช้ API Key จาก env)
        url: `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media&key=${import.meta.env.VITE_GOOGLE_API_KEY}`
      }))

      console.log('✅ โหลดเพลงสำเร็จ:', playlist.value.length, 'ไฟล์')
      
    } catch (error) {
      console.error('❌ โหลดรายการเพลงล้มเหลว:', error)
      playlist.value = []
    }
  }

  // สร้าง Audio Element
  const createAudioElement = () => {
    if (!audioElement) {
      audioElement = new Audio()
      audioElement.volume = volume.value

      audioElement.addEventListener('loadedmetadata', () => {
        duration.value = audioElement.duration
      })

      audioElement.addEventListener('timeupdate', () => {
        currentTime.value = audioElement.currentTime
      })

      audioElement.addEventListener('ended', () => {
        playNextTrack()
      })

      audioElement.addEventListener('error', (e) => {
        console.error('❌ Audio Error:', e)
        alert('⚠️ ไม่สามารถโหลดเพลงนี้ได้')
      })
    }
  }

  // ปลดล็อก Audio (เรียกหลังจากผู้ใช้คลิก)
  const unlockAudio = () => {
    createAudioElement()
    isUnlocked.value = true
    console.log('🔓 Audio unlocked')
  }

  // โหลดและเล่นเพลง
  const loadTrack = (index) => {
    if (!isUnlocked.value) {
      console.warn('⚠️ Audio ยังไม่ได้ปลดล็อก')
      return
    }

    if (index < 0 || index >= playlist.value.length) {
      console.warn('⚠️ Track index ไม่ถูกต้อง')
      return
    }

    createAudioElement()

    currentTrackIndex.value = index
    const track = playlist.value[index]
    
    console.log('🎵 กำลังโหลดเพลง:', track.name)
    
    audioElement.src = track.url
    audioElement.load()
    audioElement.play()
      .then(() => {
        isPlaying.value = true
        console.log('▶️ เริ่มเล่นเพลง:', track.name)
      })
      .catch(err => {
        console.error('❌ ไม่สามารถเล่นเพลงได้:', err)
        isPlaying.value = false
      })
  }

  // Toggle Play/Pause
  const togglePlay = () => {
    if (!audioElement) return

    if (isPlaying.value) {
      audioElement.pause()
      isPlaying.value = false
      console.log('⏸️ หยุดชั่วคราว')
    } else {
      audioElement.play()
        .then(() => {
          isPlaying.value = true
          console.log('▶️ เล่นต่อ')
        })
        .catch(err => console.error('❌ ไม่สามารถเล่นได้:', err))
    }
  }

  // เล่นเพลงถัดไป
  const playNextTrack = () => {
    if (currentTrackIndex.value < playlist.value.length - 1) {
      loadTrack(currentTrackIndex.value + 1)
    } else {
      loadTrack(0) // เล่นวนกลับไปเพลงแรก
    }
  }

  // เล่นเพลงก่อนหน้า
  const playPrevTrack = () => {
    if (currentTrackIndex.value > 0) {
      loadTrack(currentTrackIndex.value - 1)
    } else {
      loadTrack(playlist.value.length - 1) // ไปเพลงสุดท้าย
    }
  }

  // Seek (กรอเวลา)
  const seek = (time) => {
    if (audioElement) {
      audioElement.currentTime = time
    }
  }

  // ปรับ Volume
  const setVolume = (vol) => {
    volume.value = vol
    if (audioElement) {
      audioElement.volume = vol
    }
  }

  // Cleanup
  onUnmounted(() => {
    if (audioElement) {
      audioElement.pause()
      audioElement.src = ''
      audioElement = null
    }
    if (updateInterval) {
      clearInterval(updateInterval)
    }
  })

  return {
    playlist,
    currentTrackIndex,
    isPlaying,
    isUnlocked,
    currentTime,
    duration,
    volume,
    loadPlaylist,
    togglePlay,
    loadTrack,
    playNextTrack,
    playPrevTrack,
    unlockAudio,
    seek,
    setVolume
  }
}
