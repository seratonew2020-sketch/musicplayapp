<template>
  <v-card class="pa-2" elevation="2">
    <v-list>
      <v-list-item
        v-for="(track, index) in playlist"
        :key="track.id || index"
        :active="index === currentTrackIndex"
        @click="selectTrack(index)"
        :title="track.name"
      >
        <v-list-item-content>
          <v-list-item-title>{{ track.name }}</v-list-item-title>
        </v-list-item-content>
        <v-list-item-action>
          <v-icon v-if="index === currentTrackIndex && isPlaying">mdi-music</v-icon>
        </v-list-item-action>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup>


const props = defineProps({
  playlist: { type: Array, default: () => [] },
  currentTrackIndex: { type: Number, default: -1 },
  isPlaying: { type: Boolean, default: false },
});

const emit = defineEmits(['selectTrack']);

const selectTrack = (index) => {
  emit('selectTrack', index);
};
</script>

<style scoped>
.v-list-item--active {
  background-color: rgba(var(--v-theme-primary), 0.12);
}
</style>
