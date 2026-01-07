const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

const PORT = process.env.PORT || 4000;
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
