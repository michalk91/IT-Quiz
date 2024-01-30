<script setup lang="ts">
import { ref, toRefs } from 'vue'

const props = defineProps({
  category: String,
  difficulty: String
})

const { category, difficulty } = toRefs(props)

const questionsList = ref([])
const quizInfo = ref({
  questionNumber: 0,
  score: 0,
  finished: false
})

const questionCount = 10

const API_KEY = import.meta.env.VITE_API_KEY

async function getData() {
  try {
    const res = await fetch(
      `https://quizapi.io/api/v1/questions?category=${category?.value}&difficulty=${difficulty?.value}&limit=${questionCount}`,
      {
        headers: {
          'X-Api-Key': API_KEY
        }
      }
    )
    const finalRes = await res.json()
    questionsList.value = finalRes
    console.log(finalRes)
  } catch (error) {
    alert(`Something went wrong:  ${error}`)
  }
}

getData()

const handleQuestion = (e: MouseEvent) => {
  const convertProxy = JSON.parse(
    JSON.stringify(questionsList.value[quizInfo.value.questionNumber])
  )
  if (quizInfo.value.questionNumber <= questionCount) {
    if ((e?.currentTarget as HTMLElement).id === convertProxy.correct_answer) {
      quizInfo.value.score++
    }

    quizInfo.value.questionNumber++
  }
  if (quizInfo.value.questionNumber === questionCount) {
    quizInfo.value.finished = true
  }
}

const restartQuiz = () => {
  quizInfo.value.questionNumber = 0
  quizInfo.value.finished = false
  quizInfo.value.score = 0
}
</script>

<template>
  <main>
    <div v-if="!quizInfo.finished">
      <p>{{ (questionsList[quizInfo.questionNumber] as any)?.question }}</p>
      <p
        class="answer"
        id="answer_a"
        @click="handleQuestion"
        v-if="(questionsList[quizInfo.questionNumber] as any)?.answers.answer_a"
      >
        A. - {{ (questionsList[quizInfo.questionNumber] as any)?.answers.answer_a }}
      </p>
      <p
        class="answer"
        id="answer_b"
        @click="handleQuestion"
        v-if="(questionsList[quizInfo.questionNumber] as any)?.answers.answer_b"
      >
        B. - {{ (questionsList[quizInfo.questionNumber] as any)?.answers.answer_b }}
      </p>
      <p
        class="answer"
        id="answer_c"
        @click="handleQuestion"
        v-if="(questionsList[quizInfo.questionNumber] as any)?.answers.answer_c"
      >
        C. - {{ (questionsList[quizInfo.questionNumber] as any)?.answers.answer_c }}
      </p>
      <p
        class="answer"
        id="answer_d"
        @click="handleQuestion"
        v-if="(questionsList[quizInfo.questionNumber] as any)?.answers.answer_d"
      >
        D. - {{ (questionsList[quizInfo.questionNumber] as any)?.answers.answer_d }}
      </p>
    </div>
    <div v-if="quizInfo.finished">
      <p>Your score: {{ quizInfo.score }}</p>
      <button @click="restartQuiz">Try again</button>
    </div>
  </main>
</template>

<style>
.answer:hover {
  color: green;
  text-decoration: underline;
  cursor: pointer;
}
</style>
