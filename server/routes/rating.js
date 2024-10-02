const express = require('express');
const router = express.Router();
const Web3 = require('web3');
const contractABI = require('../../artifacts/ProfessorRating.json'); 
const contractJson = require('../../build/contracts/ProfessorRating.json');


const web3 = new Web3('http://127.0.0.1:7545');
const contractAddress = '0x2983466963c2D4D1631BeA764D73324828a711D7'; 
const contract = new web3.eth.Contract(contractABI.abi, contractAddress);

router.post('/submit', async (req, res) => {
    const { studentAddress, score, comments } = req.body;

    try {
        const accounts = await web3.eth.getAccounts();
        await contract.methods.submitRating(score, comments).send({ from: accounts[0] });
        res.status(200).send('Rating submitted successfully!');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error submitting rating');
    }
});

router.get('/ratings', async (req, res) => {
    const studentAddress = req.query.address;

    try {
        const ratings = await contract.methods.getRatings().call({ from: studentAddress });
        res.status(200).json(ratings);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching ratings');
    }
});

module.exports = router;
