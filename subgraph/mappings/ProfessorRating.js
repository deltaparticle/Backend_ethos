const contractAddress = 'YOUR_CONTRACT_ADDRESS'; // Replace with your deployed contract address
let web3;
let professorRatingContract;

window.addEventListener('load', async () => {
    // Check if Web3 has been injected by the browser (MetaMask)
    if (typeof window.ethereum !== 'undefined') {
        // Initialize web3
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        // Initialize the contract
        const contractABI = [
            {
                "inputs": [
                    { "internalType": "address", "name": "_professor", "type": "address" }
                ],
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "inputs": [
                    { "internalType": "uint8", "name": "_score", "type": "uint8" },
                    { "internalType": "string", "name": "_comments", "type": "string" }
                ],
                "name": "submitRating",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "getRatings",
                "outputs": [
                    {
                        "components": [
                            { "internalType": "address", "name": "student", "type": "address" },
                            { "internalType": "uint8", "name": "score", "type": "uint8" },
                            { "internalType": "string", "name": "comments", "type": "string" }
                        ],
                        "internalType": "struct ProfessorRating.Rating[]",
                        "name": "",
                        "type": "tuple[]"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            }
        ];

        professorRatingContract = new web3.eth.Contract(contractABI, contractAddress);
        document.getElementById('ratingForm').addEventListener('submit', submitRating);
        await fetchRatings(); // Fetch existing ratings on load
    } else {
        alert('Please install MetaMask to use this app.');
    }
});

async function submitRating(event) {
    event.preventDefault(); // Prevent form submission

    const score = parseInt(document.getElementById('score').value);
    const comments = document.getElementById('comments').value;
    const accounts = await web3.eth.getAccounts();

    try {
        const receipt = await professorRatingContract.methods.submitRating(score, comments).send({ from: accounts[0] });
        document.getElementById('message').innerText = 'Rating submitted successfully!';
        fetchRatings(); // Refresh ratings after submission
    } catch (error) {
        console.error(error);
        document.getElementById('message').innerText = 'Error submitting rating: ' + error.message;
    }
}

async function fetchRatings() {
    try {
        const ratings = await professorRatingContract.methods.getRatings().call();
        const ratingsList = document.getElementById('ratingsList');
        ratingsList.innerHTML = ''; // Clear existing list

        ratings.forEach(rating => {
            const li = document.createElement('li');
            li.innerText = `Student: ${rating.student}, Score: ${rating.score}, Comments: ${rating.comments}`;
            ratingsList.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching ratings:', error);
    }
}
