import express from 'express'
import cors from 'cors'
import { adminStorage } from './src/plugins/firebaseAdmin.js'

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    'http://127.0.0.1:5173'
  ],
  credentials: true
}))
app.use(express.json())

// Helper function: Get signed URL for file
const getSignedUrl = async (file, expiresIn = 3600) => {
  try {
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + expiresIn * 1000
    })
    return url
  } catch (error) {
    console.error('Error generating signed URL:', error)
    return null
  }
}

// Helper function: Filter audio files
const isAudioFile = (fileName) => {
  const audioExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac', '.webm']
  return audioExtensions.some(ext => fileName.toLowerCase().endsWith(ext))
}

/**
 * GET /api/music
 * ดึงรายการเพลงจาก Firebase Storage
 * 
 * Query Parameters:
 * - paths: comma-separated paths (optional, default: both user folders)
 *   Example: ?paths=users/BuxerwRsTqdw1H30u1BVLAj4mzM2/music,users/eGiEPTHkK1WAgzAuWtp2EgKdRIa2/music
 * - includeUrl: boolean (optional, default: false) - include signed URLs
 * - expiresIn: number (optional, default: 3600) - URL expiration in seconds
 */
app.get('/api/music', async (req, res) => {
  try {
    const { paths, includeUrl = 'false', expiresIn = '3600' } = req.query
    
    // Default paths
    const defaultPaths = [
      'users/BuxerwRsTqdw1H30u1BVLAj4mzM2/music/',
      'users/eGiEPTHkK1WAgzAuWtp2EgKdRIa2/music/'
    ]
    
    // Parse paths from query or use defaults
    const folderPaths = paths 
      ? paths.split(',').map(p => p.trim()).filter(p => p)
      : defaultPaths
    
    const shouldIncludeUrl = includeUrl === 'true'
    const urlExpiresIn = parseInt(expiresIn, 10) || 3600
    
    console.log('📂 Loading music from paths:', folderPaths)
    
    const bucket = adminStorage.bucket()
    const allFiles = []
    
    // Load files from each folder
    for (const folderPath of folderPaths) {
      const cleanPath = folderPath.endsWith('/') ? folderPath : folderPath + '/'
      
      try {
        const [files] = await bucket.getFiles({
          prefix: cleanPath
        })
        
        // Filter audio files and add metadata
        const audioFiles = files
          .filter(file => {
            const fileName = file.name.split('/').pop()
            return isAudioFile(fileName)
          })
          .map(file => {
            const fileName = file.name.split('/').pop()
            const metadata = {
              id: file.name,
              name: fileName,
              fullPath: file.name,
              sourceFolder: cleanPath,
              sourceUser: cleanPath.split('/')[1] || 'unknown',
              size: parseInt(file.metadata.size || 0, 10),
              contentType: file.metadata.contentType || 'audio/mpeg',
              updated: file.metadata.updated || file.metadata.timeCreated,
              created: file.metadata.timeCreated
            }
            
            return metadata
          })
        
        allFiles.push(...audioFiles)
        console.log(`✅ Loaded ${audioFiles.length} files from ${cleanPath}`)
      } catch (error) {
        console.error(`❌ Error loading from ${cleanPath}:`, error)
        // Continue with other folders
      }
    }
    
    // Sort by name
    allFiles.sort((a, b) => a.name.localeCompare(b.name))
    
    // Add signed URLs if requested
    if (shouldIncludeUrl) {
      console.log('🔗 Generating signed URLs...')
      for (const file of allFiles) {
        try {
          const fileRef = bucket.file(file.fullPath)
          const signedUrl = await getSignedUrl(fileRef, urlExpiresIn)
          file.url = signedUrl
        } catch (error) {
          console.error(`❌ Error generating URL for ${file.name}:`, error)
          file.url = null
        }
      }
    }
    
    res.json({
      success: true,
      count: allFiles.length,
      files: allFiles,
      paths: folderPaths
    })
  } catch (error) {
    console.error('❌ API Error:', error)
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'ไม่สามารถดึงข้อมูลเพลงได้'
    })
  }
})

