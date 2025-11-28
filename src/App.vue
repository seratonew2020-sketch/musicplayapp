<template>
  <v-app>
    <v-main>
      <v-container class="pa-4 pt-0" style="min-height: 100vh;">
        
        <v-dialog 
          :model-value="!isUnlocked && playlist.length > 0" 
          :persistent="true" 
          max-width="400"
          :scrim="true"
        >
          <v-card title="🎵 เริ่มฟังเพลงอัตโนมัติ" color="surface">
            <v-card-text>
              เบราว์เซอร์จำเป็นต้องมีปฏิสัมพันธ์จากท่านก่อนเพื่อปลดล็อกการเล่นเสียง
              กรุณากดปุ่ม "เริ่มฟัง" เพื่อเปิดใช้งานการเล่นเพลงต่อเนื่อง.
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn 
                color="primary" 
                variant="flat" 
                @click="handleUnlockAndStart"
                text="เริ่มฟัง"
              ></v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

  <v-bottom-sheet v-model="showQueue" inset>
          <v-card class="rounded-t-xl" color="surface">
            <v-card-title class="d-flex align-center pa-4">
              <span class="text-h6 font-weight-bold">Queue ({{ playlist.length }})</span>
              <v-spacer></v-spacer>
              <v-btn icon variant="text" @click="showQueue = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card-title>
            
            <v-divider></v-divider>

            <v-list lines="one" class="bg-transparent" style="max-height: 60vh; overflow-y: auto;">
              <v-list-item
                v-for="(track, index) in playlist"
                :key="track.id"
                :value="index"
                :active="index === currentTrackIndex"
                active-color="primary"
                @click="loadTrack(index)"
                class="rounded-lg ma-2"
              >
                <template v-slot:prepend>
                  <div class="d-flex align-center justify-center" style="width: 40px;">
                    <v-icon v-if="index === currentTrackIndex" color="primary" class="animation-pulse">mdi-equalizer</v-icon>
                    <span v-else class="text-caption text-medium-emphasis">{{ index + 1 }}</span>
                  </div>
                </template>
                
                <v-list-item-title class="font-weight-medium">{{ track.name }}</v-list-item-title>
                <v-list-item-subtitle class="text-caption">Google Drive Audio</v-list-item-subtitle>
                
                <template v-slot:append>
                  <v-icon v-if="index === currentTrackIndex" color="primary" size="small">mdi-play-circle</v-icon>
                </template>
              </v-list-item>
            </v-list>
          </v-card>
        </v-bottom-sheet>

        <v-toolbar 
          :elevation="0" 
          color="background" 
          class="sticky top-0 z-20 backdrop-blur-sm"
          style="padding-top: 1rem;"
        >
          <v-btn icon @click="toggleQueue" color="white" variant="text">
            <v-icon>mdi-chevron-down</v-icon>
          </v-btn>
          
          <v-toolbar-title class="text-center">
            <div class="text-caption text-uppercase text-on-surface-variant">Now Playing</div>
            <div class="font-weight-bold">{{ currentTrack.name || 'กำลังโหลด...' }}</div>
          </v-toolbar-title>
          
          <v-btn icon @click="toggleQueue" color="white" variant="text">
            <v-icon>mdi-playlist-music</v-icon>
          </v-btn>
        </v-toolbar>

        <v-row class="mt-6 flex-grow-1" align="stretch">
          
          <v-col cols="12">
            <v-card 
              class="rounded-lg elevation-8" 
              color="surface-variant"
              :style="`box-shadow: 0 10px 30px 0 rgba(164, 19, 236, 0.4)!important;`"
              :aspect-ratio="1"
            >
              <v-img 
                :src="currentTrack.albumArt || 'https://placehold.co/500x500/1c1022/FFFFFF?text=Album+Art'" 
                cover
                class="rounded-lg"
              >
              </v-img>
            </v-card>
          </v-col>
          
          <v-col cols="12" class="text-center mt-4">
            <h1 class="text-h4 font-weight-bold">{{ currentTrack.name || 'Unknown Track' }}</h1>
            <p class="text-subtitle-1 text-on-surface-variant mt-1">{{ currentTrack.artist || 'Google Drive' }}</p>
          </v-col>

          <v-col cols="12" class="mt-4">
            <v-slider
              :model-value="currentTime"
              :max="duration"
              :min="0"
              color="primary"
              track-color="white"
              track-fill-color="primary"
              hide-details
              density="compact"
              @update:model-value="seek"
            >
              <template v-slot:thumb-label="{ modelValue }">
                </template>
              
              <template v-slot:append>
                <span class="text-caption text-on-surface-variant">{{ formatTime(duration) }}</span>
              </template>
              
              <template v-slot:prepend>
                <span class="text-caption text-on-surface-variant">{{ formatTime(currentTime) }}</span>
              </template>
            </v-slider>
          </v-col>

          <v-col cols="12" class="mt-6 d-flex justify-space-between align-center">
            
            <v-btn icon variant="text" size="large" color="white">
              <v-icon>mdi-shuffle</v-icon>
            </v-btn>
            
            <v-btn icon variant="text" size="x-large" @click="playPrevTrack">
              <v-icon size="40">mdi-skip-previous</v-icon>
            </v-btn>
            
            <v-btn 
              icon 
              size="x-large" 
              :color="isPlaying? 'secondary' : 'primary'" 
              class="elevation-4" 
              :class="{'shadow-lg shadow-primary/40':!isPlaying}"
              @click="togglePlay"
              style="width: 80px; height: 80px;"
            >
              <v-icon size="50">
                {{ isPlaying? 'mdi-pause' : 'mdi-play' }}
              </v-icon>
            </v-btn>
            
            <v-btn icon variant="text" size="x-large" @click="playNextTrack">
              <v-icon size="40">mdi-skip-next</v-icon>
            </v-btn>
            
            <v-btn icon variant="text" size="large" color="primary">
              <v-icon>mdi-repeat</v-icon>
            </v-btn>
          </v-col>

          <v-col cols="12" class="mt-8">
            <v-sheet 
              class="rounded-full pa-1 d-flex" 
              color="white" 
              style="background-color: rgba(255, 255, 255, 0.05)!important;"
            >
              <v-btn 
                variant="flat" 
                color="primary" 
                class="flex-grow-1 rounded-pill text-subtitle-2 font-weight-semibold"
              >
                Mixing
              </v-btn>
              <v-btn 
                variant="text" 
                color="white" 
                class="flex-grow-1 rounded-pill text-subtitle-2 font-weight-semibold"
              >
                Lyrics
              </v-btn>
              <v-btn 
                variant="text" 
                color="white" 
                class="flex-grow-1 rounded-pill text-subtitle-2 font-weight-semibold"
                @click="toggleQueue"
              >
                Queue
              </v-btn>
            </v-sheet>
          </v-col>

          <v-col cols="12" class="mt-6 space-y-4">
            <v-card 
              class="pa-4 rounded-lg" 
              color="white" 
              style="background-color: rgba(255, 255, 255, 0.05)!important;"
            >
              <div class="d-flex justify-space-between align-center">
                <p class="font-weight-medium">Crossfade</p>
                <span class="text-subtitle-2 text-on-surface-variant">6s</span>
              </div>
              <div class="d-flex align-center mt-2">
                <v-icon size="small" color="white" class="mr-3">mdi-timer-off-outline</v-icon>
                <v-slider
                  model-value="6"
                  max="12"
                  min="0"
                  color="primary"
                  track-color="primary"
                  track-fill-color="primary"
                  hide-details
                  density="compact"
                ></v-slider>
                <v-icon size="small" color="white" class="ml-3">mdi-timer</v-icon>
              </div>
            </v-card>

            <v-card 
              class="pa-4 rounded-lg d-flex justify-space-between align-center" 
              color="white" 
              style="background-color: rgba(255, 255, 255, 0.05)!important;"
            >
              <p class="font-weight-medium">Gapless Playback</p>
              <v-switch 
                color="primary" 
                :model-value="true" 
                hide-details
                density="compact"
                class="flex-grow-0"
              ></v-switch>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue';
