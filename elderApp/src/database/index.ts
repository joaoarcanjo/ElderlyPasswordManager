import * as SQLite from 'expo-sqlite'

export let dbSQL: SQLite.SQLiteDatabase | null = null;

export function initDb() {
    dbSQL = SQLite.openDatabase('elderly.db')
    /*
    dbSQL.transaction(tx => {
          tx.executeSql(
            'DROP TABLE IF EXISTS sessionsSignal;'
        )
    })*/

    dbSQL.transaction(tx => {
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS passwords (id TEXT PRIMARY KEY, password TEXT, timestamp INTEGER);'
        )
    })

    dbSQL.transaction(tx => {
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS caregivers (id TEXT, name TEXT, email TEXT PRIMARY KEY, phoneNumber TEXT, UNIQUE(email, phoneNumber));'
        )
    })

    dbSQL.transaction(tx => {
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS sessionsSignal (id TEXT, userId TEXT, record TEXT, PRIMARY KEY (id, userId));'
        )
    })
}