/**
 * GET /api/music/:path*
 * ดึงรายการเพลงจาก path เฉพาะ
 * 
 * Example: /api/music/users/BuxerwRsTqdw1H30u1BVLAj4mzM2/music
 */
app.get('/api/music/*', async (req, res) => {
  try {
    const folderPath = req.params[0] || ''
    const { includeUrl = 'false', expiresIn = '3600' } = req.query
    
    if (!folderPath) {
      return res.status(400).json({
        success: false,
        error: 'Path is required'
      })
    }
    
    const cleanPath = folderPath.endsWith('/') ? folderPath : folderPath + '/'
    const shouldIncludeUrl = includeUrl === 'true'
    const urlExpiresIn = parseInt(expiresIn, 10) || 3600
    
    console.log('📂 Loading music from path:', cleanPath)
    
    const bucket = adminStorage.bucket()
    const [files] = await bucket.getFiles({
      prefix: cleanPath
    })
    
    // Filter audio files
    const audioFiles = files
      .filter(file => {
        const fileName = file.name.split('/').pop()
        return isAudioFile(fileName)
      })
      .map(file => {
        const fileName = file.name.split('/').pop()
        const metadata = {
          id: file.name,
          name: fileName,
          fullPath: file.name,
          sourceFolder: cleanPath,
          sourceUser: cleanPath.split('/')[1] || 'unknown',
          size: parseInt(file.metadata.size || 0, 10),
          contentType: file.metadata.contentType || 'audio/mpeg',
          updated: file.metadata.updated || file.metadata.timeCreated,
          created: file.metadata.timeCreated
        }
        
        return metadata
      })
    
    // Add signed URLs if requested
    if (shouldIncludeUrl) {
      for (const file of audioFiles) {
        try {
          const fileRef = bucket.file(file.fullPath)
          const signedUrl = await getSignedUrl(fileRef, urlExpiresIn)
          file.url = signedUrl
        } catch (error) {
          console.error(`❌ Error generating URL for ${file.name}:`, error)
          file.url = null
        }
      }
    }
    
    audioFiles.sort((a, b) => a.name.localeCompare(b.name))
    
    res.json({
      success: true,
      count: audioFiles.length,
      files: audioFiles,
      path: cleanPath
    })
  } catch (error) {
    console.error('❌ API Error:', error)
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'ไม่สามารถดึงข้อมูลเพลงได้'
    })
  }
})

/**
 * GET /api/music/url/:path*
 * ดึง signed URL สำหรับไฟล์เพลงเฉพาะ
 * 
 * Example: /api/music/url/users/BuxerwRsTqdw1H30u1BVLAj4mzM2/music/song.mp3
 * Query: ?expiresIn=3600 (optional)
 */
app.get('/api/music/url/*', async (req, res) => {
  try {
    const filePath = req.params[0] || ''
    const { expiresIn = '3600' } = req.query
    const urlExpiresIn = parseInt(expiresIn, 10) || 3600
    
    if (!filePath) {
      return res.status(400).json({
        success: false,
        error: 'File path is required'
      })
    }
    
    const bucket = adminStorage.bucket()
    const file = bucket.file(filePath)
    
    // Check if file exists
    const [exists] = await file.exists()
    if (!exists) {
      return res.status(404).json({
        success: false,
        error: 'File not found'
      })
    }
    
    // Get signed URL
    const signedUrl = await getSignedUrl(file, urlExpiresIn)
    
    if (!signedUrl) {
      return res.status(500).json({
        success: false,
        error: 'Failed to generate signed URL'
      })
    }
    
    res.json({
      success: true,
      url: signedUrl,
      path: filePath,
      expiresIn: urlExpiresIn
    })
  } catch (error) {
    console.error('❌ API Error:', error)
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'ไม่สามารถสร้าง URL ได้'
    })
  }
})

/**
 * GET /api/health
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString()
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Music API Server running on port ${PORT}`)
  console.log(`📡 API Endpoints:`)
  console.log(`   GET /api/music - ดึงรายการเพลงทั้งหมด`)
  console.log(`   GET /api/music/* - ดึงรายการเพลงจาก path`)
  console.log(`   GET /api/music/url/* - ดึง signed URL สำหรับไฟล์`)
  console.log(`   GET /api/health - Health check`)
})

export default app

