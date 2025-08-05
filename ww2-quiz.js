"use strict";

//buttons
const startButton = document.querySelector(".start__button");
const nextButton = document.querySelector(".next__button");
const againButton = document.querySelector(".again__button");

//boxes that I will hide and show during the quiz
const img = document.querySelector(".main__img");
const initialBox = document.querySelector(".main__box");
const questionsBox = document.querySelector(".questions__box");
const resultsBox = document.querySelector(".quiz__results");
const quizTitle = document.querySelector(".quiz__title");
const quizDescription = document.querySelector(".quiz__text");
const mainTitle = document.querySelector(".title");

const questions = document.querySelector(".question");
const optionButton = document.querySelectorAll(".option__btn");
const questionNumber = document.querySelector(".question__number");
const correctAnswerResult = document.querySelector(".answer__text");
const answerExplanation = document.querySelector(".explanation__text");
const finalScore = document.querySelector(".result__number");
const finalText = document.querySelector(".results__text");

let currentQuestionIndex = 0;
let score = 0;
let quizData = "";
let quizQuestions = "";

//function to shuffle through the questions

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

//fetching the data from the json file

async function getQuizData() {
  try {
    const response = await fetch("./ww2-quiz.json");

    if (response?.ok) {
      quizData = await response.json();

      const shuffledQuestions = shuffleArray(quizData.questions);
      quizQuestions = shuffledQuestions.slice(0, 10);

      startingQuiz();
      showQuestion();
    } else {
      console.log(`HTTP Response Code: ${response?.status}`);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
getQuizData();

function startingQuiz() {
  quizTitle.textContent = quizData.title;
  mainTitle.textContent = quizData.title;
  quizDescription.textContent = quizData.introduction;
  img.src = quizData.intro_image;
  img.alt = "World War 2 soldiers in a truck";
}

startButton.addEventListener("click", function () {
  img.classList.add("hidden");
  initialBox.classList.add("hidden");
  questionsBox.classList.remove("hidden");
});

function showQuestion() {
  const currentQuestion = quizQuestions[currentQuestionIndex];
  questions.textContent = currentQuestion.question;

  correctAnswerResult.textContent = `Correct Answer: ${currentQuestion.correct_answer}.`;
  answerExplanation.textContent = currentQuestion.explanation;
  questionNumber.textContent = `${currentQuestionIndex + 1} of 10`;

  optionButton.forEach((button, index) => {
    button.textContent = currentQuestion.options[index];
    button.classList.remove("correct", "incorrect");
    button.disabled = false;
  });

  answerExplanation.classList.add("hidden");
  correctAnswerResult.classList.add("hidden");
}

optionButton.forEach((button) => {
  button.addEventListener("click", () => {
    optionButton.forEach((button) => {
      button.disabled = true;
    });
    if (
      button.textContent.includes(
        quizQuestions[currentQuestionIndex].correct_answer
      )
    ) {
      console.log("Correct");
      button.classList.add("correct");
      score += 1;
    } else {
      console.log("Wrong!");
      button.classList.add("incorrect");
    }
    correctAnswerResult.classList.remove("hidden");
    answerExplanation.classList.remove("hidden");
  });
});

nextButton.addEventListener("click", () => {
  if (currentQuestionIndex < quizQuestions.length - 1) {
    currentQuestionIndex++;
    showQuestion();
  } else {
    questionsBox.classList.add("hidden");
    resultsBox.classList.remove("hidden");
    finalScore.textContent = `${score} of 10`;
    if (score >= 1 && score <= 3) {
      finalText.textContent =
        "Tough quiz! Time to brush up on your history knowledge.";
    } else if (score >= 4 && score <= 5) {
      finalText.textContent =
        "Not bad! You've got a basic grasp — keep learning!";
    } else if (score >= 6 && score <= 7) {
      finalText.textContent =
        "Great work! You're really getting the hang of it.";
    } else if (score >= 8 && score <= 9) {
      finalText.textContent = "Impressive! You're nearly an expert.";
    } else if (score === 10) {
      finalText.textContent = "Perfect score! You're a true history master!";
    }
  }

  againButton.addEventListener("click", () => {
    currentQuestionIndex = 0;
    score = 0;
    questionNumber.textContent = `${currentQuestionIndex + 1} of 10`;
    resultsBox.classList.add("hidden");
    img.classList.remove("hidden");
    initialBox.classList.remove("hidden");
    correctAnswerResult.classList.add("hidden");
    answerExplanation.classList.add("hidden");
    optionButton.forEach((button) => {
      button.classList.remove("correct", "incorrect");
      button.disabled = false;
    });
  });
});
