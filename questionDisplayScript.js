//DB Connection and getting data 
let questionDataDB = [];
let totalNumberOfPageButtons = 0;
async function loadQuestions() {
    try {
     
        const response = await fetch('/api/questions');
        if (!response.ok) throw new Error("Server not responding");
        // Get the data from SQL
        rawQuestionData = await response.json();
       // console.log("Data successfully loaded from SQL Server!");
		questionDataDB = rawQuestionData.map(q => (
		{
			questionType: q.question_type,
			question: q.question_statement,
			a: q.option_a,
			b: q.option_b,
			c: q.option_c,
			d: q.option_d,
			rightAnswer: q.right_answer ,
			solution: q.solution
		}
		));        
		
		// Let's find the total number of questions
		let totalNumberofQuestions = questionDataDB.length ;
		
		//console.log("Data loaded, now setting for display...");
		
		//Let us count the number of page buttons we need
		for(let i=0; i<= totalNumberofQuestions; i = i+10){
			totalNumberOfPageButtons = totalNumberOfPageButtons + 1 ; 
			}
			
		 // Let us call the display function HERE
        displayQuestions(1); 


   } catch (error) {
        console.error(" Frontend Error:", error);
    }
}
loadQuestions();

// Start the process


// Declare an 'object' data type for storing the questionData in form of key: "value" type
/**
let questionData = [
{
	questionType: "mcq",
	question: "Who is the President of The United States Of America?",
	a: "Mr. Donald Trump",
	b: "Mr. Narendra Modi",
	c: "Mr. Joe Biden",
	d: "Mr. Amit Shah",
	rightAnswer: "a" ,
	solution: "Mr. Donald John Trump (born June 14, 1946) is an American politician, media personality, and businessman who is the 47th president of the United States (January 20, 2025-present). A member of the Republican Party, he served as the 45th president from 2017 to 2021."
},
{
	questionType: "mcq" ,
	question: "Who standardized Gurmukhi Script in Punjab?",
	a: "Shri Guru Angad Dev Ji",
	b: "Shri Guru Arjan Dev Ji",
	c: "Shri Guru Nanak Dev Ji",
	d: "Shri Guru Gobind Singh Ji",
	rightAnswer: "a" ,
	solution: "The Second Sikh Guru - 'Shri Guru Angad Dev Ji' refined and standardized the Gurmukhi Script."
}
];
**/


const container = document.getElementById("question-container");

	
// Accessing the data saved in questionDataDB, and sending it to questionDisplay.html for display 

async function displayQuestions(pageNumber){
//Let's clear the innerHTML of container first
container.replaceChildren();
//Depending on page number,number of question-blocks will be made using innerHTML containing data of each question

	const p = pageNumber;
	let startIndex =0;
	let endIndex = 9;
	//If page number is not 1, then change the start and end index
	for(let j=1; j<p; j++){
			startIndex += 10;
			endIndex += 10;
	}
	//If last index is less than endIndex then
	lastIndex = questionDataDB.length-1;
	if (endIndex > lastIndex){ 
			endIndex = lastIndex
			}
	// Display questions from start index to end index by adding the needed number of question-blocks 
	for(let i=startIndex; i<=endIndex; i++){
	const div = document.createElement("div");
	div.id = `question-block-${i+1}`
	
	q = questionDataDB[i];
	
	if(q.questionType==="mcq"){
	div.innerHTML = `
	
	<h2> Q ${i + 1}. ${q.question} </h2> 
	
	<input type ="radio" id="option${i}.1" onClick="checkAnswer(${i},'a')">
    <label for="option${i}.1" id="a${i}">${q.a}</label><br>
	
	<input type="radio" id="option${i}.2" onClick="checkAnswer(${i},'b')">
	<label for="option${i}.2" id="b${i}">${q.b}</label><br>
	
	<input type="radio" id="option${i}.3" onClick="checkAnswer(${i},'c')">
	<label for="option${i}.3" id="c${i}">${q.c}</label><br>
	
	<input type="radio" id="option${i}.4" onClick="checkAnswer(${i},'d')">
	<label for="option${i}.4" id="d${i}">${q.d}</label><br><br>
	
	<p id="solution${i}" style="display:none">Answer: ${q.solution}</p>
	<button type="button" onClick = "displaySolution(${i})"> Show Solution </button>
    <button type="button" onClick = "hideSolution(${i})"> Hide Solution </button>
	<button type="button" onClick = "resetQuestion(${i})"> Reset Question </button>
	`;

	container.appendChild(div);
}
if(q.questionType==="descriptive")
{
	div.innerHTML= `
	<h2> Q ${i + 1}. ${q.question} </h2>
	<p id="solution${i}" style="display:none"> Answer: ${q.solution} </p>
	<button type="button" onClick = "displaySolution(${i})"> Show Solution </button>
    <button type="button" onClick = "hideSolution(${i})"> Hide Solution </button>
	`;
	container.appendChild(div);
}
	}

// Let us call the Pagination function HERE
createPageNumberButtons(totalNumberOfPageButtons);

}

// A function to make the <p> tag 'including solution of the selected question' visible
function displaySolution(index){
	document.getElementById("solution"+index).style.display = "block";
	}
	
// A function to make the <p> tag 'including solution of the selected question' hidden
function hideSolution(index){
	document.getElementById("solution"+index).style.display = "none";
	}

//A function to check whether the selected option is right answer or wrong answer and tell the user about it 
function checkAnswer(i,o){
	
	//For preventing the addition of text on each click, we will first reset the text to original in the selected option and then proceed further 
	document.getElementById(o+i).innerText = document.getElementById(o+i).innerText.replace(/Right Answer|\u{2705}|\u{274C}|Wrong Answer/gu,"");
	let checkIndex = i;
	let checkedOption = o;
	
	let checkQuestion = questionDataDB[i];
	
	if(checkQuestion.rightAnswer === checkedOption){
		document.getElementById(o+i).textContent += "   \u{2705} Right Answer";
	}
	else if(checkQuestion.rightAnswer !== checkedOption){
		document.getElementById(o+i).textContent += "   \u{274C} Wrong Answer";
	}
}

//A function to reset the question, to undo checkAnswer and unselect any option selected
function resetQuestion(i){
	resetIndex = i;
	let resetOptions = ["a","b","c","d"];
	resetOptions.forEach((opt)=> {
	document.getElementById(opt+i).innerText = document.getElementById(opt+i).innerText.replace(/Right Answer|\u{2705}|\u{274C}|Wrong Answer/gu,"");
	}
	);		

	let uncheckNumbers = [".1",".2",".3",".4"];
	uncheckNumbers.forEach(num =>{
		document.getElementById("option"+i+num).checked = false; 
	});
	
	document.getElementById("solution"+ resetIndex).style.display = "none";
	}
	
// Coding for Pagination

async function createPageNumberButtons(numberOfPages){
	const p = numberOfPages;
	
	const pageNumbers = document.createElement("div");
	pageNumbers.id = "page-number-container";
	
	let pageNumberHTML = "<br><br>Select Page Number: ";
	
	//Let us add the number of <button> tags depending on numberOfPages we need
	if(p!==0){
	for(let i=0;i<p;i++){
		pageNumberHTML += `<button type="button" id="pageButton${i+1}" onClick="displayQuestions(${i+1})" >${i+1}</button>` ;
	}
	
	pageNumberHTML +="<br><br>"
	pageNumbers.innerHTML = `${pageNumberHTML}`;
	
	container.appendChild(pageNumbers);
	console.log("We need "+p+" page buttons");
	}

}
