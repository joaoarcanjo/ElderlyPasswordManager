import * as SQLite from 'expo-sqlite'

export let dbSQL: SQLite.SQLiteDatabase | null = null;

export function initDb() {
    dbSQL = SQLite.openDatabase('elderly.db')
    
    dbSQL.transaction(tx => {
        tx.executeSql(
            'DROP TABLE IF EXISTS caregivers;'
        )
        tx.executeSql(
            'DROP TABLE IF EXISTS sessionsSignal;'
        )
    })

    dbSQL.transaction(tx => {
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS passwords (id TEXT PRIMARY KEY, userId TEXT, password TEXT, timestamp INTEGER);'
        )
    })

    dbSQL.transaction(tx => {
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS caregivers (caregiverId TEXT, userId TEXT, name TEXT, email TEXT PRIMARY KEY, phoneNumber TEXT, status INTEGER, UNIQUE(userId, email, phoneNumber));'
        )
    })

    dbSQL.transaction(tx => {
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS sessionsSignal (id TEXT, userId TEXT, record TEXT, PRIMARY KEY (id, userId));'
        )
    })
}