import { useAudioPlayer } from './composables/useAudioPlayer'; 

// **********************************************
// 1. กำหนดค่า API และ Folder ID
// **********************************************
// **สำคัญ: ต้องแทนที่ค่าเหล่านี้ด้วยคีย์จริงและ ID โฟลเดอร์จริงของคุณ**
const GOOGLE_DRIVE_FOLDER_ID = '1jop3ta9AXsziyMJcMzJRXok0JwVERTBx';

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
} = useAudioPlayer();

// คำนวณเพลงที่กำลังเล่นปัจจุบันสำหรับ UI
const currentTrack = computed(() => {
  if (playlist.value.length === 0 || currentTrackIndex.value === -1) {
    return { name: 'กำลังโหลด...', artist: 'Connecting to Drive', albumArt: null };
  }
  
  const track = playlist.value[currentTrackIndex.value];
  
  // จำลองข้อมูลเพิ่มเติม Artist/Album Art (หากมีข้อมูลนี้ใน Drive API หรือ Metadata)
  return { 
    name: track.name,
    artist: 'Google Drive Audio', 
    albumArt: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDglhv36b23gCMNpx1extR-76cGF31OU53_CXZEWWNicTeqUrNr-OaEK6LXhPxqGtFLY8EHRR2qPHRPDTMjo_YBVckVdommdMZ001_X8FC2mgJQm0a60Z8EtHnKOUkXGlL-PzwirNzoe2qG3c1SDXwDD3Jrhfza_9l8nrzmCA8xGGQGCneUYuJeNAcveCU_6qaaUnsUEyNB4Eb69NHjhSur2OAdDis_t31upOz--qXVgCWso1y8XSt3yrD6OQCtkCEKwdZZB2LW3g' 
  };
});

// Helper: แปลงวินาทีเป็นรูปแบบ M:SS
const formatTime = (seconds) => {
  if (isNaN(seconds)) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
};

// จัดการการปลดล็อกและการเริ่มเล่นครั้งแรก
const handleUnlockAndStart = () => {
  unlockAudio();
  if (playlist.value.length > 0) {
    loadTrack(0); // เริ่มโหลดและเล่นเพลงแรก
  }
};

const showQueue = ref(false);

const toggleQueue = () => {
  showQueue.value = !showQueue.value;
};

onMounted(async () => {
  // โหลดรายการเพลงจาก Google Drive เมื่อ Component ถูก Mount
  await loadPlaylist(GOOGLE_DRIVE_FOLDER_ID);
  
  // หากโหลดสำเร็จ Dialog ปลดล็อกจะปรากฏขึ้นโดยอัตโนมัติ
});
</script>

<style scoped>
/* Vuetify จัดการ Dark Mode และการตอบสนองส่วนใหญ่แล้ว 
   ใช้ CSS เฉพาะสำหรับการปรับแต่งรายละเอียด */
.v-container {
  max-width: 550px; /* จำกัดความกว้างเหมือนมือถือ */
}

/* การปรับแต่งเงาปุ่มสำหรับความรู้สึกแบบเดิม */
.shadow-lg {
  box-shadow: 0 10px 15px -3px var(--v-theme-primary);
}

.v-btn:focus {
  outline: none;
}
</style>