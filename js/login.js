import axios from "axios";


document.getElementById('loginForm').addEventListener('submit', event => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    
    const options = {
        url: 'https://ai-personal-trainer.onrender.com/api/auth/login/',
        method: 'POST',
        headers: {
            'Accept': '*/*',
            'Content-Type': 'application/json;charset=UTF-8'
        },
        data: {
            "username":username,
            "password":password
        }
    };
// 'https://ai-personal-trainer.onrender.com/

    () => axios(options)
    .then(()=> console.log('request is sent hony'))
    .then(res => console.log(res))
    .then(response => {
        console.log(response)
        if (response.status == 200){
            () =>(window.location.href = 'home.html')
        } else {
            console.log(response)
            document.getElementById('error-message').textContent = 'Invalid username or password';
        }
    })
    .catch(function (error) {
        console.error('There was an error making the request:', error);
        document.getElementById('error-message').textContent = 'An error occurred. Please try again.';
    })
})
