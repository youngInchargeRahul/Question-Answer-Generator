const path = require('path');
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const cors = require('cors');


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

const questionSchema = new mongoose.Schema({
	question_type: String,
	question_statement: String,
	option_a: String,
	option_b: String,
	option_c: String,
	option_d: String,
	right_answer: String,
    solution: String }, {collection: 'questions'});

const Question = mongoose.model('Question',questionSchema);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'questionDisplay.html'));
});

app.get('/addQuestions', (req, res) => {
    res.sendFile(path.join(__dirname, 'addQuestion.html'));
});
//ROUTES

app.get('/api/questions', async (req, res) =>{
	try{
		const allQuestions = await Question.find({});
		console.log(`Found ${allQuestions.length} questions` );
		res.status(200).json(allQuestions);
	} catch(err){
		console.error("Error in fetching questions:"+err);
		res.status(500).json({message: "Server error while fetching data"});
	}
});


   app.post('/api/questions/add', async (req, res) => {
	   try{
		   const newQuestion = new Question(req.body);
		   
		   const savedQuestion = await newQuestion.save();
		   
		   res.status(201).json({
			   message: "Question added successfully!",
			   data: savedQuestion
		   });
	   }catch(err){
		   console.log("Error saving to database:", err);
		   res.status(500).json({error:"Failed to add Question"});
	   }
   }
   );



   const PORT = process.env.PORT || 10000;
   mongoose.connect(process.env.MONGO_URI,{dbName: 'questions_db'})
	.then(()=> {
		console.log("Perfect Connection to MongoDB Atlas");
        app.listen(PORT , () => {console.log(`Server running on port: ${PORT}`)});
  
	})
   .catch(err => console.error("MongoDB Connection Error:", err));

   










