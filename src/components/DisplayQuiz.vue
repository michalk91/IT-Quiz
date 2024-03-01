<script setup lang="ts">
import { ref, toRefs } from 'vue'
import { useQuery } from 'vue-query'
import { z } from 'zod'

const QuestionsSchema = z.array(
  z.object({
    answers: z.object({
      answer_a: z.string().nullable(),
      answer_b: z.string().nullable(),
      answer_c: z.string().nullable(),
      answer_d: z.string().nullable(),
      answer_e: z.string().nullable(),
      answer_f: z.string().nullable()
    }),
    category: z.string(),
    correct_answers: z.object({
      answer_a_correct: z.string(),
      answer_b_correct: z.string(),
      answer_c_correct: z.string(),
      answer_d_correct: z.string(),
      answer_e_correct: z.string(),
      answer_f_correct: z.string()
    }),
    difficulty: z.string(),
    question: z.string()
  })
)

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
  const response = await fetch(
    `https://quizapi.io/api/v1/questions?category=${category?.value}&difficulty=${difficulty?.value}&limit=${questionCount}`,
    {
      headers: {
        'X-Api-Key': API_KEY
      }
    }
  )
  const json = await response.json()

  return QuestionsSchema.parse(json)
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
      correctAnswer = correctAnswer === '' ? key.slice(0, -8) : correctAnswer
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
    <span v-else-if="isError" class="error"><strong>Error:</strong> {{ error.message }}</span>
    <div v-else-if="!quizInfo.finished && data">
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
    <div class="btnsContainer" v-else-if="quizInfo.finished">
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

.error {
  font-size: 2rem;
}

.error strong {
  font-weight: bold;
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
