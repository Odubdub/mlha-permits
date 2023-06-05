const express = require('express');
const path = require('path');

const app = express();

// Serve static files from the build folder
app.use(express.static(path.join(__dirname, 'build')));

// Serve index.html as the default page for all routes
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the server on port 4000
app.listen(4000, () => {
  console.log('Server is listening on port 4000');
});
