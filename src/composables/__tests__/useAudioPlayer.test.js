import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAudioPlayer } from '../useAudioPlayer'

// Mock the firebaseStorage module
vi.mock('../../plugins/firebaseStorage', () => {
  return {
    loadAudioFilesFromStorage: vi.fn()
  }
})

import { loadAudioFilesFromStorage } from '../../plugins/firebaseStorage'

const mockFiles = (folder, count = 2) => {
  return Array.from({ length: count }, (_, i) => ({
    name: `track${i + 1}.mp3`,
    url: `https://firebasestorage.googleapis.com/v0/b/musicplay-d9231.firebasestorage.app/o/${encodeURIComponent(folder)}track${i + 1}.mp3?alt=media&token=TEST_TOKEN`,
    size: 12345,
    contentType: 'audio/mpeg'
  }))
}

describe('useAudioPlayer - loadPlaylist', () => {
  beforeEach(() => {
    // reset mock implementation before each test
    vi.resetAllMocks()
  })

  it('loads playlist from a single folder path string', async () => {
    const folder = 'users/testUser/music/'
    loadAudioFilesFromStorage.mockResolvedValueOnce(mockFiles(folder))

    const { playlist, loadPlaylist } = useAudioPlayer()
    await loadPlaylist(folder)

    expect(loadAudioFilesFromStorage).toHaveBeenCalledOnce()
    expect(loadAudioFilesFromStorage).toHaveBeenCalledWith(folder)
    expect(playlist.value).toHaveLength(2)
    // verify source metadata added
    expect(playlist.value[0].sourceFolder).toBe(folder)
    expect(playlist.value[0].sourceUser).toBe('testUser')
  })

  it('loads playlist from an array of folder paths', async () => {
    const folders = ['users/a/music/', 'users/b/music/']
    loadAudioFilesFromStorage
      .mockResolvedValueOnce(mockFiles('users/a/music'))
      .mockResolvedValueOnce(mockFiles('users/b/music'))

    const { playlist, loadPlaylist } = useAudioPlayer()
    await loadPlaylist(folders)

    expect(loadAudioFilesFromStorage).toHaveBeenCalledTimes(2)
    expect(playlist.value).toHaveLength(4)
    // ensure sorting by name (track1 before track2)
    expect(playlist.value[0].name).toBe('track1.mp3')
  })

  it('continues loading when one folder fails', async () => {
    const folders = ['users/good/music/', 'users/bad/music/']
    loadAudioFilesFromStorage
      .mockResolvedValueOnce(mockFiles('users/good/music'))
      .mockRejectedValueOnce(new Error('Network error'))

    const { playlist, loadPlaylist } = useAudioPlayer()
    await loadPlaylist(folders)

    expect(loadAudioFilesFromStorage).toHaveBeenCalledTimes(2)
    expect(playlist.value).toHaveLength(2)
    // only files from the good folder should be present
    expect(playlist.value[0].sourceUser).toBe('good')
  })

  it('results in empty playlist when all folders fail', async () => {
    const folders = ['users/none1/', 'users/none2/']
    loadAudioFilesFromStorage.mockRejectedValue(new Error('404'))

    const { playlist, loadPlaylist } = useAudioPlayer()
    await loadPlaylist(folders)

    expect(playlist.value).toHaveLength(0)
  })
})
