<script setup lang="ts">
import {Timecode} from '../../common/timecodes';

defineProps<{
  timecode: Timecode,
  hoursChanged?: boolean,
  minutesChanged?: boolean,
  secondsChanged?: boolean,
  millisChanged?: boolean,
}>();
</script>

<template>
  <div class="tags has-addons">
    <span class="tag"
          :class="{ 'is-warning': hoursChanged }">
      {{ (timecode as Timecode).hh }}
    </span>
    <span>:</span>
    <span class="tag"
          :class="{ 'is-warning': minutesChanged }">
      {{ (timecode as Timecode).mm }}
    </span>
    <span>:</span>
    <span class="tag"
          :class="{ 'is-warning': secondsChanged }">
      {{ (timecode as Timecode).ss }}
    </span>
    <span>,</span>
    <span class="tag"
          :class="{ 'is-warning': millisChanged }">
      {{ (timecode as Timecode).SSS }}
    </span>
  </div>
</template>