const path = require('path');
const express = require('express');
const app = express();
const port = process.env.PORT || 9000;

app.use(express.static('dist'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(9000, () => {
  console.log(`Server listening on port ${port}!`);
  require("openurl").open(`http://localhost:${port}`);
});
