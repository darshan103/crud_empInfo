const express = require('express');
const mysql = require('mysql2/promise'); // Use mysql2/promise for async/await support
const cors = require('cors');

const app = express();
app.use(express.json());

app.use(cors());

const connectionConfig = {
  host: 'localhost',
  user: 'root',
  password: 'DArs##12',
  database: 'my_db'
};

// Check if database exists, if not, create it
async function createDatabaseIfNotExists() {
  try {
    const connection = await mysql.createConnection({
      host: connectionConfig.host,
      user: connectionConfig.user,
      password: connectionConfig.password
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS ${connectionConfig.database}`);
    console.log(`Database ${connectionConfig.database} is ready.`);
  } catch (error) {
    console.error('Error creating database:', error);
    throw error;
  }
}

// Connect to MySQL and create or update the users table
async function connectAndSetUpDatabase() {
  try {
    const connection = await mysql.createConnection(connectionConfig);

    // Create or update users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        firstName VARCHAR(255) NOT NULL,
        lastName VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        dob VARCHAR(255) NOT NULL,
        gender VARCHAR(255) NOT NULL,
        education VARCHAR(255) NOT NULL,
        company VARCHAR(255) NOT NULL,
        experience VARCHAR(255)
      )
    `);

    await connection.end();
    console.log('Database and table setup complete.');
  } catch (error) {
    console.error('Error setting up database:', error);
    throw error;
  }
}

// Connect to MySQL
async function connectToDatabase() {
  try {
    await createDatabaseIfNotExists();
    await connectAndSetUpDatabase();
    const connection = await mysql.createConnection(connectionConfig);
    console.log('Connected to MySQL as id ' + connection.threadId);
    return connection;
  } catch (error) {
    console.error('Error connecting to MySQL:', error);
    throw error;
  }
}

// Create a new user
app.post('/employees', async (req, res) => {
  const { firstName, lastName, email, dob ,gender ,education ,company, experience } = req.body;
  try {
    const connection = await connectToDatabase();
    const [results] = await connection.query('INSERT INTO users (firstName,lastName, email, dob, gender ,education ,company ,experience) VALUES (?, ? ,?, ? ,?, ? ,?, ?)', [firstName, lastName, email, dob ,gender ,education ,company, experience]);
    console.log("result",results)
    await connection.end();
    res.status(201).json({ message: 'Employee created successfully', userId: results.insertId });
  } catch (error) {
    console.error('Error creating Employee:', error);
    res.status(500).json({ error: 'Error creating Employee' });
  }
});

// Get all users
app.get('/employees', async (req, res) => {
  try {
    const connection = await connectToDatabase();
    const [results] = await connection.query('SELECT * FROM users');
    await connection.end();
    res.json(results);
  } catch (error) {
    console.error('Error retrieving users from database:', error);
    res.status(500).json({ error: 'Error retrieving users from database' });
  }
});

// Update user


// Delete user
app.delete('/employees/:id', async(req, res) => {
  const connection = await connectToDatabase();
  const { id } = req.params;
  console.log("Line 108",id)
  const sql = 'DELETE FROM users WHERE id ='+id;
  const deleteQuery = await connection.query(sql);
  console.log(deleteQuery)
  console.log(deleteQuery[0])
  console.log(deleteQuery[0].affectedRows)
  // console.log(deleteQuery[0].ResultSetHeader & deleteQuery[0].ResultSetHeader.affectedRows)
  if(deleteQuery[0].affectedRows>0){
    res.status(200).json({ message: `Employee with ID ${id} has been deleted` });
    return;
  }else{
    res.status(404).json({ message: `Cannot find any employee with ID ${id}` });
    return;
  }
  //   (error, results) => {
  //   if (error) {
  //     console.log("Line 112",error)
  //     res.status(500).json({ message: error.message });
  //     return;
  //   }
  //   if (results.affectedRows === 0) {
  //     console.log("Line 117")
  //     res.status(404).json({ message: `Cannot find any employee with ID ${id}` });
  //     return;
  //   }

  //   console.log("Line 122")
  //   res.status(200).json({ message: `Employee with ID ${id} has been deleted` });
  // });
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});