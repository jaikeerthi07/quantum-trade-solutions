const axios = require('axios');
async function testSave() {
  const data = {
    user_custom_id: 'CS-VERIFY',
    amount: '999.00',
    bank_name: 'Verification Bank',
    currency: 'INR',
    status: 'CONFIRMED'
  };
  try {
    const res = await axios.post('http://localhost:5001/api/withdrawals', data);
    console.log('Save Success:', res.data);
    
    // Check if user was created
    const resUser = await axios.get('http://localhost:5001/api/withdrawals?user_id=CS-VERIFY');
    console.log('Found Count:', resUser.data.length);
  } catch (err) {
    console.error('Error:', err.response ? err.response.data : err.message);
  }
}
testSave();
