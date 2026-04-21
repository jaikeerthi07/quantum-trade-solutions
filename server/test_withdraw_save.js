async function testSave() {
    try {
        const response = await fetch('http://127.0.0.1:5001/api/withdrawals', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_custom_id: 'CS-002',
                transaction_id: 'TEST_TXN_' + Date.now(),
                amount: '200',
                bank_name: 'Axis Bank',
                currency: 'INR',
                status: 'CONFIRMED'
            })
        });
        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Success:', data);
    } catch (err) {
        console.error('Error:', err.message);
    }
}

testSave();
