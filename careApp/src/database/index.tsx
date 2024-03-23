import * as SQLite from 'expo-sqlite'
import { ElderlyRequestStatus } from './types';
export let dbSQL: SQLite.SQLiteDatabase | null = null;

export function initDb() {
    dbSQL = SQLite.openDatabase('caregiver.db')
    
    //Os cuidadores também vão guardar as suas passwords
    dbSQL.transaction(tx => {
        tx.executeSql(
            'DROP TABLE IF EXISTS passwords;'
        )
        tx.executeSql(
            'DROP TABLE IF EXISTS elderly;'
        )
    })

    dbSQL.transaction(tx => {
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS passwords (id TEXT PRIMARY KEY, userId TEXT, password TEXT, timestamp INTEGER);'
        )

        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS elderly (elderlyId TEXT, userId TEXT, name TEXT, email TEXT, phoneNumber TEXT, status INTEGER DEFAULT 0, PRIMARY KEY(userId, email, phoneNumber));'
        )

        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS sessionsSignal (id TEXT, userId TEXT, record TEXT, PRIMARY KEY (id, userId));'
        )

        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS credentials (
                userId TEXT NOT NULL, 
                credentialId TEXT NOT NULL, 
                record TEXT NOT NULL, 
                PRIMARY KEY (userId, credentialId)
            );`
        )

    })
}