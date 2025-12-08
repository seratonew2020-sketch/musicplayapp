// src/plugins/musicApi.js
import axios from 'axios'
import { storage } from './firebase'
import { ref, getDownloadURL } from 'firebase/storage'

// สร้าง axios instance สำหรับ Music API
const musicApi = axios.create({
  timeout: 60000, // 60 seconds (เพิ่มขึ้นเพื่อรองรับไฟล์จำนวนมาก)
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
 * โหลดรายการเพลงจาก API endpoint
 * @param {string} apiBaseUrl - Base URL ของ API (default: http://localhost:3000)
 * @param {string|Array} paths - Path(s) ของโฟลเดอร์ (optional, default: ทั้ง 2 โฟลเดอร์)
 * @param {boolean} includeUrl - Include signed URLs (default: true)
 * @returns {Promise<Array>} Array ของไฟล์
 */
export const loadAudioFilesFromAPI = async (
  apiBaseUrl = 'http://localhost:3000',
  paths = null,
  includeUrl = true
) => {
  try {
    // ตั้งค่า base URL สำหรับ musicApi
    const api = axios.create({
      baseURL: apiBaseUrl,
      timeout: 60000, // 60 seconds (เพิ่มขึ้นเพื่อรองรับไฟล์จำนวนมาก)
      headers: {
        'Content-Type': 'application/json',
      }
    })

    let apiUrl = '/api/music'
    const params = {
      includeUrl: includeUrl.toString(),
      expiresIn: '3600'
    }

    // ถ้ามี paths ระบุมา ให้ส่งเป็น query parameter
    if (paths) {
      if (Array.isArray(paths)) {
        params.paths = paths.join(',')
      } else {
        params.paths = paths
      }
    }

    console.log('📂 กำลังโหลดเพลงจาก API:', `${apiBaseUrl}${apiUrl}`)
    console.log('📋 Parameters:', params)
    
    const response = await api.get(apiUrl, { params })
    
    if (response.data && response.data.success && Array.isArray(response.data.files)) {
      const files = response.data.files.map(file => ({
        id: file.id || file.fullPath,
        name: file.name,
        mimeType: file.contentType || file.mimeType || 'audio/mpeg',
        size: file.size || 0,
        url: file.url || null,
        fullPath: file.fullPath,
        sourceFolder: file.sourceFolder,
        sourceUser: file.sourceUser
      }))
      
      console.log('✅ โหลดเพลงสำเร็จจาก API:', files.length, 'ไฟล์')
      console.log('📊 Summary:', {
        total: response.data.count,
        paths: response.data.paths || [response.data.path]
      })
      
      return files
    }
    
    console.warn('⚠️ API response ไม่ถูกต้อง:', response.data)
    return []
  } catch (error) {
    console.error('❌ โหลดจาก API ล้มเหลว:', error)
    
    if (error.response) {
      const status = error.response.status
      const errorData = error.response.data
      
      let errorMessage = '❌ เกิดข้อผิดพลาดในการโหลดเพลงจาก API'
      
      switch (status) {
        case 404:
          errorMessage = '❌ ไม่พบข้อมูล (404)\n\nกรุณาตรวจสอบ path ใน Firebase Storage'
          break
        case 500:
          errorMessage = `❌ Server Error (500)\n\n${errorData?.message || errorData?.error || 'Internal server error'}`
          break
        case 400:
          errorMessage = `❌ Bad Request (400)\n\n${errorData?.error || 'Invalid request parameters'}`
          break
        default:
          errorMessage = `❌ เกิดข้อผิดพลาด (${status})\n\n${errorData?.message || errorData?.error || error.message}`
      }
      
      alert(errorMessage)
    } else if (error.request) {
      alert('❌ ไม่สามารถเชื่อมต่อกับ API Server\n\nกรุณาตรวจสอบว่า server ทำงานอยู่ที่ http://localhost:3000')
    } else {
      alert(`❌ เกิดข้อผิดพลาด: ${error.message}`)
    }
    
    return []
  }
}

export default musicApi

