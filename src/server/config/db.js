import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const context = new Pool({
	user: 'postgres',
	password: '7139852465',
	host: 'localhost',
	port: 5432,
	database: process.env.PRODUCTION === 'no' ? 'dbmain' : 'brain',
});

export default {
	query: (text, params) => context.query(text, params),
};
