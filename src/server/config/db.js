import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const context = new Pool({
	user: '',
	password: '',
	host: '',
	port: '',
	database: '',
});

export default {
	query: (text, params) => context.query(text, params),
};
