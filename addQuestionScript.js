
 let addQuestionType = "";
 let addQuestion = "";
 let addA = "";
 let addB = "";
 let addC = "";
 let addD = "";
 let addRightAnswer = "";
 let addSolution = "";


// Access the div tags and add the html to it
//Accessing select-question-type section
const selectQuestionType = document.getElementById("select-question-type");
selectQuestionType.innerHTML = `
<label for="questionType"> Please Select the Type of Question: </label>
<select name="questionType" id="questionType" onchange="showQuestionStatementSection()"> 
<option value="" hidden selected disabled>Please Select</option>
<option value="mcq">MCQ</option>
<option value="descriptive">Descriptive Type Question</option>
</select><br>
`;

//If the Selection of QuestionType is made only then the user will be asked to enter the question statement

function showQuestionStatementSection(){
	if(document.getElementById("questionType").value === "mcq" || document.getElementById("questionType").value === "descriptive"){

//Creating question-statement section
const enterQuestionStatement = document.getElementById("question-statement");
enterQuestionStatement.innerHTML = `<br>
<label for="questionStatement">Please Type the Question Statement: </label>  
<textarea id="questionStatement" rows="10" cols="120" placeholder="Please type your question here..."></textarea> <br>
`;
	
// If Selected questionType is MCQ 
if(document.getElementById("questionType").value === "mcq"){
	
//Accessing the mcq-container section
const mcqContainer = document.getElementById("mcq-container");

//Adding html to the mcq-container section
mcqContainer.innerHTML = `
<br>
<label for="optionA"> Option A: </label> <textarea id="optionA" cols="80"></textarea> <br>
<label for="optionB"> Option B: </label> <textarea id="optionB" cols="80"></textarea> <br>
<label for="optionC"> Option C: </label> <textarea id="optionC" cols="80"></textarea> <br>
<label for="optionD"> Option D: </label> <textarea id="optionD" cols="80"></textarea> <br>
<br>
<label for= "rightAnswer"> Please Select the Right Answer: </label> 
<select id= "rightAnswer">
<option value="" selected hidden disabled>Please Select</option>
<option value="a">Option A</option>
<option value="b">Option B</option>
<option value="c">Option C</option>
<option value="d">Option D</option>
</select> <br>
<br>
<label for="mcqDetailedSolution">Detailed Solution:</label> 
<textarea placeholder = "Please type the detailed answer to the question" id= "mcqDetailedSolution" rows="10" cols="120"></textarea>
`;
	
}

//if the selected questionType is descriptive question 
if(document.getElementById("questionType").value === "descriptive"){

//Accessing the desc-container section
const descContainer = document.getElementById("desc-container");

//Adding html to section

descContainer.innerHTML = `
<br>
<label for="descDetailedSolution">Please type the Answer: </label> 
<textarea id="descDetailedSolution" rows ="10" cols = "120"></textarea>
`;
}

//Accessing the add-question section
const addQuestionContainer = document.getElementById("add-question");
//Show the Add Question Button
addQuestionContainer.innerHTML = `
<br>
<button type="button" onclick="addTheQuestion()" id="addQuestion">ADD QUESTION</button> 
`;

	}}
	
async function addTheQuestion(){
	//Data to be sent will be stored in:
	let addQuestionData;
	
	//Getting data from user-input
	addQuestionType = document.getElementById("questionType").value
	
	//Packing Mcq data
	if(addQuestionType === "mcq"){
	addQuestion = document.getElementById("questionStatement").value;
	addA = document.getElementById("optionA").value;
	addB = document.getElementById("optionB").value;
	addC = document.getElementById("optionC").value;
	addD = document.getElementById("optionD").value;
	addRightAnswer = document.getElementById("rightAnswer").value;
    addSolution = document.getElementById("mcqDetailedSolution").value;
	
	//VALIDATING THE USER DATA
	if (addQuestion!== "" && addA!== "" && addB!== "" && addC!== "" && addD!== "" && addRightAnswer!=="" && addSolution!==""){
	// GETTING DATA READY FOR SENDING	
	addQuestionData = {
	question_type: addQuestionType,
	question_statement: addQuestion,
	option_a: addA,
	option_b: addB,
	option_c: addC,
	option_d: addD,
	right_answer: addRightAnswer ,
	solution: addSolution 
	}; 
	sendData();
	}
	else {
		// SHOW MESSAGE TO FILL ALL THE FIELDS
		alert("Please Enter All the Fields!!");
	}
	}
	
	//PACKING DESCRIPTIVE QUESTION DATA
	else if(addQuestionType==="descriptive"){
	addQuestion = document.getElementById("questionStatement").value;
	addSolution = document.getElementById("descDetailedSolution").value; 
	
	//VALIDATING DATA 
	
	if(addQuestion!== "" && addSolution!==""){
	// GETTING DATA READY FOR SENDING
	addQuestionData = {
	question_type: addQuestionType,
	question_statement: addQuestion,
	option_a: null ,
	option_b: null ,
	option_c: null ,
	option_d: null ,
	right_answer: null ,
	solution: addSolution 
	};
	sendData();
	}
	else{
		// SHOW MESSAGE TO FILL ALL THE FIELDS
		alert("Please Enter All the Fields!!");
	}
	}

 // SENDING DATA TO THE SERVER through server.js

}

async function sendData(){
	 try{
	 const response = await fetch('api/questions/add', {
		 method: 'POST' ,
		 headers: {
			 'Content-Type': 'application/json'
		 },
		 body: JSON.stringify(addQuestionData)
	 });
	 const result = await response.json();
	 
	 if(response.ok){
		 alert(result.message);
		 window.location.href = "addQuestion.html";
	 }else {
		 alert("Error:"+result.error);
	 }
 }catch(error){
	 console.error("Data wasn't sent to server.js :",error);
 }
}
