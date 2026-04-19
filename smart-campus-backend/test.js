const http = require('http');

async function test() {
    try {
        console.log('Logging in as admin...');
        const res1 = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST', headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({usernameOrEmail: 'Tharuka', password: 'admin123'})
        });
        const loginData = await res1.json();
        console.log('Admin login:', res1.status);
        if(!loginData.token) return;

        console.log('Fetching technicians...');
        const fetchTechs = await fetch('http://localhost:8080/api/tickets/technicians', {
            headers: {'Authorization': 'Bearer ' + loginData.token}
        });
        console.log('Technicians:', await fetchTechs.json());

        console.log('Fetching all tickets...');
        const fetchTickets = await fetch('http://localhost:8080/api/tickets/all', {
            headers: {'Authorization': 'Bearer ' + loginData.token}
        });
        console.log('All tickets:', JSON.stringify(await fetchTickets.json(), null, 2));

    } catch(err) {
        console.error(err);
    }
}
test();
