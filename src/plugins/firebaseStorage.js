// src/plugins/firebaseStorage.js
import { storage } from './firebase'
import { ref, listAll, getDownloadURL, getMetadata } from 'firebase/storage'

/**
 * โหลดรายการไฟล์เสียงจาก Firebase Storage
 * @param {string} folderPath - Path ของโฟลเดอร์ใน Firebase Storage (เช่น 'music/' หรือ 'audio/')
 * @returns {Promise<Array>} Array ของไฟล์พร้อม URL สำหรับเล่น
 */
export const loadAudioFilesFromStorage = async (folderPath = 'music/') => {
  // ทำความสะอาด path (ลบ / หน้าแรกถ้ามี)
  const cleanPath = folderPath.startsWith('/') ? folderPath.slice(1) : folderPath
  // ตรวจสอบว่ามี / ท้าย path
  const finalPath = cleanPath.endsWith('/') ? cleanPath : cleanPath + '/'
  
  try {
    console.log('📂 กำลังโหลดเพลงจาก Firebase Storage')
    console.log('📂 Path เดิม:', folderPath)
    console.log('📂 Path ที่ใช้:', finalPath)

    // สร้าง reference ไปยังโฟลเดอร์
    const folderRef = ref(storage, finalPath)

    // รับรายการไฟล์ทั้งหมดในโฟลเดอร์
    // ใช้ try-catch เพื่อจัดการ CORS errors
    let result
    try {
      result = await listAll(folderRef)
    } catch (listError) {
      // ถ้า listAll ล้มเหลวเนื่องจาก CORS หรือ 404
      // ลองใช้วิธีอื่นหรือแสดง error ที่ชัดเจน
      console.error('❌ listAll error:', listError)
      
      if (listError.code === 'storage/object-not-found' || 
          listError.message?.includes('404') ||
          listError.message?.includes('Not Found')) {
        throw new Error(`ไม่พบโฟลเดอร์: ${finalPath}\n\nกรุณาตรวจสอบ:\n1. โฟลเดอร์มีอยู่จริงใน Firebase Console\n2. Path ถูกต้อง\n3. Storage Rules อนุญาตให้อ่าน`)
      }
      
      // ถ้าเป็น CORS error
      if (listError.message?.includes('CORS') || 
          listError.message?.includes('OPTIONS') ||
          listError.code === 'storage/unauthorized') {
        throw new Error(`CORS Error: ไม่สามารถเข้าถึง Firebase Storage\n\nPath: ${finalPath}\n\nกรุณาตรวจสอบ:\n1. Storage Rules อนุญาตให้อ่าน\n2. Path ถูกต้อง\n3. Firebase Storage API ทำงานปกติ`)
      }
      
      throw listError
    }

    // กรองเฉพาะไฟล์เสียง
    const audioExtensions = ['.mp3', '.m4a', '.wav', '.ogg', '.flac', '.aac']
    const audioFiles = result.items.filter(item => {
      const name = item.name.toLowerCase()
      return audioExtensions.some(ext => name.endsWith(ext))
    })

    if (audioFiles.length === 0) {
      console.warn('⚠️ ไม่พบไฟล์เสียงในโฟลเดอร์:', finalPath)
      console.log('📋 ไฟล์ทั้งหมดที่พบ:', result.items.map(item => item.name))
      alert(`⚠️ ไม่พบไฟล์เสียงในโฟลเดอร์นี้\n\nPath: ${finalPath}\n\nไฟล์ที่พบ: ${result.items.length} ไฟล์\n\nกรุณาตรวจสอบว่าไฟล์มีนามสกุล: .mp3, .m4a, .wav, .ogg, .flac, .aac`)
      return []
    }

    // ดึงข้อมูลและ URL ของแต่ละไฟล์
    const files = await Promise.all(
      audioFiles.map(async (fileRef) => {
        try {
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
    )

    // กรองไฟล์ที่โหลดสำเร็จและเรียงตามชื่อ
    const validFiles = files
      .filter(file => file !== null)
      .sort((a, b) => a.name.localeCompare(b.name))

    console.log('✅ โหลดเพลงสำเร็จ:', validFiles.length, 'ไฟล์')
    return validFiles

  } catch (error) {
    console.error('❌ โหลดรายการเพลงล้มเหลว:', error)
    console.error('Error code:', error.code)
    console.error('Error message:', error.message)
    console.error('Path เดิม:', folderPath)
    console.error('Path ที่ใช้:', finalPath)
    
    // จัดการ Error ตามประเภท
    if (error.code === 'storage/object-not-found' || error.code === 404) {
      const errorMsg = `❌ ไม่พบโฟลเดอร์ที่ระบุใน Firebase Storage\n\nPath ที่ใช้: ${finalPath}\nPath เดิม: ${folderPath}\n\nกรุณาตรวจสอบ:\n1. โฟลเดอร์มีอยู่จริงใน Firebase Console\n2. Path ถูกต้อง (ไม่มี / หน้าแรก)\n3. มีไฟล์เสียงในโฟลเดอร์\n\nไปที่: https://console.firebase.google.com/project/musicplay-d9231/storage`
      alert(errorMsg)
    } else if (error.code === 'storage/unauthorized' || error.code === 403) {
      alert('❌ ไม่มีสิทธิ์เข้าถึง Firebase Storage\n\nPath: ' + finalPath + '\n\nกรุณาตรวจสอบ Storage Rules')
    } else if (error.code === 'storage/quota-exceeded') {
      alert('❌ Quota ของ Firebase Storage เกินกำหนด')
    } else if (error.message && error.message.includes('404')) {
      const errorMsg = `❌ ไม่พบไฟล์หรือโฟลเดอร์ (404)\n\nPath ที่ใช้: ${finalPath}\nPath เดิม: ${folderPath}\n\nกรุณาตรวจสอบ path ใน Firebase Console`
      alert(errorMsg)
    } else {
      const errorMsg = `❌ เกิดข้อผิดพลาด: ${error.message || error.code || 'Unknown error'}\n\nPath ที่ใช้: ${finalPath}`
      alert(errorMsg)
    }
    
    return []
  }
}

/**
 * ดึง URL สำหรับเล่นไฟล์เสียง
 * @param {string} filePath - Path ของไฟล์ใน Firebase Storage
 * @returns {Promise<string>} Download URL
 */
export const getAudioFileURL = async (filePath) => {
  try {
    const fileRef = ref(storage, filePath)
    const downloadURL = await getDownloadURL(fileRef)
    return downloadURL
  } catch (error) {
    console.error('❌ ไม่สามารถดึง URL ของไฟล์:', error)
    throw error
  }
}


