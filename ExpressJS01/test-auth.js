const axios = require('axios');

const BASE_URL = 'http://localhost:8080/v1/api';

// Test authentication flow
async function testAuth() {
    console.log('🧪 Testing Authentication Flow...\n');

    try {
        // 1. Test Register
        console.log('1. Testing Register...');
        const registerData = {
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123'
        };

        const registerResponse = await axios.post(`${BASE_URL}/register`, registerData);
        console.log('Register Response:', registerResponse.data);

        if (registerResponse.data.EC === 0) {
            console.log('✅ Register successful\n');
        } else {
            console.log('❌ Register failed:', registerResponse.data.EM);
            return;
        }

        // 2. Test Login
        console.log('2. Testing Login...');
        const loginData = {
            email: 'test@example.com',
            password: 'password123'
        };

        const loginResponse = await axios.post(`${BASE_URL}/login`, loginData);
        console.log('Login Response:', loginResponse.data);

        if (loginResponse.data.EC === 0) {
            console.log('✅ Login successful');
            const token = loginResponse.data.DT.access_token;
            console.log('Token received:', token.substring(0, 20) + '...\n');

            // 3. Test Protected Route
            console.log('3. Testing Protected Route (Account)...');
            const accountResponse = await axios.get(`${BASE_URL}/account`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('Account Response:', accountResponse.data);

            if (accountResponse.data.EC === 0) {
                console.log('✅ Protected route access successful');
                console.log('User ID:', accountResponse.data.DT._id);
                console.log('User Name:', accountResponse.data.DT.name);
                console.log('User Email:', accountResponse.data.DT.email);
            } else {
                console.log('❌ Protected route access failed:', accountResponse.data.EM);
            }

            // 4. Test Favorites (should work now)
            console.log('\n4. Testing Favorites API...');
            const favoritesResponse = await axios.get(`${BASE_URL}/favorites`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('Favorites Response:', favoritesResponse.data);

            if (favoritesResponse.data.EC === 0) {
                console.log('✅ Favorites API working');
            } else {
                console.log('❌ Favorites API failed:', favoritesResponse.data.EM);
            }

        } else {
            console.log('❌ Login failed:', loginResponse.data.EM);
        }

    } catch (error) {
        console.error('❌ Test failed with error:', error.response?.data || error.message);
    }
}

// Run the test
testAuth();
