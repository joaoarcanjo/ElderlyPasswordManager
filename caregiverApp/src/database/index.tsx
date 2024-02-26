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
            'CREATE TABLE IF NOT EXISTS elderly (id TEXT, name TEXT, email TEXT PRIMARY KEY, phoneNumber TEXT, accepted INTEGER DEFAULT 0, UNIQUE(email, phoneNumber));'
        )
    })
}

export const saveElderly = async (id: string, name: string, email: string, phoneNumber: string) => {
    if(db != null) {
        try {
            db.transaction(tx => { 
                tx.executeSql(
                    `INSERT INTO elderly (id, name, email, phoneNumber) VALUES (?, ?, ?, ?)
                    `,
                    [id, name, email, phoneNumber],
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
                'UPDATE elderly SET name = CASE WHEN ? != \'\' THEN ? ELSE name END, phoneNumber = CASE WHEN ? != \'\' THEN ? ELSE phoneNumber END WHERE email = ?',
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

export const acceptElderlyOnDatabase = async (email: string) => {
    if (db != null) {
        db.transaction(tx => {
            tx.executeSql(
                'UPDATE elderly SET accepted = ? WHERE email = ?',
                [1, email],
                (_, result) => {
                    // Verifique se houve alguma linha afetada para confirmar se a atualização foi bem-sucedida.
                    if (result.rowsAffected > 0) {
                        console.log('-> Idoso aceite.')
                    } else {
                        console.log('-> Idoso não aceite, erro.')
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
              'DELETE FROM elderly WHERE email = ?',
              [id],
              (_, result) => {
                if (result.rowsAffected > 0) {
                    console.log("-> Idoso apagado da base de dados.")
                } else {
                    console.log('-> Idoso não apagado, erro.')
                }
              },
              (_, error) => {
               console.log('-> Error deleting elderly from database', error)
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
        const sql = 'SELECT id, name, email, phoneNumber, accepted FROM elderly';

        const data: Elderly[] = [];
        try {
            if(db == null) {
                throw (new Error("Database is not connected."))
            }
            db.transaction((tx) => {
                tx.executeSql(sql, [], (tx, results) => {
                    for (let i = 0; i < results.rows.length; i++) {                        
                        data.push({
                            userId: results.rows.item(i).id,
                            name: results.rows.item(i).name,//decrypt(results.rows.item(i).name, localDBKey),   
                            email: results.rows.item(i).email,//decrypt(results.rows.item(i).password, localDBKey), 
                            phoneNumber: results.rows.item(i).phoneNumber,//decrypt(results.rows.item(i).phoneNumber, localDBKey),   
                            accepted: results.rows.item(i).accepted
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