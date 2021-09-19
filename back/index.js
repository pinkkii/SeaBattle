const session = require('express-session');
const express = require('express');
const app = express();
const port = 3000;

app.use(express.static("./../front/"));

app.set('trust proxy', 1) // trust first proxy

app.use(session({
  secret: 's3Cur3',
  name: 'sessionId'
}));


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});
