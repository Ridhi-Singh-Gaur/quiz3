const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); // To parse form data
const cors = require('cors'); // To handle CORS for cross-origin requests
const app = express();

// Middleware to parse JSON and allow cross-origin requests
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public')); // Serve static files from the 'public' directory

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/quizDB')
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log("Error connecting to MongoDB:", err);
    });

// Define candidate schema and model
const candidateSchema = new mongoose.Schema({
    fullName: String,
    gender: String,
    enrollment: String,
    city: String,
    totalMarks: Number,
});
const Candidate = mongoose.model('Candidate', candidateSchema);

// API endpoint to handle form submission
app.post('/submitQuiz', (req, res) => {
    const { fullName, gender, enrollment, city, totalMarks } = req.body;

    // Create a new Candidate document
    const newCandidate = new Candidate({
        fullName: fullName,
        gender: gender,
        enrollment: enrollment,
        city: city,
        totalMarks: totalMarks
    });

    // Save the candidate details in MongoDB
    newCandidate.save()
        .then(() => {
            res.status(201).json({ message: "Quiz data saved successfully!" });
        })
        .catch((err) => {
            res.status(500).json({ message: "Error saving quiz data", error: err });
        });
});

// API endpoint to retrieve leaderboard data
app.get('/leaderboard', (req, res) => {
    Candidate.find().sort({ totalMarks: -1 }) // Sort by totalMarks descending
        .then(candidates => {
            res.json(candidates);
        })
        .catch(err => {
            res.status(500).json({ message: "Error retrieving leaderboard data", error: err });
        });
});

// Start the server
app.listen(1089, () => {
    console.log("Server running on http://localhost:1089");
});

const { AptosClient, AptosAccount, AptosSDK } = require('aptos');

const client = new AptosClient("https://fullnode.devnet.aptoslabs.com");

app.get('/doubleTokens/:walletAddress', async (req, res) => {
    const walletAddress = req.params.walletAddress; // Get the wallet address from the URL

    // Create Aptos Account (ensure this is your sender's account)
    const senderAccount = AptosAccount.fromPrivateKey("YOUR_PRIVATE_KEY");

    // Prepare the transaction to call the smart contract
    const payload = {
        type: 'entry_function_payload',
        function: '0x1::TokenManager::double_tokens',
        arguments: [walletAddress],
    };

    // Send the transaction
    try {
        const transaction = await client.generateTransaction(senderAccount.address(), payload);
        await client.signAndSubmitTransaction(senderAccount, transaction);
        res.status(200).send(`Tokens doubled for address: ${walletAddress}`);
    } catch (error) {
        console.error('Error doubling tokens:', error);
        res.status(500).send('Error doubling tokens');
    }
});