
// Native fetch is available in Node.js 18+

const API_URL = 'http://localhost:5001/api/auth/login';

const login = async () => {
    try {
        console.log('Attempting login for admin@petshop.com...');
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@petshop.com',
                password: 'password123'
            })
        });

        const data = await response.json();
        console.log('Status:', response.status);
        if (response.ok) {
            console.log('Login Successful!');
            console.log('Token:', data.token ? 'Received' : 'Missing');
        } else {
            console.log('Login Failed:', data.message);
        }
    } catch (error) {
        console.error('Network Error:', error.message);
    }
};

login();
