const questionsNO=document.getElementById("questionsNO")
const difficulty=document.getElementById("difficulty2")
const startBtn= document.getElementById('startBtn')
document.addEventListener("DOMContentLoaded", function() {
    const currentPage = document.body.id;

    if (currentPage === "indexPage") {
        setupIndexPage()
    } else if (currentPage === "indexArabicPage") {
        setupArabicIndexPage() 
       }
});

async function setupIndexPage() {
    console.log("Index page loaded");
    const types = document.getElementById('types');
    const startBtn = document.getElementById('startBtn');
    const categerisAPI = "https://opentdb.com/api_category.php";
    
    try {
        const response = await fetch(categerisAPI);
        const jsonData = await response.json();
        const typesNames = jsonData.trivia_categories;

        typesNames.forEach(element => {
            const option = document.createElement('option');
            option.value = element.id;
            option.textContent = element.name;
            types.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
    }

    startBtn.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the form from submitting
        const categoryId = document.getElementById('types').value;
        const difficulty = document.getElementById('difficulty2').value;
        const questionsNo = document.getElementById('questionsNO').value;

        if (categoryId && difficulty && questionsNo) {
            fetchQuestions(categoryId, difficulty, questionsNo).then(() => {
                window.location.href = 'quiz.html'; // Redirect to quiz page
            }).catch(error => {
                console.error('Error:', error);
                alert('Failed to fetch questions. Please try again.');
            });
        } else {
            alert('Please fill out all fields before starting the quiz.');
        }
    });
}

async function fetchQuestions(categoryId, difficulty, amount) {
    const questionsAPI = `https://opentdb.com/api.php?amount=${amount}&category=${categoryId}&difficulty=${difficulty}`;
    console.log('Parameters:', difficulty, amount, categoryId);
    try {
        const response = await fetch(questionsAPI);
        
        if (response.status === 429) {
            console.error('Rate limit exceeded, please try again later.');
            throw new Error('Rate limit exceeded');
        }

        const data = await response.json();

        if (data.response_code === 0) {
            const questions = data.results;
            localStorage.setItem('quizQuestions', JSON.stringify(questions)); // Store questions in localStorage
            const selectedCategory = document.getElementById('types').selectedOptions[0].textContent;
            localStorage.setItem('quizType', selectedCategory);


        } else {
            console.error('No questions found for the specified parameters.');
            throw new Error('No questions found');
        }
    } catch (error) {
        console.error('Error fetching questions:', error);
        throw error;
    }
}
async function setupArabicIndexPage() {
    console.log("Arabic Index page loaded");
    const startBtn = document.getElementById('startBtn');

    startBtn.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the form from submitting
        const questionsNo = document.getElementById('questionsNO').value;

        // Ensure questionsNo is a valid number within the expected range
        if (questionsNo && questionsNo > 0 && questionsNo <= 30) {
            fetchArabicQuestions(questionsNo).then(() => {
                window.location.href = 'arabicQuiz.html'; // Redirect to Arabic quiz page
            }).catch(error => {
                console.error('Error:', error);
                alert('Failed to fetch questions. Please try again.');
            });
        } else {
            alert("اختر رقم بين صفر و ثلاثون");
        }
    });
}


async function fetchArabicQuestions(questionsNo) {
    const questionsAPI = 'arabicQuestions.json'; // Assuming questions.json is your local JSON file
    try {
        const response = await fetch(questionsAPI);
        const data = await response.json();

        if (data && data.length > 0) {
            // Shuffle the questions array
            const shuffledQuestions = data.sort(() => 0.5 - Math.random());
            
            // Slice the array to get the desired number of questions
            const selectedQuestions = shuffledQuestions.slice(0, questionsNo);
            
            // Store the selected questions in localStorage
            localStorage.setItem('arabicQuizQuestions', JSON.stringify(selectedQuestions));
        } else {
            console.error('No questions found in the JSON file.');
            throw new Error('No questions found');
        }
    } catch (error) {
        console.error('Error fetching questions:', error);
        throw error;
    }
}
