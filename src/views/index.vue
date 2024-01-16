<template>
  <div class="h-screen w-screen" ref="canvasBox">
    <div ref="myCanvas"></div>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as Phaser from 'Phaser'
import RoundRectanglePlugin from 'phaser3-rex-plugins/plugins/roundrectangle-plugin.js'

import Game from '../components/game.js'

let myCanvas = ref(null)
let canvasBox = ref(null)
let game

onMounted(() => {
  let config = {
    type: Phaser.AUTO,
    width: canvasBox.value.clientWidth,
    height: canvasBox.value.clientHeight,
    parent: myCanvas.value,
    backgroundColor: '#fff',
    scene: [new Game()],
    // 禁用右键菜单
    disableContextMenu: true,
    plugins: {
      global: [
        {
          key: 'rexRoundRectanglePlugin',
          plugin: RoundRectanglePlugin,
          start: true,
        },
      ],
    },
  }
  game = new Phaser.Game(config)
})

onUnmounted(() => {
  for (let key in game.scene.keys) {
    if (game.scene.keys.hasOwnProperty(key)) {
      game.scene.stop(key)
      game.scene.keys[key] = undefined
    }
  }
})
</script>
<style scoped></style>
