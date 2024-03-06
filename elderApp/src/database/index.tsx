import * as SQLite from 'expo-sqlite'
import * as Crypto from 'expo-crypto'
import { Caregiver, Password } from './types';
import { decrypt, encrypt } from '../algorithms/0thers/crypto';

export let db: SQLite.SQLiteDatabase | null = null;

export function initDb() {
    db = SQLite.openDatabase('elderly.db')
    
    db.transaction(tx => {
          /*tx.executeSql(
            'DROP TABLE IF EXISTS passwords;'
        )*/
    })

    db.transaction(tx => {
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS passwords (id TEXT PRIMARY KEY, password TEXT, timestamp INTEGER);'
        )
    })

    db.transaction(tx => {
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS caregivers (id TEXT, name TEXT, email TEXT PRIMARY KEY, phoneNumber TEXT, UNIQUE(email, phoneNumber));'
        )
    })
}

  /**
 * Função para guardar os dados de determinado cuidador.
 * @param id 
 * @param email 
 * @param phoneNumber 
 */
export const saveCaregiver = async (id: string, name: string, email: string, phoneNumber: string) => {
    if(db != null) {
        db.transaction(tx => {
            tx.executeSql(
                'INSERT INTO caregivers (id, name, email, phoneNumber) VALUES (?,?,?,?)',
                [id, name, email, phoneNumber],
                (_, result) => {
                    return Promise.resolve(result.rowsAffected > 0)
                }
            );
        });
    }
}

export const updateCaregiver = async (email: string, newName: string, newPhoneNumber: string) => {
    console.log("Email: "+email)
    if (db != null) {
        db.transaction(tx => {
            tx.executeSql(
                'UPDATE caregivers SET name = ?, phoneNumber = ? WHERE email = ?',
                [newName, newPhoneNumber, email],
                (_, result) => {
                      // Verifique se houve alguma linha afetada para confirmar se a atualização foi bem-sucedida.
                    if (result.rowsAffected > 0) {
                        console.log('- Cuidador atualizado com sucesso.')
                    } else {
                        console.log('- Nenhum cuidador foi atualizado. Verifique o email fornecido.')
                    }
                }
            );
        });
    }
}

export const deleteCaregiver = async (email: string) => {
    if (db != null) {
        db.transaction(tx => {
            tx.executeSql(
                'DELETE FROM caregivers WHERE email = ?',
                [email],
                (_, result) => {
                    if (result.rowsAffected > 0) {
                        console.log('- Cuidador apagado com sucesso.');
                    } else {
                        console.log('- Nenhum cuidador foi apagado. Verifique o email fornecido.');
                    }
                }
            );
        });
    }
}

export const checkCaregiverByEmail = async (email: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        if (db != null) {
            db.transaction(tx => {
                tx.executeSql(
                    'SELECT COUNT(*) AS count FROM caregivers WHERE email = ?',
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

export const getCaregivers = (): Promise<Caregiver[]> => {
    return new Promise(async (resolve, reject) => {
        const sql = 'SELECT id, name, email, phoneNumber FROM caregivers LIMIT 2';

        const data: Caregiver[] = [];
        try {
            if(db == null) {
                throw (new Error("Database is not connected."))
            }
            db.transaction((tx) => {
                tx.executeSql(sql, [], (tx, results) => {
                    for (let i = 0; i < results.rows.length; i++) {                        
                        data.push({
                            id         : results.rows.item(i).id,
                            name       : results.rows.item(i).name,
                            email      : results.rows.item(i).email,
                            phoneNumber: results.rows.item(i).phoneNumber
                        });
                    }
                    resolve(data)
                    }
                );
            });
        } catch (error) {
            reject(error)
        }
    })
}

  /*
This function is used to delete the older password generated. 
*/
const deletePasswordGenerated = () => {
    if(db != null) {
        db.transaction((tx) => {
            tx.executeSql(
              'DELETE FROM passwords WHERE id IN (SELECT id FROM passwords ORDER BY timestamp DESC LIMIT -10 OFFSET 9)',
              [],
              (_, result) => {
                  //console.log('Tuplo com timestamp mais antigo excluído com sucesso:', result);
              }
            );
        });
    }
}
  
  /*
Function to save the new generated password.
*/
export const savePasswordGenerated = async (password: string, localDBKey: string) => {
    deletePasswordGenerated()

      //console.log(localDBKey)
    const encrypted = encrypt(password, localDBKey)
      //console.log(encrypted)

    if(db != null) {
        db.transaction(tx => {
            tx.executeSql('INSERT INTO passwords (id, password, timestamp) VALUES (?, ?, ?);',
            [Crypto.randomUUID(), encrypted, Date.now()],
            (_, result) => {
                  //console.log('Novo registro inserido com sucesso:', result);
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

export const getGeneratedPasswords = (localDBKey: string): Promise<Password[]> => {
    return new Promise(async (resolve, reject) => {
        const sql = 'SELECT id, password, timestamp FROM passwords ORDER BY timestamp DESC LIMIT 10';

        const data: Password[] = [];
        try {
            if(db == null) {
                throw (new Error("Database is not connected."))
            }
            db.transaction((tx) => {
                tx.executeSql(sql, [], (tx, results) => {
                    for (let i = 0; i < results.rows.length; i++) {                        
                        data.push({
                            id       : results.rows.item(i).id,
                            password : decrypt(results.rows.item(i).password, localDBKey),
                            timestamp: results.rows.item(i).timestamp
                        });
                    }
                    resolve(data)
                    }
                );
            });
        } catch (error) {
            reject(error)
        }
    })
}