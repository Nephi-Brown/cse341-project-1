const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./data/database');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// CORS headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, z-key'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// Routes
app.use('/', require('./routes/index'));
app.use('/api-docs', require('./routes/swagger')); // ✅ Swagger mounted directly here

process.on('uncaughtException', (err, origin) => {
  console.log(process.stderr.fd, `Caught exception: ${err}\n` + `Exception origin: ${origin}`);
});

mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port, () => {
      console.log('Web Server is listening at port ' + port);
    });
  }
});
