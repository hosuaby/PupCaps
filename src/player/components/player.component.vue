<script setup lang="ts">
import {reactive} from 'vue';

const playerState = reactive({
  isPlaying: false,
  isBeginning: window.Player.isBeginning,
  isEnd: window.Player.isEnd,
});

window.Player.onStop = () => {
  playerState.isPlaying = false;
};

function prec() {
  window.Player.prec();
  updateState();
}

function next() {
  window.Player.next();
  updateState();
}

function togglePlay() {
  if (!playerState.isPlaying) {
    window.Player.play();
    playerState.isPlaying = true;
  } else {
    window.Player.stop();
  }
}

function updateState() {
  playerState.isBeginning = window.Player.isBeginning;
  playerState.isEnd = window.Player.isEnd;
}
</script>

<template>
  <section id="player-controller" class="section is-small">
    <div class="field has-addons has-addons-centered">
      <p class="control">
        <button class="button is-rounded"
                :disabled="playerState.isBeginning || playerState.isPlaying"
                @click="prec()">
          <span class="icon is-small">
            <i class="fa fa-backward"></i>
          </span>
          <span>Prec</span>
        </button>
      </p>
      <p class="control">
        <button class="button"
                :class="[ playerState.isPlaying ? 'is-danger' : 'is-primary' ]"
                @click="togglePlay()">
          <span class="icon is-small">
            <i class="fa"
               :class="[ playerState.isPlaying ? 'fa-stop' : 'fa-play' ]">
            </i>
          </span>
          <span>Play</span>
        </button>
      </p>
      <p class="control">
        <button class="button is-rounded"
                :disabled="playerState.isEnd || playerState.isPlaying"
                @click="next()">
          <span class="icon is-small">
            <i class="fa fa-forward"></i>
          </span>
          <span>Next</span>
        </button>
      </p>
    </div>
  </section>
</template>