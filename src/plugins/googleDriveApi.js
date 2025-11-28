// src/plugins/googleDriveApi.js
import axios from 'axios'

const googleDriveApi = axios.create({
  baseURL: 'https://www.googleapis.com/drive/v3',
  timeout: 10000
})

// Request Interceptor - เพิ่ม API Key ทุก request
googleDriveApi.interceptors.request.use(
  (config) => {
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY?.trim()
    console.log('🔑 API Key loaded:', apiKey ? `${apiKey.substring(0, 5)}...` : 'None')
    
    if (!apiKey) {
      console.error('❌ VITE_GOOGLE_API_KEY ไม่ได้ถูกตั้งค่าใน .env')
      return Promise.reject(new Error('Google API Key is missing'))
    }
    
    // เพิ่ม API Key เข้าไปใน query params
    config.params = {
      ...config.params,
      key: apiKey
    }

    // Explicitly set Referer header (though browser usually handles this, this helps in some envs)
    // Note: Browsers may block setting 'Referer' manually for security, but we try anyway or rely on meta tag.
    // config.headers['Referer'] = window.location.origin + '/'
    
    console.log('📤 Request to:', config.url, config.params)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response Interceptor - จัดการ Error
googleDriveApi.interceptors.response.use(
  (response) => {
    console.log('✅ Response from:', response.config.url)
    return response
  },
  (error) => {
    if (error.response) {
      // Server ตอบกลับมา แต่มี error
      const status = error.response.status
      const message = error.response.data?.error?.message || error.message
      
      console.error(`❌ API Error (${status}):`, message)
      
      // จัดการ Error ตาม Status Code
      switch (status) {
        case 400:
          alert('❌ คำขอไม่ถูกต้อง (Bad Request)')
          break
        case 401:
          alert('❌ API Key ไม่ถูกต้องหรือหมดอายุ')
          break
        case 403:
          alert('❌ ไม่มีสิทธิ์เข้าถึง หรือ Quota เกินกำหนด')
          break
        case 404:
          alert('❌ ไม่พบโฟลเดอร์หรือไฟล์ที่ระบุ')
          break
        case 429:
          alert('⚠️ เรียก API บ่อยเกินไป กรุณารอสักครู่')
          break
        default:
          alert(`❌ เกิดข้อผิดพลาด: ${message}`)
      }
    } else if (error.request) {
      // ส่ง request แต่ไม่ได้รับ response
      console.error('❌ No response from server:', error.request)
      alert('❌ ไม่สามารถเชื่อมต่อกับ Google Drive API')
    } else {
      // เกิด error ก่อนส่ง request
      console.error('❌ Request setup error:', error.message)
      alert(`❌ เกิดข้อผิดพลาด: ${error.message}`)
    }
    
    return Promise.reject(error)
  }
)

export default googleDriveApi
