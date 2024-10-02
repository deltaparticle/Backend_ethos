// src/app.js
document.getElementById('loginForm').onsubmit = async (e) => {
    e.preventDefault();
    const role = document.getElementById('role').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (role === 'student') {
        window.location.href = 'student-dashboard.html';
    } else {
        window.location.href = 'professor-dashboard.html';
    }
};

document.getElementById('ratingForm').onsubmit = async (e) => {
    e.preventDefault();
    const knowledge = document.querySelector('input[name="knowledge"]:checked').value;
    const teachingStyle = document.querySelector('input[name="teachingStyle"]:checked').value;

    const response = await fetch('/rating/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ knowledge, teachingStyle }),
    });

    const data = await response.json();
    alert(data.message);
};

