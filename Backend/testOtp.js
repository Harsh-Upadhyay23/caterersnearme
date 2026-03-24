fetch('http://localhost:5000/api/auth/send-otp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'upadhyayharsh435@gmail.com' })
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
