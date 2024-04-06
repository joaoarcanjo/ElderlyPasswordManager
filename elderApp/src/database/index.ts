import * as SQLite from 'expo-sqlite'
import { generateKey } from '../algorithms/0thers/crypto';
import { getKeychainValueFor, saveKeychainValue } from '../keychain';
import { localDBKey } from '../keychain/constants';

export let dbSQL: SQLite.SQLiteDatabase | null = null;

async function createLocalDBKey(userId: string) {
  if(await getKeychainValueFor(localDBKey(userId)) == '') {
    await saveKeychainValue(localDBKey(userId), generateKey()) 
  }
  return await getKeychainValueFor(localDBKey(userId))
}

export async function initDb(userId: string) {

    dbSQL = SQLite.openDatabase('elderly.db')
    
    dbSQL.transaction(tx => {
        /*tx.executeSql(
            'DROP TABLE IF EXISTS caregivers;'
        )
        tx.executeSql(
            'DROP TABLE IF EXISTS sessionsSignal;'
        )
        tx.executeSql(
            'DROP TABLE IF EXISTS credentials;'
        )*/
    })

    dbSQL.transaction(tx => {
        //Esta tabela tem como intuito armazenar passwords geradas pelo gerador.
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS passwords (
                id TEXT PRIMARY KEY, 
                userId TEXT, 
                password TEXT, 
                timestamp INTEGER
            );`
        )

        //Tabela para armazenar os dados dos cuidadores.
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS caregivers (
                caregiverId TEXT, 
                userId TEXT, 
                name TEXT, 
                email TEXT, 
                phoneNumber TEXT, 
                status INTEGER, 
                PRIMARY KEY(userId, email, phoneNumber)
            );`
        )

        //Tabela para armazenar as sessões com os outros utilizadores (protocolo signal)
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS sessionsSignal (
                id TEXT, userId TEXT, 
                record TEXT, 
                PRIMARY KEY (id, userId)
            );`
        )

        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS credentials (
                userId TEXT NOT NULL, 
                credentialId TEXT NOT NULL, 
                record TEXT NOT NULL, 
                PRIMARY KEY (userId, credentialId)
            );`
        )
        
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS timeout (
                userId TEXT NOT NULL,
                timestamp INTEGER NOT NULL,
                type INTEGER NOT NULL,
                PRIMARY KEY (userId, type)
            );`
        )
    })

    return await createLocalDBKey(userId)
}