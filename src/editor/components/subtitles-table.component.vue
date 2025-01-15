<script setup lang="ts">
import {ref, inject, watch} from 'vue';
import Cue from './cue.component.vue';
import {CaptionsService, KaraokeGroup} from '../captions.service';

const props = defineProps<{ karaokeGroups: KaraokeGroup[] }>();
const captionService: CaptionsService = inject('captionService')!;
const groups = ref<KaraokeGroup[]>(props.karaokeGroups);

watch(
    () => props.karaokeGroups,
    (newValue) => {
      groups.value = newValue;
    }
);

function moveFirstWordToPrecedentGroup(groupId: number) {
  captionService.moveFirstWordToPrecedentGroup(groupId);
  groups.value = captionService.karaokeGroups;
}

function moveLastWordToNextGroup(groupId: number) {
  captionService.moveLastWordToNextGroup(groupId);
  groups.value = captionService.karaokeGroups;
}

function deleteKaraokeGroup(karaokeGroupId: string) {
  captionService.deleteKaraokeGroup(karaokeGroupId);
  groups.value = captionService.karaokeGroups;
}
</script>

<template>
  <table class="table is-fullwidth is-hoverable">
    <thead>
      <tr class="is-link">
        <th style="width: 3%"></th>
        <th class="has-text-white" style="width: 5%">Indexes</th>
        <th class="has-text-white" style="width: 15%">Start</th>
        <th class="has-text-white" style="width: 15%">End</th>
        <th class="has-text-white"> Caption</th>
      </tr>
    </thead>

    <tbody>
      <cue v-for="(karaokeGroup, index) in groups"
           :key="karaokeGroup.id"
           :karaoke-group="karaokeGroup"
           @move-word-to-prec="moveFirstWordToPrecedentGroup(index)"
           @move-word-to-next="moveLastWordToNextGroup(index)"
           @delete="deleteKaraokeGroup(karaokeGroup.id)"></cue>
    </tbody>
  </table>
</template>