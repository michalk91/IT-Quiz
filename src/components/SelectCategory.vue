<script setup lang="ts">
import DisplayQuiz from '../components/DisplayQuiz.vue'

import { ref } from 'vue'

const categoryInfo = ref({ category: '', difficulty: '' })

const setCategory = (event: MouseEvent) => {
  categoryInfo.value.category = (event?.currentTarget as HTMLElement).innerText
}

const setDifficulty = (event: MouseEvent) => {
  categoryInfo.value.difficulty = (event?.currentTarget as HTMLElement).innerText
}

const resetQuizInfo = () => {
  categoryInfo.value.category = ''
  categoryInfo.value.difficulty = ''
}
</script>

<template>
  <main>
    <div class="btnsContainer" v-if="categoryInfo.category === ''">
      <p>Select a category:</p>
      <button @click="setCategory">Linux</button>
      <button @click="setCategory">DevOps</button>
      <button @click="setCategory">Docker</button>
      <button @click="setCategory">SQL</button>
    </div>
    <div
      class="btnsContainer"
      v-if="categoryInfo.difficulty === '' && categoryInfo.category !== ''"
    >
      <p>Select difficulty:</p>
      <button @click="setDifficulty">Easy</button>
      <button @click="setDifficulty">Medium</button>
      <button @click="setDifficulty">Hard</button>
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
