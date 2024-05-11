import * as SQLite from 'expo-sqlite'

export let dbSQL: SQLite.SQLiteDatabase | null = null;

export async function initDb() {
    console.log("===> initDbCalled")
    dbSQL = SQLite.openDatabaseSync('caregiver.db')
    
    //This transaction is just used for tests.
    /*
    dbSQL.execAsync(`
        'DROP TABLE IF EXISTS passwords;'
        'DROP TABLE IF EXISTS elderly;'
    `)
    */
    dbSQL.execSync(`
        CREATE TABLE IF NOT EXISTS passwords (
            id TEXT PRIMARY KEY, 
            userId TEXT, 
            password TEXT, 
            timestamp INTEGER
        );

        CREATE TABLE IF NOT EXISTS sessionsSignal (
            id TEXT, 
            userId TEXT, 
            record TEXT, 
            PRIMARY KEY (id, userId)
        );

        CREATE TABLE IF NOT EXISTS elderly (
            elderlyId TEXT, 
            userId TEXT, 
            name TEXT,
            email TEXT, 
            phoneNumber TEXT, 
            status INTEGER DEFAULT 0, 
            PRIMARY KEY(userId, email, phoneNumber)
        );

        CREATE TABLE IF NOT EXISTS credentials (
            userId TEXT NOT NULL, 
            credentialId TEXT NOT NULL, 
            record TEXT NOT NULL, 
            PRIMARY KEY (userId, credentialId)
        );

        CREATE TABLE IF NOT EXISTS timeout (
            userId TEXT NOT NULL,
            timestamp INTEGER NOT NULL,
            type INTEGER NOT NULL,
            PRIMARY KEY (userId, type)
        );
    `)
}