<script setup lang="ts">
import Indexes from './indexes.component.vue';
import TimecodeComponent from './timecode.component.vue';
import {Timecode} from '../../common/timecodes';
import Words from './words.component.vue';
import {KaraokeGroup, KaraokeWord} from '../captions.service';

const props = defineProps<{ karaokeGroup: KaraokeGroup }>();

defineEmits<{
  (event: 'move-word-to-prec', value: KaraokeWord): void;
  (event: 'move-word-to-next', value: KaraokeWord): void;
}>();

const timecodeStart = new Timecode(props.karaokeGroup.startTimeMs);
const timecodeEnd = new Timecode(props.karaokeGroup.endTimeMs);

const hoursChanged = timecodeStart.hours !== timecodeEnd.hours;
const minutesChanged = timecodeStart.minutes !== timecodeEnd.minutes;
const secondsChanged = timecodeStart.seconds !== timecodeEnd.seconds;
const millisChanged = timecodeStart.millis !== timecodeEnd.millis;
</script>

<template>
  <tr>
    <td>
      <indexes v-bind="{ karaokeGroup: karaokeGroup }"></indexes>
    </td>
    <td>
      <timecode-component :timecode="timecodeStart"
                          :hours-changed="hoursChanged"
                          :minutes-changed="minutesChanged"
                          :seconds-changed="secondsChanged"
                          :millis-changed="millisChanged">
      </timecode-component>
    </td>
    <td>
      <timecode-component :timecode="timecodeEnd"
                          :hours-changed="hoursChanged"
                          :minutes-changed="minutesChanged"
                          :seconds-changed="secondsChanged"
                          :millis-changed="millisChanged">
      </timecode-component>
    </td>
    <td>
      <words :karaoke-group="props.karaokeGroup as KaraokeGroup"
             @move-word-to-prec="$emit('move-word-to-prec', $event as KaraokeWord)"
             @move-word-to-next="$emit('move-word-to-next', $event as KaraokeWord)">
      </words>
    </td>
  </tr>
</template>