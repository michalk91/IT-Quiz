<script setup lang="ts">
import DisplayQuiz from '../components/DisplayQuiz.vue'

import { ref } from 'vue'

const categoryInfo = ref({ category: '', difficulty: '' })

const setCategory = (e: MouseEvent) => {
  if ((e?.target as HTMLElement).tagName !== 'BUTTON') return

  categoryInfo.value.category = (e?.target as HTMLElement).innerText
}

const setDifficulty = (e: MouseEvent) => {
  if ((e?.target as HTMLElement).tagName !== 'BUTTON') return

  categoryInfo.value.difficulty = (e?.target as HTMLElement).innerText
}

const resetQuizInfo = () => {
  categoryInfo.value.category = ''
  categoryInfo.value.difficulty = ''
}
</script>

<template>
  <main>
    <div @click="setCategory" class="btnsContainer" v-if="categoryInfo.category === ''">
      <p>Select a category:</p>
      <button>Code</button>
      <button>Linux</button>
      <button>DevOps</button>
      <button>Docker</button>
      <button>SQL</button>
    </div>
    <div
      @click="setDifficulty"
      class="btnsContainer"
      v-if="categoryInfo.difficulty === '' && categoryInfo.category !== ''"
    >
      <p>Select difficulty:</p>
      <button>Easy</button>
      <button>Medium</button>
      <button>Hard</button>
    </div>

    <DisplayQuiz
      v-if="categoryInfo.difficulty !== '' && categoryInfo.category !== ''"
      :="categoryInfo"
      :resetQuizInfo="resetQuizInfo"
    />
  </main>
</template>

<style>
main {
  margin: 20px 0 auto auto;
}
main p {
  font-size: 2rem;
  padding: 1rem;
}
</style>
