<script setup lang="ts">
import {KaraokeGroup} from '../captions.service';

const props = defineProps<{ karaokeGroup: KaraokeGroup }>();

const karaokeGroup: KaraokeGroup = props.karaokeGroup;
const start = karaokeGroup.indexStart;
const end = karaokeGroup.indexEnd;
</script>

<template>
  <strong>{{ start }}</strong>

  <template v-if="start !== end">
    <i class="fas fa-arrow-right"></i>
    <strong>{{ end }}</strong>
  </template>
</template>