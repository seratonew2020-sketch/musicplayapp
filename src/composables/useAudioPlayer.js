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

  // โหลดรายการเพลงจาก API (แนะนำ) หรือ Firebase Storage SDK (fallback)
  // รองรับทั้ง single path และ array of paths
  // เพิ่ม track จาก URL ตรง ๆ (เช่นลิงก์ดาวน์โหลดจาก Firebase Storage)
  const addTrackByUrl = (url) => {
    try {
      // ดึงชื่อไฟล์จาก URL
      const decoded = decodeURIComponent(url.split('/o/')[1].split('?')[0])
      const name = decoded.substring(decoded.lastIndexOf('/') + 1)
      const track = {
        name,
        url,
        sourceFolder: '',
        sourceUser: 'external',
        size: 0,
        contentType: 'audio/mpeg'
      }
      playlist.value.push(track)
      console.log('✅ เพิ่ม track จาก URL:', name)
    } catch (e) {
      console.error('❌ ไม่สามารถเพิ่ม track จาก URL ได้', e)
    }
  }

  const loadPlaylist = async (folderPaths) => {
    // Ensure folderPaths is an array
    const paths = Array.isArray(folderPaths) ? folderPaths : [folderPaths];
    if (paths.length === 0 || paths.some(p => !p)) {
      throw new Error('Folder path ไม่ถูกต้อง');
    }

    console.log('🎵 เริ่มโหลด playlist จาก Firebase Storage SDK');
    console.log('📂 โหลดจาก', paths.length, 'โฟลเดอร์:', paths);

    const allFiles = [];
    for (let i = 0; i < paths.length; i++) {
      const path = paths[i];
      console.log(`📂 โหลดจากโฟลเดอร์ ${i + 1}/${paths.length}: ${path}`);
      try {
        const files = await loadAudioFilesFromStorage(path);
        const filesWithSource = files.map(file => ({
          ...file,
          sourceFolder: path,
          sourceUser: path.split('/')[1] || 'unknown'
        }));
        allFiles.push(...filesWithSource);
        console.log(`✅ โหลดจาก ${path}: ${files.length} ไฟล์`);
      } catch (error) {
        console.error(`❌ ไม่สามารถโหลดจาก ${path}:`, error);
      }
    }

    if (allFiles.length === 0) {
      console.warn('⚠️ ไม่พบไฟล์เสียงจากทุกโฟลเดอร์ - playlist จะว่างเปล่า');
      playlist.value = [];
      return;
    }

    // Sort and set playlist
    playlist.value = allFiles.sort((a, b) => a.name.localeCompare(b.name));
    console.log('✅ โหลดเพลงสำเร็จและเพิ่มเข้า Queue:', playlist.value.length, 'ไฟล์');
    console.log('📋 รายการใน Queue:', playlist.value.map((f, i) => `${i + 1}. ${f.name} (${f.sourceUser})`));

    // สรุปตามโฟลเดอร์
    const filesByFolder = {}
    playlist.value.forEach(file => {
      const folder = file.sourceFolder
      filesByFolder[folder] = (filesByFolder[folder] || 0) + 1
    })
    console.log('📊 สรุปตามโฟลเดอร์:', filesByFolder);
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
    addTrackByUrl,
    loadPlaylist,
    togglePlay,
    loadTrack,
    playNextTrack,
    playPrevTrack,
    unlockAudio,
    seek,
    setVolume
  };
}
