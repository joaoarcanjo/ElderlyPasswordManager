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
            userId TEXT, 
            password TEXT, 
            timestamp INTEGER
        );
    
        CREATE TABLE IF NOT EXISTS caregivers (
            caregiverId TEXT, 
            userId TEXT, 
            name TEXT, 
            email TEXT, 
            phoneNumber TEXT, 
            status INTEGER, 
            PRIMARY KEY(userId, email, phoneNumber)
        );

        CREATE TABLE IF NOT EXISTS sessionsSignal (
            id TEXT, 
            userId TEXT, 
            record TEXT, 
            PRIMARY KEY (id, userId)
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