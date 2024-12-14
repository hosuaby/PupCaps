<script setup lang="ts">
import {ref, provide} from 'vue';
import {saveAs} from 'file-saver';
import SrtFilePicker from './srt-file-picker.component.vue';
import {loadFile} from '../file-loader';
import {readCaptions} from '../../common/captions';
import {CaptionsService, KaraokeGroup} from '../captions.service';
import SubtitlesTable from './subtitles-table.component.vue';

const captionService = new CaptionsService();
provide('captionService', captionService);

const karaokeGroups = ref<KaraokeGroup[]>([]);
const downloadEnabled = ref<boolean>(false);

async function onFileSelected(file: File) {
  const content = await loadFile(file);
  const captions = readCaptions(content);
  captionService.readCaptions(captions);
  karaokeGroups.value = captionService.karaokeGroups;
  downloadEnabled.value = true;
}

function downloadSrt() {
  const blob = new Blob([captionService.asSrt], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, 'edited.srt');
}
</script>

<template>
  <div class="box">
    <form>
      <srt-file-picker @file-selected="onFileSelected">
      </srt-file-picker>

      <button type="button"
              class="button is-primary"
              :disabled="!downloadEnabled"
              @click="downloadSrt">
        <span class="icon">
          <i class="fa-solid fa-download"></i>
        </span>
        <span>Download</span>
      </button>
    </form>
  </div>

  <subtitles-table :karaoke-groups="karaokeGroups"></subtitles-table>
</template>