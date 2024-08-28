let index = 0;  // Track the current question index globally
let score = 0;  // Track the score globally
let timerInterval; // Store the interval ID globally
const scoreHtml = document.getElementById('score');

function setupQuizPage() {
    console.log("Quiz page loaded");
    const scoreHtml = document.getElementById("score");
    // Retrieve questions from localStorage
    const storedQuestions = localStorage.getItem('arabicQuizQuestions');
    
    if (storedQuestions) {
        const questions = JSON.parse(storedQuestions); // Parse the stored JSON string
        console.log('Retrieved questions:', questions);

        // Now populate your quiz interface with the first question
        populateQuiz(questions, index);
        scoreHtml.textContent = `النتيجة الحالية: ${score}`;
    } else {
        console.error('No questions found in localStorage.');
    }

    document.getElementById("resetGame1").addEventListener("click", () => {
        localStorage.removeItem('finalScore'); // Clear the final score
        window.location.href = 'arabicQuiz.html'; // Redirect to quiz page to play again
    });

    document.getElementById("backToMenu1").addEventListener("click", () => {
        window.location.href = 'welcome.html'; // Redirect to the main menu
    });
}

function populateQuiz(questions, index) {
    const questionContainer = document.getElementById('ques');
    const optionsContainer = document.getElementById('opt');
    const timerElement = document.getElementById('time');
    const questionNOHtml = document.getElementById("questionsNo2");

    clearInterval(timerInterval); // Clear any existing timer
    let timeRemaining = 20; // Reset timer for each question

    if (index < questions.length) {
        const question = questions[index];
        questionContainer.textContent = question.question; // Display the question

        // Shuffle and display options
        let options = [...question.options];
        options = options.sort(() => Math.random() - 0.5);

        optionsContainer.innerHTML = ''; // Clear previous options
        options.forEach((option, index) => {
            const optionElement = document.createElement('input');
            optionElement.type = "radio";
            optionElement.name = "answer";
            optionElement.value = option;
        
            const optionId = `option${index}`;
            optionElement.id = optionId;
        
            const ansLabel = document.createElement("label");
            ansLabel.textContent = option;
            ansLabel.id = "choicesLabel";
            ansLabel.htmlFor = optionId;
        
            optionsContainer.appendChild(optionElement);
            optionsContainer.appendChild(ansLabel);
            optionsContainer.appendChild(document.createElement('br'));
        });

        const submitButton = document.createElement('button');
        submitButton.textContent = "سلم الاجابة";
        submitButton.id = "submitBtn1";
        submitButton.disabled = false;

        submitButton.onclick = () => {
            submitButton.disabled = true;
            checkAnswers(questions, index, submitButton);
        };
        optionsContainer.appendChild(submitButton);

        questionNOHtml.textContent = `السؤال ${index + 1} من ${questions.length}`;

        timerInterval = setInterval(() => {
            timeRemaining--;

            if (timeRemaining >= 0) {
                timerElement.textContent = `الوقت المتبقي: ${timeRemaining}`;
            } else {
                clearInterval(timerInterval);
                timerElement.textContent = "انتهى الوقت!";
                submitButton.disabled = true;
                checkAnswers(questions, index, submitButton, true);
            }
        }, 1000);

        const finishButton = document.createElement('button');
        finishButton.textContent = "انهي اللعبة";
        finishButton.id = "finish";
        finishButton.onclick = () => {
            clearInterval(timerInterval);
            localStorage.setItem('finalScore', `${score}/${questions.length}`);
            window.location.href = 'arabicResult.html';
        };
        optionsContainer.appendChild(finishButton);

    } else {
        clearInterval(timerInterval);
        localStorage.setItem('finalScore', score);
        window.location.href = 'arabicResult.html';
    }
}

function checkAnswers(questions, index, submitButton, timeUp = false) {
    const selectedAns = document.querySelector('input[name="answer"]:checked');
    const optionsContainer = document.getElementById('opt');

    clearInterval(timerInterval);

    if (timeUp) {
        const feedback = document.createElement('div');
        feedback.textContent = `!انتهى الوقت، الجواب الصحيح هو ${questions[index].correct_answer}`;
        feedback.className = 'feedback incorrect';
        optionsContainer.appendChild(feedback);
    } else if (selectedAns) {
        optionsContainer.querySelectorAll('.feedback').forEach(element => element.remove());

        if (selectedAns.value === questions[index].correct_answer) {
            score++;
            scoreHtml.textContent = `النتيجة الحالية: ${score}`;
            const feedback = document.createElement('div');
            feedback.textContent = "احسنت!";
            feedback.className = 'feedback correct';
            optionsContainer.appendChild(feedback);
        } else {
            const feedback = document.createElement('div');
            feedback.textContent = `!خطأ، الجواب الصحيح هو ${questions[index].correct_answer}`;
            feedback.className = 'feedback incorrect';
            optionsContainer.appendChild(feedback);
        }
    } else {
        alert("يرجى اختيار إجابة قبل التقديم!");
        submitButton.disabled = false;
        return;
    }

    setTimeout(() => {
        index++;
        populateQuiz(questions, index);
    }, 3000);
}

function setupResultsPage() {
    const finalScore = localStorage.getItem('finalScore');
    const finalScoreElement = document.getElementById('finalScore');

    if (finalScore) {
        finalScoreElement.textContent = `النتيجة النهائية: ${finalScore}`;
    } else {
        finalScoreElement.textContent = "لم يتم العثور على نتائج.";
    }

    const reset = document.getElementById("resetGame2");
    reset.addEventListener("click", () => {
        localStorage.removeItem('finalScore');
        window.location.href = 'arabicQuiz.html';
    });

    const backToMenu = document.getElementById("backToMenu2");
    backToMenu.addEventListener("click", () => {
        window.location.href = 'welcome.html';
    });
}

document.addEventListener("DOMContentLoaded", function() {
    const currentPage = document.body.id;
    
        if (currentPage === "arabicQuizPage") {
            setupQuizPage();
        }
    else if (currentPage === "ArabicResultsPage") {
        setupResultsPage();
    }
});
