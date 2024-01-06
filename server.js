const { MongoClient } = require("mongodb");
const express = require("express");

// Replace the uri string with your connection string.
const uri =
	"mongodb+srv://03chromeginkgo:BlJ0ipiiKeSKzode@jeopardycluster.hcdcttz.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

const jeopardyData = {
	quizTitle: "my first quiz",
	quizContent: [
		{
			category: "History",
			questions: [
				{
					question: "What year did World War II end?",
					answer: "1945",
					points: 100,
				},
				{
					question:
						"Who was the first president of the United States?",
					answer: "George Washington",
					points: 200,
				},
			],
		},
		{
			category: "Science",
			questions: [
				{
					question: "What is the chemical symbol for water?",
					answer: "H2O",
					points: 100,
				},
				{
					question: "Who developed the theory of relativity?",
					answer: "Albert Einstein",
					points: 200,
				},
			],
		},
		{
			category: "Third",
			questions: [
				{ question: "qqq", answer: "aaa", points: 100 },
				{ question: "qqqq", answer: "aaaa", points: 200 },
			],
		},
	],
};

// Function to insert Jeopardy quiz data into MongoDB
async function insertJeopardyData() {
	try {
		await client.connect();
		console.log("Connected to MongoDB");

		const database = client.db("jeopardy");
		const collection = database.collection("quizzes");

		// Insert Jeopardy data into MongoDB
		await collection.insertOne(jeopardyData);

		console.log("Jeopardy data inserted into MongoDB");
	} finally {
		await client.close();
		console.log("MongoDB connection closed");
	}
}

async function getAllJeopardyData() {
	try {
		await client.connect();
		console.log("Connected to MongoDB");

		const database = client.db("jeopardy");
		const collection = database.collection("quizzes");

		const quizzes = await collection.find({}).toArray();
		return quizzes;
	} finally {
		await client.close();
	}
}

// insertJeopardyData();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log("Server Listening on PORT:", PORT);
});

// API CALL
app.get("/quiz-all", async (request, response) => {
	try {
		const jeopardyData = await getAllJeopardyData();
		response.json(jeopardyData);
	} catch (error) {
		console.error(error);
		response.status(500).json({ error: "Internal Server Error" });
	}
});

// async function run() {
// 	try {
// 		const database = client.db("sample_mflix");
// 		const movies = database.collection("movies");

// 		// Query for a movie that has the title 'Back to the Future'
// 		const query = { title: "Back to the Future" };
// 		const movie = await movies.findOne(query);

// 		console.log(movie);
// 	} finally {
// 		// Ensures that the client will close when you finish/error
// 		await client.close();
// 	}
// }
// run().catch(console.dir);
