// using built-in fetch

const testAppointment = async () => {
    console.log('Testing Appointment Booking...');

    const response = await fetch('http://localhost:5001/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            type: 'Appointment',
            name: 'Test Visitor',
            email: 'visitor@example.com',
            phone: '01700000000',
            date: '2026-03-01',
            time: '14:00',
            purpose: 'Meet a Specific Pet',
            notes: 'Checking integration'
        })
    });

    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', data);
};

testAppointment();
