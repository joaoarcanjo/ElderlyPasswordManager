import * as SQLite from 'expo-sqlite'
import { generateKey } from '../algorithms/tweetNacl/crypto';
import { emptyValue } from '../assets/constants/constants';
import { getKeychainValueFor, saveKeychainValue } from '../keychain';
import { localDBKey } from '../keychain/constants';

export let dbSQL: SQLite.SQLiteDatabase | null = null;

async function createLocalDBKey(userId: string) {
    console.log("===> createLocalDBKeyCalled")
    console.log("UserId: create local db: ", userId)
    if(await getKeychainValueFor(localDBKey(userId)) == emptyValue) {
        const key = generateKey()
        console.log("Local DB Key: ", key)
        await saveKeychainValue(localDBKey(userId), key) 
    }
    return await getKeychainValueFor(localDBKey(userId))
}


export async function initDb(userId: string) {
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
            userId TEXT NOT NULL, 
            password TEXT NOT NULL, 
            timestamp INTEGER NOT NULL
        );

        CREATE TABLE IF NOT EXISTS sessionsSignal (
            elderlyId TEXT NOT NULL, 
            userId TEXT NOT NULL, 
            record TEXT NOT NULL, 
            PRIMARY KEY (id, userId)
        );

        CREATE TABLE IF NOT EXISTS elderly (
            elderlyId TEXT NOT NULL, 
            userId TEXT NOT NULL, 
            name TEXT NOT NULL,
            email TEXT NOT NULL, 
            phoneNumber TEXT NOT NULL, 
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

    return await createLocalDBKey(userId)
}