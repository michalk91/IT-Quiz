<script setup lang="ts">
import { ref, toRefs } from 'vue'
import { useQuery } from 'vue-query'

const props = defineProps<{
  category: string
  difficulty: string
  resetQuizInfo: () => void
}>()

const API_KEY = import.meta.env.VITE_API_KEY
const questionCount = 10

const { category, difficulty } = toRefs(props)
const { resetQuizInfo } = props

const quizInfo = ref({
  questionNumber: 0,
  score: 0,
  finished: false
})

async function getData() {
  return await fetch(
    `https://quizapi.io/api/v1/questions?category=${category?.value}&difficulty=${difficulty?.value}&limit=${questionCount}`,
    {
      headers: {
        'X-Api-Key': API_KEY
      }
    }
  ).then((res) => res.json())
}

const { isLoading, isError, data, error } = useQuery(
  ['questions', category.value, difficulty.value, questionCount],
  getData,
  {
    staleTime: Infinity,
    cacheTime: 0,
    refetchOnWindowFocus: false
  }
)

const handleQuestion = (answer: string) => {
  const convertedData = JSON.parse(
    JSON.stringify(data.value[quizInfo.value.questionNumber].correct_answers)
  )
  let correctAnswer = ''

  Object.entries(convertedData).forEach(([key, item]) => {
    if (item === 'true') {
      correctAnswer = key.slice(0, -8)
    }
  })

  if (quizInfo.value.questionNumber <= questionCount) {
    if (answer === correctAnswer) {
      quizInfo.value.score++
    }
    quizInfo.value.questionNumber++
  }
  if (quizInfo.value.questionNumber === questionCount) {
    quizInfo.value.finished = true
  }
}

const restartCurrentCategory = () => {
  quizInfo.value.questionNumber = 0
  quizInfo.value.finished = false
  quizInfo.value.score = 0
}

const restartQuiz = () => {
  restartCurrentCategory()
  resetQuizInfo()
}
</script>

<template>
  <main>
    <span v-if="isLoading" class="loader"></span>
    <span v-else-if="isError">Error: {{ error.message }}</span>
    <div v-if="!quizInfo.finished && data">
      <p class="question-number">{{ quizInfo.questionNumber + 1 }} / {{ questionCount }}</p>
      <p class="question">{{ data && data[quizInfo.questionNumber].question }}</p>
      <p
        v-for="[letter, answer] in Object.entries(data[quizInfo.questionNumber].answers)"
        :key="letter"
        class="answer"
        @click="handleQuestion(letter)"
      >
        {{ answer && `${letter.slice(-1).toLocaleUpperCase()} - ${answer}` }}
      </p>
    </div>
    <div class="btnsContainer" v-if="quizInfo.finished">
      <p>Your score: {{ quizInfo.score }}/{{ questionCount }}</p>
      <button @click="restartCurrentCategory">Try again</button>
      <button @click="restartQuiz">Back to category</button>
    </div>
  </main>
</template>

<style>
.question-number {
  font-size: 1.9rem;
}
.question {
  font-weight: bolder;
}
.answer {
  font-size: 1.7rem;
}
.loader {
  margin-left: auto;
  margin-right: auto;
  margin-top: 10vh;
  width: 48px;
  height: 48px;
  border: 5px solid green;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
@media (hover: hover) {
  .answer:hover {
    color: green;
    cursor: pointer;
    font-weight: bold;
  }
}
</style>
