let index = 0;  // Track the current question index globally
let score = 0;  // Track the score globally
let timerInterval; // Store the interval ID globally
const scoreHtml = document.getElementById('score');

function setupQuizPage() {
    console.log("Quiz page loaded");
    const scoreHtml = document.getElementById("score");
    const typeHtml = document.getElementById("quizHead");
    const type = localStorage.getItem('quizType');
typeHtml.textContent=type
    // Retrieve questions from localStorage
    const storedQuestions = localStorage.getItem('quizQuestions');
    
    if (storedQuestions) {
        const questions = JSON.parse(storedQuestions); // Parse the stored JSON string
        console.log('Retrieved questions:', questions);

        // Now populate your quiz interface with the first question
        populateQuiz(questions, index);
        scoreHtml.textContent = `Current score is: ${score}`;
    } else {
        console.error('No questions found in localStorage.');
    }
    document.getElementById("resetGame1").addEventListener("click", () => {
        localStorage.removeItem('finalScore'); // Clear the final score
        window.location.href = 'quiz.html'; // Redirect to quiz page to play again
    });

    document.getElementById("backToMenu1").addEventListener("click", () => {
        window.location.href = 'index.html'; // Redirect to the main menu
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
        questionContainer.textContent = cleanText(question.question); // Clean the question text


        // Shuffle and display options
        let options = [...question.incorrect_answers, question.correct_answer];
        options = options.sort(() => Math.random() - 0.5);

        optionsContainer.innerHTML = ''; // Clear previous options
        options.forEach((option, index) => {
            const optionElement = document.createElement('input');
            optionElement.type = "radio";
            optionElement.name = "answer";
            optionElement.value = option;
        
            // Assign a unique id to the input element
            const optionId = `option${index}`;
            optionElement.id = optionId;
        
            const ansLabel = document.createElement("label");
            ansLabel.textContent = cleanText(option); // Clean the option text
            ansLabel.id = "choicesLabel";
            ansLabel.htmlFor = optionId; // Correctly set the 'for' attribute to match the input's id
        
            optionsContainer.appendChild(optionElement);
            optionsContainer.appendChild(ansLabel);
            optionsContainer.appendChild(document.createElement('br')); // Line break after each option
        });
        

        // Create a button to submit the answer
        const submitButton = document.createElement('button');
        submitButton.textContent = "Submit Answer";
        submitButton.id = "submitBtn1";
        submitButton.disabled = false; // Ensure the button is enabled initially

        submitButton.onclick = () => {
            submitButton.disabled = true; // Disable the button after submission
            checkAnswers(questions, index, submitButton);
        };
        optionsContainer.appendChild(submitButton);

        // Display question number
        questionNOHtml.textContent = `Question ${index + 1}/${questions.length}`;

        // Start the timer
        timerInterval = setInterval(() => {
            timeRemaining--;

            if (timeRemaining >= 0) {
                timerElement.textContent = `Time Remaining: ${timeRemaining}`;
            } else {
                clearInterval(timerInterval);
                timerElement.textContent = "Time's up!";
                submitButton.disabled = true; // Disable the button if time is up
                checkAnswers(questions, index, submitButton, true); // Automatically move to the next question when time is up
            }
        }, 1000); // Update every second

        // Add "Finish" button functionality
        const finishButton = document.createElement('button');
        finishButton.textContent = "Finish Quiz";
        finishButton.id = "finish";
        finishButton.onclick = () => {
            clearInterval(timerInterval);
            localStorage.setItem('finalScore', `${score}/${questions.length}`); // Store the final score in localStorage
            window.location.href = 'result.html'; // Redirect to the results page
        };
        optionsContainer.appendChild(finishButton);

    } else {
        // No more questions
        clearInterval(timerInterval);

        localStorage.setItem('finalScore', score); // Store the final score in localStorage
        window.location.href = 'result.html'; // Redirect to the results page
    }
}
function cleanText(question) {
    return question
        .replaceAll('&quot;', '"')
        .replaceAll('&apos;', "'")
        .replaceAll('&amp;', '&')
        .replaceAll('&lt;', '<')
        .replaceAll('&gt;', '>')
        .replaceAll('&#039;', "'"); // handles any additional entities like single quotes
}
function checkAnswers(questions, index, submitButton, timeUp = false) {
    const selectedAns = document.querySelector('input[name="answer"]:checked');
    const optionsContainer = document.getElementById('opt');

    clearInterval(timerInterval); // Stop the timer when an answer is submitted

    if (timeUp) {
        const feedback = document.createElement('div');
        feedback.textContent = `Time's up! The correct answer was: ${questions[index].correct_answer}`;
        feedback.className = 'feedback incorrect';
        optionsContainer.appendChild(feedback);
    } else if (selectedAns) {
        // Clear the previous feedback
        optionsContainer.querySelectorAll('.feedback').forEach(element => element.remove());

        // Check if the answer is correct
        if (selectedAns.value === questions[index].correct_answer) {
            score++;
            scoreHtml.textContent = `Current score is: ${score}`; // Update score display
            // Display correct answer feedback
            const feedback = document.createElement('div');
            feedback.textContent = "Correct!";
            feedback.className = 'feedback correct';
            optionsContainer.appendChild(feedback);
        } else {
            // Display incorrect answer feedback along with the correct answer
            const feedback = document.createElement('div');
            feedback.textContent = `Incorrect! The correct answer was: ${questions[index].correct_answer}`;
            feedback.className = 'feedback incorrect';
            optionsContainer.appendChild(feedback);
        }
    } else {
        alert("Please select an answer before submitting!");
        submitButton.disabled = false; // Re-enable the button if no answer was selected
        return; // Don't move to the next question if no answer was selected
    }

    // Move to the next question after a short delay
    setTimeout(() => {
        index++;
        populateQuiz(questions, index);
    }, 3000); // 3-second delay to show feedback
}
function setupResultsPage() {
    const typeHtml = document.createElement("h1");
    typeHtml.id = "quizHead";
    typeHtml.textContent = localStorage.getItem('quizType');
    
    // Corrected selector for panel3
    document.querySelector(".panel3").prepend(typeHtml);
    const finalScore = localStorage.getItem('finalScore').toString()
    const finalScoreElement = document.getElementById('finalScore');

    finalScoreElement.textContent = `Your final score is: ${finalScore}`;

    document.getElementById("resetGame2").addEventListener("click", () => {
        localStorage.removeItem('finalScore'); // Clear the final score
        window.location.href = 'quiz.html'; // Redirect to quiz page to play again
    });

    document.getElementById("backToMenu2").addEventListener("click", () => {
        window.location.href = 'index.html'; // Redirect to the main menu
    });
}
document.addEventListener("DOMContentLoaded", function() {
    const currentPage = document.body.id;

    if (currentPage === "quizPage") {
        setupQuizPage();
    } else if (currentPage === "resultsPage") {
        setupResultsPage();
    }
});
