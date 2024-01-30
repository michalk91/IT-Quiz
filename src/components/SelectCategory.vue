<script setup lang="ts">
import DisplayQuiz from '../components/DisplayQuiz.vue'

import { ref } from 'vue'

const quizInfo = ref({ category: '', difficulty: '' })

const setCategory = (event: MouseEvent) => {
  quizInfo.value.category = (event?.currentTarget as HTMLElement).innerText
}

const setDifficulty = (event: MouseEvent) => {
  quizInfo.value.difficulty = (event?.currentTarget as HTMLElement).innerText
}
</script>

<template>
  <main>
    <div v-if="quizInfo.category === ''">
      <p>Select a category:</p>
      <button @click="setCategory">Linux</button>
      <button @click="setCategory">DevOps</button>
      <button @click="setCategory">Docker</button>
      <button @click="setCategory">SQL</button>
    </div>
    <div v-if="quizInfo.difficulty === '' && quizInfo.category !== ''">
      <p>Select difficulty:</p>
      <button @click="setDifficulty">Easy</button>
      <button @click="setDifficulty">Medium</button>
      <button @click="setDifficulty">Hard</button>
    </div>

    <DisplayQuiz v-if="quizInfo.difficulty !== '' && quizInfo.category !== ''" :="quizInfo" />
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

main button {
  border-radius: 10px;
  font-size: 1.5rem;
  padding: 1rem;

  margin: 0.5rem;
}
</style>
