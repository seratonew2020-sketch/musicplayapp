<template>
  <v-app>
    <v-main>
      <v-container class="pa-4 pt-0" style="min-height: 100vh;">


        <!-- Storage Path Selector -->
        <v-row class="mb-4" align="center">
          <v-col cols="12" sm="8" md="6">
            <v-text-field
              v-model="trackUrl"
              label="เพิ่มเพลงจาก URL Firebase Storage"
              placeholder="https://firebasestorage.googleapis.com/v0/b/musicplay-d9231.firebasestorage.app/o/users%2FBuxerwRsTqdw1H30u1BVLAj4mzM2%2Fmusic%2F/..."
              clearable
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4" md="2">
            <v-btn color="primary" @click="addTrackFromUrl" :disabled="!trackUrl">
              เพิ่มเพลง
            </v-btn>
          </v-col>
        </v-row>
        
        <v-row class="mb-4" align="center">
          <v-col cols="12" sm="8" md="6">
            <v-select
              v-model="selectedPaths"
              :items="storagePathOptions"
              label="เลือกโฟลเดอร์เพลง"
              multiple
              chips
              clearable
              hide-details
            ></v-select>
          </v-col>
          <v-col cols="12" sm="4" md="6" class="d-flex justify-end">
            <v-btn color="primary" variant="flat" @click="reloadPlaylist">
              โหลด Playlist
            </v-btn>
          </v-col>
        </v-row>

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
              <div>
                <span class="text-h6 font-weight-bold">Queue</span>
                <span class="text-caption text-medium-emphasis ml-2">({{ playlist.length }} เพลง)</span>
              </div>
              <v-spacer></v-spacer>
              <v-btn icon variant="text" @click="showQueue = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card-title>
            
            <v-divider></v-divider>

            <!-- Empty State -->
            <div v-if="playlist.length === 0" class="pa-8 text-center">
              <v-icon size="64" color="primary" class="mb-4">mdi-music-off</v-icon>
              <p class="text-body-1">ไม่มีเพลงใน Queue</p>
              <p class="text-caption text-medium-emphasis">กำลังโหลดจาก Firebase Storage...</p>
            </div>

            <!-- Queue List -->
            <v-list lines="two" class="bg-transparent" style="max-height: 60vh; overflow-y: auto;" v-else>
              <v-list-item
                v-for="(track, index) in playlist"
                :key="track.id || index"
                :value="index"
                :active="index === currentTrackIndex"
                active-color="primary"
                @click="loadTrack(index)"
                class="rounded-lg ma-2"
                :class="{ 'bg-primary-opacity': index === currentTrackIndex }"
              >
                <template v-slot:prepend>
                  <div class="d-flex align-center justify-center" style="width: 50px;">
                    <v-icon 
                      v-if="index === currentTrackIndex && isPlaying" 
                      color="primary" 
                      size="large"
                      class="animation-pulse"
                    >
                      mdi-equalizer
                    </v-icon>
                    <v-icon 
                      v-else-if="index === currentTrackIndex" 
                      color="primary" 
                      size="large"
                    >
                      mdi-pause-circle
                    </v-icon>
                    <span v-else class="text-body-2 text-medium-emphasis font-weight-bold">
                      {{ index + 1 }}
                    </span>
                  </div>
                </template>
                
                <v-list-item-title class="font-weight-medium text-wrap">
                  {{ track.name || 'Unknown Track' }}
                </v-list-item-title>
                <v-list-item-subtitle class="text-caption">
                  <div class="d-flex align-center mt-1">
                    <v-icon size="small" class="mr-1">mdi-cloud</v-icon>
                    <span>{{ track.sourceUser || 'Firebase Storage' }}</span>
                    <v-chip 
                      v-if="track.sourceUser" 
                      size="x-small" 
                      color="primary" 
                      variant="text"
                      class="ml-2"
                    >
                      {{ track.sourceUser.substring(0, 8) }}...
                    </v-chip>
                  </div>
                  <div class="d-flex align-center justify-space-between mt-1">
                    <span v-if="track.size" class="text-caption text-medium-emphasis">
                      {{ formatFileSize(track.size) }}
                    </span>
                    <span v-if="track.sourceFolder" class="text-caption text-medium-emphasis">
                      {{ track.sourceFolder.split('/').slice(-2, -1)[0] }}
                    </span>
                  </div>
                </v-list-item-subtitle>
                
                <template v-slot:append>
                  <v-icon 
                    v-if="index === currentTrackIndex" 
                    color="primary" 
                    size="small"
                  >
                    {{ isPlaying ? 'mdi-pause-circle' : 'mdi-play-circle' }}
                  </v-icon>
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
            <p class="text-subtitle-1 text-on-surface-variant mt-1">{{ currentTrack.artist || 'Firebase Storage' }}</p>
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
import { verifyStorageConnection } from './plugins/firebaseStorage'; 

