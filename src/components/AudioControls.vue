<template>
  <v-card class="pa-4" elevation="2">
    <div class="d-flex justify-space-between align-center mb-2">
      <div class="text-subtitle-1 font-weight-medium">{{ currentTrack?.name || 'ไม่มีเพลง' }}</div>
      <v-btn icon @click="togglePlay">
        <v-icon>{{ isPlaying ? 'mdi-pause' : 'mdi-play' }}</v-icon>
      </v-btn>
    </div>
    <v-slider
      v-model="localTime"
      :max="duration"
      step="0.1"
      hide-details
      @change="onSeek"
    ></v-slider>
    <div class="d-flex justify-space-between text-caption mt-1">
      <span>{{ formatTime(localTime) }}</span>
      <span>{{ formatTime(duration) }}</span>
    </div>
    <v-slider
      v-model="localVolume"
      :max="1"
      step="0.01"
      hide-details
      class="mt-4"
      @change="onVolume"
    ></v-slider>
    <div class="text-caption text-center mt-1">Volume: {{ Math.round(localVolume * 100) }}%</div>
    <div class="d-flex justify-space-between mt-2">
      <v-btn icon @click="playPrev"><v-icon>mdi-skip-previous</v-icon></v-btn>
      <v-btn icon @click="playNext"><v-icon>mdi-skip-next</v-icon></v-btn>
    </div>
  </v-card>
</template>

<script setup>
import { ref, watch } from 'vue';

// Props
const props = defineProps({
  currentTrack: { type: Object, default: null },
  isPlaying: { type: Boolean, required: true },
  currentTime: { type: Number, required: true },
  duration: { type: Number, required: true },
  volume: { type: Number, required: true },
});

// Emits
const emit = defineEmits(['togglePlay', 'playNext', 'playPrev', 'seekAudio', 'setVolume']);

const localTime = ref(props.currentTime);
const localVolume = ref(props.volume);

watch(() => props.currentTime, (newVal) => {
  if (Math.abs(newVal - localTime.value) > 0.5) {
    localTime.value = newVal;
  }
});

watch(() => props.volume, (newVal) => {
  localVolume.value = newVal;
});

const togglePlay = () => emit('togglePlay');
const playNext = () => emit('playNext');
const playPrev = () => emit('playPrev');

const onSeek = () => emit('seekAudio', localTime.value);
const onVolume = () => emit('setVolume', localVolume.value);

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');
  return `${mins}:${secs}`;
};
</script>

<style scoped>
.v-card {
  width: 100%;
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
</style>
