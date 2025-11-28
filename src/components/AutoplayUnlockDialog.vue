<template>
  <v-dialog v-model="show" max-width="400">
    <v-card>
      <v-card-title class="text-h6">Enable Audio Playback</v-card-title>
      <v-card-text>
        Your browser blocks audio autoplay. Please tap the button below to unlock audio playback.
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn color="primary" @click="unlock">Unlock</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';

// Props
const props = defineProps({
  showUnlockPrompt: { type: Boolean, required: true }
});

// Emits
const emit = defineEmits(['unlock']);

// Local dialog visibility (mirrors the prop)
const show = ref(props.showUnlockPrompt);

watch(() => props.showUnlockPrompt, (val) => {
  show.value = val;
});

const unlock = () => {
  emit('unlock');
  show.value = false;
};
</script>

<style scoped>
/* No custom styles needed – Vuetify handles the dialog appearance */
</style>
