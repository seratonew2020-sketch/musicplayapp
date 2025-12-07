// src/plugins/musicApi.js
import axios from 'axios'
import { storage } from './firebase'
import { ref, getDownloadURL } from 'firebase/storage'

// สร้าง axios instance สำหรับ Music API
const musicApi = axios.create({
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  }
})

// Request Interceptor
musicApi.interceptors.request.use(
  (config) => {
    console.log('📤 Music API Request:', config.method?.toUpperCase(), config.url)
    return config
  },
  (error) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

// Response Interceptor
musicApi.interceptors.response.use(
  (response) => {
    console.log('✅ Music API Response:', response.status, response.config.url)
    return response
  },
  (error) => {
    if (error.response) {
      const status = error.response.status
      const message = error.response.data?.error?.message || error.message
      console.error(`❌ Music API Error (${status}):`, message)
    } else if (error.request) {
      console.error('❌ No response from server:', error.request)
    } else {
      console.error('❌ Request setup error:', error.message)
    }
    return Promise.reject(error)
  }
)

/**
 * โหลดรายการเพลงจาก Firebase Storage โดยใช้ axios
 * ใช้ Firebase Storage SDK สำหรับ list files แต่ใช้ axios pattern สำหรับ error handling
 * @param {string} folderPath - Path ของโฟลเดอร์ใน Firebase Storage
 * @returns {Promise<Array>} Array ของไฟล์พร้อม URL สำหรับเล่น
 */
export const loadAudioFilesWithAxios = async (folderPath = 'music/') => {
  try {
    // ทำความสะอาด path
    const cleanPath = folderPath.startsWith('/') ? folderPath.slice(1) : folderPath
    const finalPath = cleanPath.endsWith('/') ? cleanPath : cleanPath + '/'
    
    console.log('📂 กำลังโหลดเพลงด้วย axios')
    console.log('📂 Path:', finalPath)

    // ใช้ Firebase SDK เพื่อ list files
    const { listAll, getMetadata } = await import('firebase/storage')
    const folderRef = ref(storage, finalPath)
    
    // ใช้ axios pattern สำหรับการจัดการ async operations
    const listResult = await listAll(folderRef)
    
    // กรองเฉพาะไฟล์เสียง
    const audioExtensions = ['.mp3', '.m4a', '.wav', '.ogg', '.flac', '.aac']
    const audioFiles = listResult.items.filter(item => {
      const name = item.name.toLowerCase()
      return audioExtensions.some(ext => name.endsWith(ext))
    })

    if (audioFiles.length === 0) {
      console.warn('⚠️ ไม่พบไฟล์เสียงในโฟลเดอร์:', finalPath)
      console.log('📋 ไฟล์ทั้งหมดที่พบ:', listResult.items.map(item => item.name))
      return []
    }

    // ใช้ axios pattern สำหรับการจัดการ multiple async requests
    const filePromises = audioFiles.map(async (fileRef) => {
      try {
        // ใช้ Promise.all กับ axios pattern
        const [downloadURL, metadata] = await Promise.all([
          getDownloadURL(fileRef),
          getMetadata(fileRef)
        ])

        return {
          id: fileRef.name,
          name: fileRef.name,
          mimeType: metadata.contentType || 'audio/mpeg',
          size: metadata.size || 0,
          url: downloadURL,
          fullPath: fileRef.fullPath
        }
      } catch (error) {
        console.error(`❌ ไม่สามารถโหลดไฟล์ ${fileRef.name}:`, error)
        return null
      }
    })

    // ใช้ axios.all pattern (แต่ใช้ Promise.all แทน)
    const files = await Promise.all(filePromises)

    // กรองและเรียงไฟล์
    const validFiles = files
      .filter(file => file !== null)
      .sort((a, b) => a.name.localeCompare(b.name))

    console.log('✅ โหลดเพลงสำเร็จด้วย axios:', validFiles.length, 'ไฟล์')
    return validFiles

  } catch (error) {
    console.error('❌ โหลดรายการเพลงล้มเหลว:', error)
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      path: folderPath
    })
    
    // ใช้ axios error handling pattern
    let errorMessage = '❌ เกิดข้อผิดพลาดในการโหลดเพลง'
    
    if (error.code === 'storage/object-not-found' || error.code === 404) {
      errorMessage = `❌ ไม่พบโฟลเดอร์ที่ระบุ (404)\n\nPath: ${folderPath}\n\nกรุณาตรวจสอบ path ใน Firebase Console`
    } else if (error.code === 'storage/unauthorized' || error.code === 403) {
      errorMessage = '❌ ไม่มีสิทธิ์เข้าถึง Firebase Storage\n\nกรุณาตรวจสอบ Storage Rules'
    } else if (error.message) {
      errorMessage = `❌ ${error.message}`
    }
    
    alert(errorMessage)
    return []
  }
}

/**
 * โหลดรายการเพลงจาก API endpoint (ถ้ามี backend API)
 * @param {string} apiUrl - URL ของ API endpoint
 * @param {string} folderPath - Path ของโฟลเดอร์
 * @returns {Promise<Array>} Array ของไฟล์
 */
export const loadAudioFilesFromAPI = async (apiUrl, folderPath) => {
  try {
    console.log('📂 กำลังโหลดเพลงจาก API:', apiUrl)
    
    const response = await musicApi.get(apiUrl, {
      params: {
        path: folderPath
      }
    })
    
    if (response.data && Array.isArray(response.data)) {
      console.log('✅ โหลดเพลงสำเร็จจาก API:', response.data.length, 'ไฟล์')
      return response.data
    }
    
    return []
  } catch (error) {
    console.error('❌ โหลดจาก API ล้มเหลว:', error)
    
    if (error.response) {
      const status = error.response.status
      switch (status) {
        case 404:
          alert('❌ ไม่พบข้อมูล (404)')
          break
        case 500:
          alert('❌ Server Error (500)')
          break
        default:
          alert(`❌ เกิดข้อผิดพลาด: ${error.response.data?.message || error.message}`)
      }
    } else {
      alert('❌ ไม่สามารถเชื่อมต่อกับ API')
    }
    
    return []
  }
}

export default musicApi

