<template>
  <v-app>
    <v-main>
      <v-container fluid>
        <h2 class="text-h4 mb-4">เครื่องเล่นเพลง Google Drive (Vue/Vuetify)</h2>

        <AutoplayUnlockDialog 
          :showUnlockPrompt="!isUnlocked && playlist.length > 0"
          @unlock="handleUnlock"
        />

        <v-row>
          <v-col cols="12" md="4">
            <AudioControls 
              :current-track="currentTrack"
              :is-playing="isPlaying"
              :current-time="currentTime"
              :duration="duration"
              :volume="volume"
              @togglePlay="togglePlay"
              @playNext="playNextTrack"
              @playPrev="playPrevTrack"
              @seekAudio="seek"
              @setVolume="setVolume"
            />
          </v-col>

          <v-col cols="12" md="8">
            <PlaylistView 
              :playlist="playlist"
              :current-track-index="currentTrackIndex"
              :is-playing="isPlaying"
              @selectTrack="loadTrack"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useAudioPlayer } from './composables/useAudioPlayer'
import AudioControls from './components/AudioControls.vue'
import PlaylistView from './components/PlaylistView.vue'
import AutoplayUnlockDialog from './components/AutoplayUnlockDialog.vue'

// **********************************************
// 1. กำหนด Folder ID (ไม่ต้องใส่ API Key ที่นี่แล้ว)
// **********************************************
const GOOGLE_DRIVE_FOLDER_ID = '1jop3ta9AXsziyMJcMzJRXok0JwVERTBx'
// หรือใช้ URL เต็ม: 'https://drive.google.com/drive/folders/1jop3ta9AXsziyMJcMzJRXok0JwVERTBx'

const {
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
} = useAudioPlayer()

const currentTrack = computed(() => {
  if (playlist.value.length === 0 || currentTrackIndex.value === -1) {
    return { name: 'กำลังโหลด...', id: null }
  }
  return playlist.value[currentTrackIndex.value]
})

const handleUnlock = () => {
  unlockAudio()
  
  if (playlist.value.length > 0) {
    loadTrack(0)
  }
}

onMounted(async () => {
  // โหลดรายการเพลง (ไม่ต้องส่ง API Key แล้ว)
  await loadPlaylist(GOOGLE_DRIVE_FOLDER_ID)
})
</script>
