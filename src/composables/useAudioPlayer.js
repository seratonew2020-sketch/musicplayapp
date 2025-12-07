// src/composables/useAudioPlayer.js
import { ref, onUnmounted } from 'vue'
import { loadAudioFilesFromStorage } from '../plugins/firebaseStorage'

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

  // โหลดรายการเพลงจาก Firebase Storage โดยใช้ Firebase SDK โดยตรง
  const loadPlaylist = async (folderPath) => {
    try {
      if (!folderPath) {
        throw new Error('Folder path ไม่ถูกต้อง')
      }

      // เรียกใช้ Firebase Storage SDK โดยตรง
      const files = await loadAudioFilesFromStorage(folderPath)
      
      if (files.length === 0) {
        playlist.value = []
        return
      }

      playlist.value = files
      console.log('✅ โหลดเพลงสำเร็จด้วย Firebase SDK:', playlist.value.length, 'ไฟล์')
      
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
