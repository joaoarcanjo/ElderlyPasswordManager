import * as SQLite from 'expo-sqlite'
import * as Crypto from 'expo-crypto'

export let db: SQLite.SQLiteDatabase | null = null;

export function initDb() {
    db = SQLite.openDatabase('elderly.db')
    /*
    db.transaction(tx => {
        tx.executeSql(
            'DROP TABLE IF EXISTS passwords;'
        )
    })*/

    db.transaction(tx => {
       tx.executeSql(
        'CREATE TABLE IF NOT EXISTS passwords (id TEXT PRIMARY KEY, password TEXT, timestamp INTEGER);'
    );
    })
    //TODO: Criar a tabela para guardar os perfis dos cuidadores.
}

/*
This function is used to delete the older password generated. 
*/
export const deleteGenerated = () => {
    if(db != null) {
        db.transaction((tx) => {
            tx.executeSql(
              'DELETE FROM passwords WHERE id IN (SELECT id FROM passwords ORDER BY timestamp DESC LIMIT -10 OFFSET 9)',
              [],
              (_, result) => {
                console.log('Tuplo com timestamp mais antigo excluído com sucesso:', result);
              }
            );
        });
    }
}
  
/*
Function to save the new generated password.
*/
export const savePasswordGenerated = (password: string) => {
    deleteGenerated()
    if(db != null) {
        db.transaction(tx => {
            tx.executeSql('INSERT INTO passwords (id, password, timestamp) VALUES (?, ?, ?);',
            [Crypto.randomUUID(), password, Date.now()],
            (_, result) => {
                console.log('Novo registro inserido com sucesso:', result);
            })
        });
    }
}
  
export const getPasswords = () => {
    if(db != null) {
        db.transaction(tx => {
            return tx.executeSql('SELECT (id, password, timestamp) FROM passwords', [],
                (txObj, resultSet) => resultSet.rows._array
            );
        });
    }
}