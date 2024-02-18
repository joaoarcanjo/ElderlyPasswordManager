import * as SQLite from 'expo-sqlite'
import * as Crypto from 'expo-crypto'
import { Elderly, Password } from './types';
import { decrypt, encrypt } from '../algorithms/0thers/crypto';

export let db: SQLite.SQLiteDatabase | null = null;

export function initDb() {
    db = SQLite.openDatabase('elderly.db')
    
    //Os cuidadores também vão guardar as suas passwords
    db.transaction(tx => {
        tx.executeSql(
            'DROP TABLE IF EXISTS passwords;'
        )
    })

    db.transaction(tx => {
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS passwords (id TEXT PRIMARY KEY, password TEXT, timestamp INTEGER);'
        )
    })

    db.transaction(tx => {
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS elderly (id TEXT PRIMARY KEY, name TEXT, email TEXT, phoneNumber TEXT);'
        )
    })
}

export const saveElderly = async (id: string, email: string, phoneNumber: string) => {
    if(db != null) {
        db.transaction(tx => {
            tx.executeSql(
                'INSERT INTO elderly (id, email, phoneNumber) VALUES (?,?,?)',
                [id, email, phoneNumber],
                (_, result) => {
                    //console.log('Tuplo inserido com sucesso:', result);
                }
            );
        });
    }
}

/*
This function is used to delete the older password generated. 
*/
export const deleteElderly = async (id: string) => {
    if(db != null) {
        db.transaction((tx) => {
            tx.executeSql(
              'DELETE FROM elderly WHERE id = ?',
              [],
              (_, result) => {
                //console.log('Tuplo com timestamp mais antigo excluído com sucesso:', result);
              }
            );
        });
    }
}

//TODO: Colocar a DBKey
export const selectAllElderly = (/*localDBKey: string*/): Promise<Elderly[]> => {
    return new Promise(async (resolve, reject) => {
        const sql = 'SELECT id, name, email, phoneNumber FROM elderly';

        const data: Elderly[] = [];
        try {
            if(db == null) {
                throw (new Error("Database is not connected."))
            }
            db.transaction((tx) => {
                tx.executeSql(sql, [], (tx, results) => {
                    for (let i = 0; i < results.rows.length; i++) {                        
                        data.push({
                            id: results.rows.item(i).id,
                            name: results.rows.item(i).name,//decrypt(results.rows.item(i).name, localDBKey),   
                            email: results.rows.item(i).password,//decrypt(results.rows.item(i).password, localDBKey), 
                            phoneNumber: results.rows.item(i).phoneNumber//decrypt(results.rows.item(i).phoneNumber, localDBKey),   
                        });
                    }
                    resolve(data)
                    }
                );
            });
        } catch (error) {
            reject(error)
        }
    });
};