<script setup lang="ts">
import {ref} from 'vue';

const emit = defineEmits<{
  (event: 'file-selected', value: File): void;
}>();

const selectedFile = ref<File>();

function onFileSelected(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    selectedFile.value = file;
    emit('file-selected', file);
  }
}
</script>

<template>
  <div class="file has-name">
    <label class="file-label">
      <input name="srt_file"
             class="file-input"
             type="file"
             accept=".srt"
             @change="onFileSelected" />

      <span class="file-cta">
        <span class="file-icon">
          <i class="fa fa-upload"></i>
        </span>
        <span class="file-label">Pick subs file</span>
      </span>
      <span class="file-name is-fullwidth">{{ selectedFile?.name }}</span>
    </label>
  </div>
</template>