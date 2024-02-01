<script setup lang="ts">
import { ref, toRefs } from 'vue'
import { useQuery } from 'vue-query'

const props = defineProps<{
  category: string
  difficulty: string
  resetQuizInfo: () => void
}>()

const { category, difficulty } = toRefs(props)
const { resetQuizInfo } = props

const questionsList = ref([])
const quizInfo = ref({
  questionNumber: 0,
  score: 0,
  finished: false
})

const questionCount = 10

const API_KEY = import.meta.env.VITE_API_KEY

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
  return useQuery('questions', getData, {
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnWindowFocus: false
  })
}
const { isLoading, isError, data, error } = useQuestionsQuery()

const handleQuestion = (e: MouseEvent) => {
  const convertProxy = JSON.parse(JSON.stringify(data.value[quizInfo.value.questionNumber]))

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
      <p class="question">{{ (data[quizInfo.questionNumber] as any)?.question }}</p>
      <p
        class="answer"
        id="answer_a"
        @click="handleQuestion"
        v-if="(data[quizInfo.questionNumber] as any)?.answers.answer_a"
      >
        A. - {{ (data[quizInfo.questionNumber] as any)?.answers.answer_a }}
      </p>
      <p
        class="answer"
        id="answer_b"
        @click="handleQuestion"
        v-if="(data[quizInfo.questionNumber] as any)?.answers.answer_b"
      >
        B. - {{ (data[quizInfo.questionNumber] as any)?.answers.answer_b }}
      </p>
      <p
        class="answer"
        id="answer_c"
        @click="handleQuestion"
        v-if="(data[quizInfo.questionNumber] as any)?.answers.answer_c"
      >
        C. - {{ (data[quizInfo.questionNumber] as any)?.answers.answer_c }}
      </p>
      <p
        class="answer"
        id="answer_d"
        @click="handleQuestion"
        v-if="(data[quizInfo.questionNumber] as any)?.answers.answer_d"
      >
        D. - {{ (data[quizInfo.questionNumber] as any)?.answers.answer_d }}
      </p>
      <p
        class="answer"
        id="answer_e"
        @click="handleQuestion"
        v-if="(data[quizInfo.questionNumber] as any)?.answers.answer_e"
      >
        E. - {{ (data[quizInfo.questionNumber] as any)?.answers.answer_e }}
      </p>
      <p
        class="answer"
        id="answer_f"
        @click="handleQuestion"
        v-if="(data[quizInfo.questionNumber] as any)?.answers.answer_f"
      >
        F. - {{ (questionsList[quizInfo.questionNumber] as any)?.answers.answer_f }}
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
