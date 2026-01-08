require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

//const sql = require('mssql');
const cors = require('cors');


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



/*
const dbConfig ={
	user: 'sql' ,
	password: '1234' ,
	server: '127.0.0.1' ,
	database: 'questions_db' ,
	options: {
		encrypt: false,
		trustServerCertificate: true 
	},
	port: 1433
};

// 1. Establish connection ONCE at the top level
const poolPromise = sql.connect(dbConfig)
    .then(pool => {
        console.log(' Connected to SQL Server');
        return pool;
    })
    .catch(err => console.log(' Database Connection Failed: ', err));
	
*/
/*
//This is to get the data from the database
app.get( '/api/questions', async (req,res) => {
	
	try {
		let pool = await sql.connect(dbConfig);
		
		let result = await pool.request().query("SELECT * FROM questions");
		console.log('Good');
		res.json(result.recordset);
	} catch (err){
		console.error ("Error ", err.message);
		res.status(500).json({error: "Connection Failed"});
		
	}
});

const PORT = 4000;
app.listen(PORT, () =>{
		console.log(`Server is live at http://localhost: ${PORT}`);
		console.log(`Testing Link: http://localhost:${PORT}/api/questions`);
		
});

//This is to send the data to database
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.post('/api/questions/add', async (req, res) => {
	try{
		console.log("Data Received:", req.body);
		const q = req.body;
		let pool = await sql.connect(dbConfig);
		await pool.request()
		.input('type', sql.NVarChar, q.question_type)
		.input('statement', sql.NVarChar, q.question_statement)
		.input('oa', sql.NVarChar, q.option_a)
		.input('ob', sql.NVarChar, q.option_b)
		.input('oc', sql.NVarChar, q.option_c)
		.input('od', sql.NVarChar, q.option_d)
		.input('ans', sql.Char, q.right_answer)
		.input('sol', sql.NVarChar, q.solution)
		.query(`INSERT INTO questions (question_type, question_statement, option_a, option_b, option_c, option_d, right_answer, solution) VALUES (@type, @statement, @oa, @ob, @oc, @od, @ans, @sol)`);
		res.status(201).json({message: "Question Added Succesfully"});
	}catch(error){
		console.error("Error in server.js: "+error);
		res.status(500).json({error: "Failed Uploading to Database"});
	}
});

});
*/

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


//ROUTES

app.get('/api/questions', async (req, res) =>{
	try{
		 console.log("--- Connection Verification ---");
        console.log("1. Connected to Host:", mongoose.connection.host);
        console.log("2. Using Database:", mongoose.connection.name); // Should be 'question_db'
        console.log("3. Active Collection:", Question.collection.name); // Should be 'questions'
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
   
   mongoose.connect(process.env.MONGO_URI,{dbName: 'questions_db'})
	.then(()=> {
		console.log("Perfect Connection to MongoDB Atlas");
        app.listen(4000, () => {console.log("Server running on http://localhost:4000")});
  
	})
   .catch(err => console.error("MongoDB Connection Error:", err));
   