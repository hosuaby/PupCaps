<script setup lang="ts">
import {KaraokeGroup, KaraokeWord} from '../captions.service';

const props = defineProps<{ karaokeGroup: KaraokeGroup }>();
defineEmits<{
  (event: 'move-word-to-prec', value: KaraokeWord): void;
  (event: 'move-word-to-next', value: KaraokeWord): void;
}>();

const karaokeGroup: KaraokeGroup = props.karaokeGroup;
</script>

<template>
  <span v-for="(word, index) in karaokeGroup.words"
        class="buttons has-addons is-inline-block">
    <button v-if="karaokeGroup.indexStart > 1 && index === 0"
            @click="$emit('move-word-to-prec', word as KaraokeWord)"
            class="button is-small is-rounded is-info">
      <span class="icon is-small">
        <i class="fas fa-chevron-left"></i>
      </span>
    </button>

    <button class="button is-small is-rounded">{{ word.rawWord }}</button>

    <button v-if="index === karaokeGroup.words.length - 1"
            @click="$emit('move-word-to-next', word as KaraokeWord)"
            class="button is-small is-rounded is-info">
      <span class="icon is-small">
        <i class="fas fa-chevron-right"></i>
      </span>
    </button>
  </span>
</template>