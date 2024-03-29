import * as SQLite from 'expo-sqlite'

export let dbSQL: SQLite.SQLiteDatabase | null = null;

export function initDb() {
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
            'CREATE TABLE IF NOT EXISTS passwords (id TEXT PRIMARY KEY, userId TEXT, password TEXT, timestamp INTEGER);'
        )

        //Tabela para armazenar os dados dos cuidadores.
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS caregivers (caregiverId TEXT, userId TEXT, name TEXT, email TEXT, phoneNumber TEXT, status INTEGER, PRIMARY KEY(userId, email, phoneNumber));'
        )

        //Tabela para armazenar as sessões com os outros utilizadores (protocolo signal)
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
        
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS timeout (
                userId TEXT NOT NULL,
                timestamp INTEGER NOT NULL,
                type INTEGER NOT NULL,
                PRIMARY KEY (userId, type)
            );`
        )
    })
}