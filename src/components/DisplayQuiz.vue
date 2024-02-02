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
  const res = await fetch(
    `https://quizapi.io/api/v1/questions?category=${category?.value}&difficulty=${difficulty?.value}&limit=${questionCount}`,
    {
      headers: {
        'X-Api-Key': API_KEY
      }
    }
  )
  const finalRes = await res.json()
  return finalRes
}
function useQuestionsQuery() {
  return useQuery(['questions', category.value, difficulty.value, questionCount], getData, {
    staleTime: Infinity,
    cacheTime: 0,
    refetchOnWindowFocus: false
  })
}
const { isLoading, isError, data, error } = useQuestionsQuery()

const handleQuestion = (correctAnswer: string) => {
  if (quizInfo.value.questionNumber <= questionCount) {
    if (correctAnswer === 'true') {
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
    <div v-if="!quizInfo.finished">
      <p class="question-number">{{ quizInfo.questionNumber + 1 }} / {{ questionCount }}</p>
      <p class="question">{{ data[quizInfo.questionNumber].question }}</p>
      <p
        class="answer"
        id="answer_a"
        @click="handleQuestion(data[quizInfo.questionNumber].correct_answers.answer_a_correct)"
        v-if="data[quizInfo.questionNumber].answers.answer_a"
      >
        A. - {{ data[quizInfo.questionNumber].answers.answer_a }}
      </p>
      <p
        class="answer"
        id="answer_b"
        @click="handleQuestion(data[quizInfo.questionNumber].correct_answers.answer_b_correct)"
        v-if="data[quizInfo.questionNumber].answers.answer_b"
      >
        B. - {{ data[quizInfo.questionNumber].answers.answer_b }}
      </p>
      <p
        class="answer"
        id="answer_c"
        @click="handleQuestion(data[quizInfo.questionNumber].correct_answers.answer_c_correct)"
        v-if="data[quizInfo.questionNumber].answers.answer_c"
      >
        C. - {{ data[quizInfo.questionNumber].answers.answer_c }}
      </p>
      <p
        class="answer"
        id="answer_d"
        @click="handleQuestion(data[quizInfo.questionNumber].correct_answers.answer_d_correct)"
        v-if="data[quizInfo.questionNumber].answers.answer_d"
      >
        D. - {{ data[quizInfo.questionNumber].answers.answer_d }}
      </p>
      <p
        class="answer"
        id="answer_e"
        @click="handleQuestion(data[quizInfo.questionNumber].correct_answers.answer_e_correct)"
        v-if="data[quizInfo.questionNumber].answers.answer_e"
      >
        E. - {{ data[quizInfo.questionNumber].answers.answer_e }}
      </p>
      <p
        class="answer"
        id="answer_f"
        @click="handleQuestion(data[quizInfo.questionNumber].correct_answers.answer_f_correct)"
        v-if="data[quizInfo.questionNumber].answers.answer_f"
      >
        F. - {{ data[quizInfo.questionNumber].answers.answer_f }}
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
