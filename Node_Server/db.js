const mysql2 = require('mysql2')

const connection = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'DArs##12',
    database: 'employees'
});

connection.connect((err) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return;
    }
    console.log('Connected to database');
  });

module.exports = connection;