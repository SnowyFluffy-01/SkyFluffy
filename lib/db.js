import { Client} from "pg";

const db = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'duck123',
    database: 'skyfluffy'
}
)

db.connect()
let query = 'CREATE TABBLE IF NOT EXISTS assets (id SERIAL PRIMARY KEY, nbt TEXT NOT NULL, png TEXT NOT NULL)'
db.query(query)