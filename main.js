let spanCount = document.querySelector(".count span");
let bullets = document.querySelector(".bullets");
let bulletsContainer = document.querySelector(".spans");
let quizArea = document.querySelector(".quiz-area");
let answerArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".coutndown");

let coutnIndex = 0;
let rightAnswer = 0;
let countdownInterval;

function getQuestiions() {
  let myRequest = new XMLHttpRequest();

  myRequest.onreadystatechange = function () {
    if ((this.readyState === 4) & (this.status === 200)) {
      let questionsObject = JSON.parse(this.responseText);

      let questionsCount = questionsObject.length;
      createBullets(questionsCount);

      // create the main questions
      addQuestionsData(questionsObject[coutnIndex], questionsCount);

      // countdown function
      countDown(3, questionsCount);

      //   submit the answer
      submitButton.onclick = () => {
        let rightAnswer = questionsObject[coutnIndex].right_answer;
        coutnIndex++;

        // check answer
        checkAnswer(rightAnswer, questionsCount);

        // empty the quiz area and the spans area
        quizArea.innerHTML = "";
        answerArea.innerHTML = "";

        addQuestionsData(questionsObject[coutnIndex], questionsCount);

        // handle bullets change backgound color
        handleBullets();

        clearInterval(countdownInterval);

        // countdown function
        countDown(3, questionsCount);

        // show results when the questions are finished
        showResults(questionsCount);
      };
    }
  };

  myRequest.open("GET", "html-questions.json", true);
  myRequest.send();
}

getQuestiions();

function createBullets(num) {
  spanCount.innerHTML = num;

  // create the bullets
  for (let i = 0; i < num; i++) {
    let theBullet = document.createElement("span");

    // check if it's the first span
    if (i === 0) {
      theBullet.className = "on";
    }

    // append bullets to main bullets container
    bulletsContainer.appendChild(theBullet);
  }
}

function addQuestionsData(obj, quesCount) {
  if (coutnIndex < quesCount) {
    // create h2 as the title of the question
    let questionTitle = document.createElement("h2");

    // create the text of the question title
    let questionTitleText = document.createTextNode(obj["title"]);

    // append the text of the title in the h2 element
    questionTitle.appendChild(questionTitleText);

    // append the question title in the quiz area
    quizArea.appendChild(questionTitle);

    // create the main div of answers
    for (let i = 1; i <= 4; i++) {
      // create the main div
      let answerDiv = document.createElement("div");
      answerDiv.className = "answer";

      // create the input
      let radioInput = document.createElement("input");

      // add type , id , name , dataAttripute
      radioInput.name = "question";
      radioInput.type = "radio";
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];

      if (i === 1) {
        radioInput.checked = true;
      }

      // create the label
      let theLabel = document.createElement("label");

      theLabel.htmlFor = `answer_${i}`;

      let theLabelText = document.createTextNode(obj[`answer_${i}`]);

      theLabel.appendChild(theLabelText);

      // add the input + the label to the maindiv
      answerDiv.appendChild(radioInput);
      answerDiv.appendChild(theLabel);

      answerArea.appendChild(answerDiv);
    }
  }
}

function checkAnswer(rAnswer, Count) {
  let answers = document.getElementsByName("question");
  let choosenAnswer;

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      choosenAnswer = answers[i].dataset.answer;
    }
  }

  if (rAnswer === choosenAnswer) {
    rightAnswer++;
  }
}

function handleBullets() {
  let bulletsSpans = document.querySelectorAll(".spans span");
  let arrayOfSpans = Array.from(bulletsSpans);
  arrayOfSpans.forEach((span, index) => {
    if (coutnIndex === index) {
      span.className = "on";
    }
  });
}

function showResults(count) {
  let theResults;

  if (coutnIndex === count) {
    quizArea.remove();
    answerArea.remove();
    submitButton.remove();
    bullets.remove();

    if (rightAnswer > count / 2 && rightAnswer < count) {
      theResults = `<span class="good">Good </span> , ${rightAnswer} from ${count}`;
    } else if (rightAnswer === count) {
      theResults = `<span class="perfect">perfect </span>, You have answered all the questions right`;
    } else {
      theResults = `<span class="bad">Bad score </span> , You have to exercise more`;
    }

    resultsContainer.innerHTML = theResults;
    resultsContainer.style.padding = "10px";
    resultsContainer.style.backgroundColor = "white";
    resultsContainer.style.marginTop = "10px";
    resultsContainer.style.textAlign = "center";
  }
}

function countDown(duration, count) {
  if (coutnIndex < count) {
    let minutes, seconds;
    countdownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countdownElement.innerHTML = `${minutes}:${seconds}`;

      if (--duration < 0) {
        clearInterval(countdownInterval);
        submitButton.click();
      }
    }, 1000);
  }
}
