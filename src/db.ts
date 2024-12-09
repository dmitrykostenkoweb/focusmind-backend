import {Pool} from 'pg';

const pool = new Pool({
    database: 'postgres',
    host: 'db',
    user: 'user',
    password: 'pass',
    port: 5432,
});

export default pool