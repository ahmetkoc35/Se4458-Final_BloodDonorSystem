const mysql = require("mysql2/promise");

// Create a new connection pool to reuse connections to the database
const pool = mysql.createPool({
	host: process.env.DATABASE_HOST,
	user: process.env.DATABASE_USER,
	password: process.env.DATABASE_PASSWORD,
	database: process.env.DATABASE_NAME,
	port: process.env.DATABASE_PORT,
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0,
});

// Export the query function
module.exports = {
	query: async (text, params) => {
		const [rows, fields] = await pool.execute(text, params);
		return rows;
	},
};