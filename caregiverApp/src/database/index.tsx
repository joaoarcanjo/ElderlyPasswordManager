import * as SQLite from 'expo-sqlite'
import * as Crypto from 'expo-crypto'
import { Elderly, Password } from './types';
import { decrypt, encrypt } from '../algorithms/0thers/crypto';

export let db: SQLite.SQLiteDatabase | null = null;

export function initDb() {
    db = SQLite.openDatabase('caregiver.db')
    
    //Os cuidadores também vão guardar as suas passwords
    db.transaction(tx => {
        tx.executeSql(
            'DROP TABLE IF EXISTS passwords;'
        )
        tx.executeSql(
            'DROP TABLE IF EXISTS elderly;'
        )
    })

    db.transaction(tx => {
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS passwords (id TEXT PRIMARY KEY, password TEXT, timestamp INTEGER);'
        )
    })

    db.transaction(tx => {
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS elderly (name TEXT, email TEXT PRIMARY KEY, phoneNumber TEXT, UNIQUE(email, phoneNumber));'
        )
    })
}

export const saveElderly = async (name: string, email: string, phoneNumber: string) => {
    if(db != null) {
        try {
            db.transaction(tx => { 
                tx.executeSql(
                    `INSERT INTO elderly (name, email, phoneNumber) VALUES (?, ?, ?)
                    `,
                    [name, email, phoneNumber],
                    (_, result) => {
                        //console.log('Tuplo inserido com sucesso:', result);
                    }
                )
            });
        }catch (error) {
            console.log(error)
        }
    }
}

export const updateElderly = async (email: string, newName: string, newPhoneNumber: string) => {
    if (db != null) {
        db.transaction(tx => {
            tx.executeSql(
                'UPDATE elderly SET name = ?, phoneNumber = ? WHERE email = ?',
                [newName, newPhoneNumber, email],
                (_, result) => {
                    // Verifique se houve alguma linha afetada para confirmar se a atualização foi bem-sucedida.
                    if (result.rowsAffected > 0) {
                        console.log('-> Idoso atualizado com sucesso.')
                    } else {
                        console.log('-> Nenhum idoso foi atualizado. Verifique o email fornecido.')
                    }
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

export const checkElderlyByEmail = async (email: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        if (db != null) {
            db.transaction(tx => {
                tx.executeSql(
                    'SELECT COUNT(*) AS count FROM elderly WHERE email = ?',
                    [email],
                    (_, result) => {
                        const count = result.rows.item(0).count;
                        resolve(count > 0); 
                    }
                );
            });
        } else {
            reject(new Error('Database not initialized.')); 
        }
    })
}

//TODO: Colocar a DBKey
export const getAllElderly = (/*localDBKey: string*/): Promise<Elderly[]> => {
    return new Promise(async (resolve, reject) => {
        const sql = 'SELECT name, email, phoneNumber FROM elderly';

        const data: Elderly[] = [];
        try {
            if(db == null) {
                throw (new Error("Database is not connected."))
            }
            db.transaction((tx) => {
                tx.executeSql(sql, [], (tx, results) => {
                    for (let i = 0; i < results.rows.length; i++) {                        
                        data.push({
                            name: results.rows.item(i).name,//decrypt(results.rows.item(i).name, localDBKey),   
                            email: results.rows.item(i).email,//decrypt(results.rows.item(i).password, localDBKey), 
                            phoneNumber: results.rows.item(i).phoneNumber//decrypt(results.rows.item(i).phoneNumber, localDBKey),   
                        });
                    }
                    resolve(data)
                    }
                );
            });
        } catch (error) {
            console.log("-> Erro a obter os idosos.")
            reject(error)
        }
    });
};