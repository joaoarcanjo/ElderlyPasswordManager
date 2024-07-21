import * as SQLite from 'expo-sqlite';
import { getKeychainValueFor, saveKeychainValue } from '../keychain';
import { localDBKey } from '../keychain/constants';
import { generateKey } from '../algorithms/tweetNacl/crypto';
import { emptyValue } from '../assets/constants/constants';

export let dbSQL: SQLite.SQLiteDatabase | null = null;

async function createLocalDBKey(userId: string) {
    console.log("===> createLocalDBKeyCalled")
    if(await getKeychainValueFor(localDBKey(userId)) == emptyValue) {
        await saveKeychainValue(localDBKey(userId), generateKey()) 
    }
    return await getKeychainValueFor(localDBKey(userId))
}

export async function initDb(userId: string) {

    dbSQL = SQLite.openDatabaseSync('elderly.db')
  
/*
    dbSQL.execAsync(`
        DROP TABLE IF EXISTS passwords;
        DROP TABLE IF EXISTS sessionsSignal;
        DROP TABLE IF EXISTS credentials;
    `)
*/

    dbSQL.execSync(`
        CREATE TABLE IF NOT EXISTS passwords (
            id TEXT PRIMARY KEY, 
            userId TEXT NOT NULL, 
            password TEXT NOT NULL, 
            timestamp INTEGER NOT NULL
        );
    
        CREATE TABLE IF NOT EXISTS caregivers (
            caregiverId TEXT NOT NULL, 
            userId TEXT NOT NULL, 
            name TEXT NOT NULL, 
            email TEXT NOT NULL, 
            phoneNumber TEXT NOT NULL, 
            status INTEGER DEFAULT 0, 
            PRIMARY KEY(userId, email)
        );

        CREATE TABLE IF NOT EXISTS sessionsSignal (
            caregiverId TEXT NOT NULL, 
            userId TEXT NOT NULL, 
            record TEXT NOT NULL, 
            PRIMARY KEY (caregiverId, userId)
        );

        CREATE TABLE IF NOT EXISTS credentials (
            userId TEXT NOT NULL, 
            credentialId TEXT NOT NULL, 
            record TEXT NOT NULL, 
            PRIMARY KEY (credentialId)
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