// **********************************************
// 1. กำหนดค่า Firebase Storage Paths
// **********************************************
// **สามารถกำหนดหลายโฟลเดอร์ได้ - ไฟล์จะถูกรวมเข้า Queue**
// **สามารถกำหนดหลายโฟลเดอร์ได้ - ไฟล์จะถูกรวมเข้า Queue**
// **สามารถกำหนดหลายโฟลเดอร์ได้ - ไฟล์จะถูกรวมเข้า Queue**
const FIREBASE_STORAGE_PATHS = [
  'users/BuxerwRsTqdw1H30u1BVLAj4mzM2/music/',
  'users/eGiEPTHkK1WAgzAuWtp2EgKdRIa2/music/'
];

// ตัวเลือก Path สำหรับ Select
const storagePathOptions = [
  { title: 'User 1 (Buxer...)', value: 'users/BuxerwRsTqdw1H30u1BVLAj4mzM2/music/' },
  { title: 'User 2 (eGiEP...)', value: 'users/eGiEPTHkK1WAgzAuWtp2EgKdRIa2/music/' }
];

const selectedPaths = ref([...FIREBASE_STORAGE_PATHS]); // Default เลือกทั้งหมด

// Function โหลด Playlist ตาม path ที่เลือก
const reloadPlaylist = async () => {
  if (selectedPaths.value.length === 0) {
    alert('กรุณาเลือกอย่างน้อย 1 โฟลเดอร์');
    return;
  }
  
  // Pause playback if playing
  const audio = document.querySelector('audio');
  if (audio) audio.pause();
  
  await loadPlaylist(selectedPaths.value);
};

const trackUrl = ref('')

// ฟังก์ชันเพิ่มเพลงจาก URL Firebase Storage
const addTrackFromUrl = () => {
  if (!trackUrl.value) return
  const url = trackUrl.value.trim()
  const pattern = /^https:\/\/firebasestorage\.googleapis\.com\/v0\/b\/musicplay-d9231\.firebasestorage\.app\/o\//
  if (!pattern.test(url)) {
    // ใช้ alert แทน snackbar ชั่วคราว (หรือจะเปลี่ยนเป็น console warning ก็ได้)
    alert('URL ไม่ตรงกับรูปแบบ Firebase Storage ของโปรเจค')
    return
  }
  // ใช้ composable เพื่อเพิ่ม track
  addTrackByUrl(url)
  // เคลียร์ input
  trackUrl.value = ''
}

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
  setVolume,
  addTrackByUrl
} = useAudioPlayer();

// คำนวณเพลงที่กำลังเล่นปัจจุบันสำหรับ UI
const currentTrack = computed(() => {
  if (playlist.value.length === 0 || currentTrackIndex.value === -1) {
    return { name: 'กำลังโหลด...', artist: 'Connecting to Firebase', albumArt: null };
  }
  
  const track = playlist.value[currentTrackIndex.value];
  
  // จำลองข้อมูลเพิ่มเติม Artist/Album Art
  return { 
    name: track.name,
    artist: 'Firebase Storage Audio', 
    albumArt: 'https://placehold.co/500x500/1c1022/a413ec?text=Music' 
  };
});

// Helper: แปลงวินาทีเป็นรูปแบบ M:SS
const formatTime = (seconds) => {
  if (isNaN(seconds)) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
};

// Helper: แปลงขนาดไฟล์เป็นรูปแบบที่อ่านง่าย
const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
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
  console.log('🎵 เริ่มโหลด playlist จาก', FIREBASE_STORAGE_PATHS.length, 'โฟลเดอร์:', FIREBASE_STORAGE_PATHS);
  try {
    // โหลด playlist โดยใช้ Firebase Storage SDK โดยตรง
    await loadPlaylist(FIREBASE_STORAGE_PATHS);

    // หากโหลดสำเร็จ Dialog ปลดล็อกจะปรากฏขึ้นโดยอัตโนมัติ
    if (playlist.value.length > 0) {
      console.log('✅ โหลด playlist สำเร็จ - มี', playlist.value.length, 'ไฟล์ใน Queue');
    } else {
      console.warn('⚠️ ไม่พบเพลงใน Queue');
      console.warn('💡 ตรวจสอบว่า:');
      console.warn('   1. Firebase Storage มีไฟล์ในโฟลเดอร์ที่กำหนด');
      console.warn('   2. ตรวจสอบ Security Rules ของ Firebase Storage');
    }
  } catch (error) {
    console.error('❌ โหลด playlist ล้มเหลว:', error);
    alert('❌ ไม่สามารถโหลดเพลงได้\n\nกรุณาตรวจสอบ:\n1. Firebase configuration\n2. Network connection');
  }
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

/* ปรับแต่งปุ่มให้มีสีขาว, border-double และ border-radius */
.v-btn {
  border: double 3px white !important;
  border-radius: 12px !important;
  color: white !important;
}

/* สำหรับปุ่ม icon ให้ใช้ border-radius เป็นวงกลม */
.v-btn--icon {
  border-radius: 50% !important;
}

/* Queue item active state */
.bg-primary-opacity {
  background-color: rgba(164, 19, 236, 0.1) !important;
}

/* Animation for equalizer */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.05);
  }
}

.animation-pulse {
  animation: pulse 1s ease-in-out infinite;
}
</style>