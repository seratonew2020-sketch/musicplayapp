// src/plugins/firebaseStorage.js
import { storage } from './firebase'
import { ref, listAll, getDownloadURL, getMetadata } from 'firebase/storage'

/**
 * Retry helper with exponential backoff
 */
const retryWithBackoff = async (fn, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      if (i === maxRetries - 1) throw error
      
      // Exponential backoff: 1s, 2s, 4s
      const waitTime = delay * Math.pow(2, i)
      console.log(`⚠️ Retry ${i + 1}/${maxRetries} after ${waitTime}ms...`)
      await new Promise(resolve => setTimeout(resolve, waitTime))
    }
  }
}

/**
 * Process files in batches to avoid timeout
 */
const processBatch = async (files, batchSize = 5) => {
  const results = []
  for (let i = 0; i < files.length; i += batchSize) {
    const batch = files.slice(i, i + batchSize)
    console.log(`📦 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(files.length / batchSize)} (${batch.length} files)`)
    
    const batchResults = await Promise.all(
      batch.map(async (fileRef) => {
        try {
          // Retry individual file operations
          const [downloadURL, metadata] = await retryWithBackoff(async () => {
            return await Promise.all([
              getDownloadURL(fileRef),
              getMetadata(fileRef)
            ])
          }, 2, 500)
          
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
    
    results.push(...batchResults)
    
    // Small delay between batches to avoid overwhelming the API
    if (i + batchSize < files.length) {
      await new Promise(resolve => setTimeout(resolve, 200))
    }
  }
  return results
}

/**
 * ตรวจสอบการเชื่อมต่อ Firebase Storage
 * @returns {Promise<boolean>} true ถ้าเชื่อมต่อสำเร็จ
 */
export const verifyStorageConnection = async () => {
  try {
    console.log('🔍 กำลังตรวจสอบการเชื่อมต่อ Firebase Storage...')
    
    // ตรวจสอบว่า storage ถูก initialize แล้ว
    if (!storage) {
      console.error('❌ Firebase Storage ยังไม่ได้ initialize')
      return false
    }
    
    const bucket = storage.app.options.storageBucket
    console.log('📦 Storage Bucket:', bucket)
    
    if (!bucket) {
      console.error('❌ Storage Bucket ไม่ได้ถูกตั้งค่า')
      return false
    }
    
    // ตรวจสอบว่า bucket name ถูกต้อง (รองรับทั้ง appspot.com และ firebasestorage.app)
    if (!bucket.includes('musicplay-d9231')) {
      console.warn('⚠️ Storage Bucket อาจไม่ถูกต้อง:', bucket)
    }
    
    // ตรวจสอบว่าใช้ firebasestorage.app หรือ appspot.com
    const expectedBucket = 'musicplay-d9231.firebasestorage.app'
    const legacyBucket = 'musicplay-d9231.appspot.com'
    
    if (bucket === expectedBucket) {
      console.log('✅ ใช้ Firebase Storage bucket ใหม่ (firebasestorage.app)')
    } else if (bucket === legacyBucket) {
      console.log('⚠️ ใช้ Firebase Storage bucket เก่า (appspot.com)')
      console.log('💡 แนะนำให้ใช้: musicplay-d9231.firebasestorage.app')
    }
    
    console.log('✅ Firebase Storage configuration ถูกต้อง')
    console.log('📦 Bucket URL: gs://' + bucket)
    console.log('📦 Expected Path: gs://' + bucket + '/users/BuxerwRsTqdw1H30u1BVLAj4mzM2/music/')
    return true
  } catch (error) {
    console.error('❌ ไม่สามารถตรวจสอบ Firebase Storage:', error)
    console.error('Error code:', error.code)
    console.error('Error message:', error.message)
    return false
  }
}

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
    const bucket = storage.app.options.storageBucket
    const fullGSURL = `gs://${bucket}/${finalPath}`
    
    console.log('📦 Storage Bucket:', bucket)
    console.log('📦 Full GS URL:', fullGSURL)
    console.log('📂 Path เดิม:', folderPath)
    console.log('📂 Path ที่ใช้:', finalPath)
    console.log('📂 Full Storage Reference:', `gs://${bucket}/${finalPath}`)

    // สร้าง reference ไปยังโฟลเดอร์
    const folderRef = ref(storage, finalPath)
    console.log('📂 Firebase Storage Path:', folderRef.fullPath)
    console.log('✅ กำลังเข้าถึง:', `gs://${bucket}/${folderRef.fullPath}`)

    // รับรายการไฟล์ทั้งหมดในโฟลเดอร์
    // ใช้ retry logic เพื่อจัดการ retry limit errors
    let result
    try {
      console.log('🔄 กำลังเรียก listAll...')
      
      // Retry listAll with exponential backoff
      result = await retryWithBackoff(async () => {
        return await listAll(folderRef)
      }, 3, 2000) // 3 retries, start with 2s delay
      
      console.log('✅ listAll สำเร็จ - พบไฟล์ทั้งหมด:', result.items.length, 'ไฟล์')
      
      if (result.items.length > 50) {
        console.warn(`⚠️ พบไฟล์จำนวนมาก (${result.items.length} ไฟล์) - จะใช้ batch processing`)
      }
      
      // Log first 10 file names only to avoid console spam
      const fileNames = result.items.map(item => item.name)
      if (fileNames.length <= 10) {
        console.log('📋 รายชื่อไฟล์:', fileNames)
      } else {
        console.log('📋 ไฟล์แรก 10 ไฟล์:', fileNames.slice(0, 10))
        console.log(`📋 ... และอีก ${fileNames.length - 10} ไฟล์`)
      }
    } catch (listError) {
      // ถ้า listAll ล้มเหลวเนื่องจาก CORS หรือ 404
      // ลองใช้วิธีอื่นหรือแสดง error ที่ชัดเจน
      console.error('❌ listAll error:', listError)
      
      if (listError.code === 'storage/object-not-found' || 
          listError.message?.includes('404') ||
          listError.message?.includes('Not Found')) {
        throw new Error(`ไม่พบโฟลเดอร์: ${finalPath}\n\nกรุณาตรวจสอบ:\n1. โฟลเดอร์มีอยู่จริงใน Firebase Console\n2. Path ถูกต้อง\n3. Storage Rules อนุญาตให้อ่าน`)
      }
      
      // ถ้าเป็น retry limit exceeded
      if (listError.code === 'storage/retry-limit-exceeded' || 
          listError.message?.includes('retry-limit-exceeded') ||
          listError.message?.includes('Max retry time')) {
        throw new Error(`Retry Limit Exceeded: Firebase Storage ไม่สามารถโหลดไฟล์ได้\n\nPath: ${finalPath}\n\nสาเหตุที่เป็นไปได้:\n1. ไฟล์จำนวนมากเกินไป\n2. ปัญหาเครือข่าย\n3. Firebase Storage กำลังมีปัญหา\n\nกรุณาลอง:\n1. รอสักครู่แล้วลองใหม่\n2. ตรวจสอบการเชื่อมต่ออินเทอร์เน็ต\n3. ลดจำนวนไฟล์ในโฟลเดอร์`)
      }
      
      // ถ้าเป็น CORS error
      if (listError.message?.includes('CORS') || 
          listError.message?.includes('OPTIONS') ||
          listError.message?.includes('blocked by CORS policy') ||
          listError.code === 'storage/unauthorized') {
        const corsErrorMsg = `❌ CORS Error: ไม่สามารถเข้าถึง Firebase Storage\n\nPath: ${finalPath}\n\nสาเหตุ: Firebase Storage bucket ยังไม่ได้ตั้งค่า CORS สำหรับ localhost\n\nวิธีแก้ไข:\n1. ใช้ gsutil: gsutil cors set cors.json gs://musicplay-d9231.appspot.com\n2. หรือใช้ Google Cloud Console\n3. ดูคำแนะนำใน CORS_FIX.md\n\nหลังจากตั้งค่า CORS แล้ว:\n- รอ 1-2 นาที\n- Clear browser cache (Cmd+Shift+R)\n- รีเฟรชหน้า`
        console.error(corsErrorMsg)
        throw new Error(corsErrorMsg)
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
    // ใช้ batch processing เพื่อหลีกเลี่ยง retry limit
    console.log(`🔄 กำลังโหลดข้อมูลไฟล์ ${audioFiles.length} ไฟล์...`)
    const files = await processBatch(audioFiles, 5) // Process 5 files at a time

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
    } else if (error.message?.includes('CORS') || 
               error.message?.includes('blocked by CORS policy') ||
               error.message?.includes('OPTIONS')) {
      const corsMsg = `❌ CORS Error\n\nPath: ${finalPath}\n\nต้องตั้งค่า CORS ใน Google Cloud Storage:\n\n1. ใช้ gsutil:\n   gsutil cors set cors.json gs://musicplay-d9231.appspot.com\n\n2. หรือใช้ Google Cloud Console:\n   https://console.cloud.google.com/storage/browser?project=musicplay-d9231\n\nดูคำแนะนำใน: CORS_FIX.md`
      alert(corsMsg)
    } else if (error.code === 'storage/retry-limit-exceeded' || 
               error.message?.includes('retry-limit-exceeded') ||
               error.message?.includes('Max retry time')) {
      const errorMsg = `❌ Retry Limit Exceeded\n\nPath: ${finalPath}\n\nสาเหตุที่เป็นไปได้:\n1. ไฟล์จำนวนมากเกินไป (${audioFiles?.length || 'unknown'} ไฟล์)\n2. ปัญหาเครือข่าย\n3. Firebase Storage กำลังมีปัญหา\n\nวิธีแก้:\n1. รอสักครู่แล้วลองรีเฟรชหน้า\n2. ตรวจสอบการเชื่อมต่ออินเทอร์เน็ต\n3. ลดจำนวนไฟล์ในโฟลเดอร์\n4. ลองใช้ path ที่มีไฟล์น้อยกว่า`
      alert(errorMsg)
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

/**
 * รายการโฟลเดอร์และไฟล์ใน path ที่ระบุ (สำหรับ browsing)
 * @param {string} folderPath - Path ของโฟลเดอร์ (เช่น 'users/' หรือ 'users/userId/')
 * @returns {Promise<Object>} Object ที่มี folders และ files
 */
export const listStorageContents = async (folderPath = 'users/') => {
  // ทำความสะอาด path
  const cleanPath = folderPath.startsWith('/') ? folderPath.slice(1) : folderPath
  const finalPath = cleanPath.endsWith('/') ? cleanPath : cleanPath + '/'
  
  try {
    console.log('📂 กำลัง list เนื้อหาใน:', finalPath)
    console.log('📦 Bucket: gs://' + storage.app.options.storageBucket)
    
    const folderRef = ref(storage, finalPath)
    
    // Retry listAll with exponential backoff
    const result = await retryWithBackoff(async () => {
      return await listAll(folderRef)
    }, 3, 2000)
    
    console.log('✅ พบโฟลเดอร์:', result.prefixes.length, 'โฟลเดอร์')
    console.log('✅ พบไฟล์:', result.items.length, 'ไฟล์')
    
    return {
      folders: result.prefixes.map(prefix => ({
        name: prefix.name,
        fullPath: prefix.fullPath
      })),
      files: result.items.map(item => ({
        name: item.name,
        fullPath: item.fullPath
      })),
      path: finalPath
    }
  } catch (error) {
    console.error('❌ ไม่สามารถ list เนื้อหาได้:', error)
    throw error
  }
}


