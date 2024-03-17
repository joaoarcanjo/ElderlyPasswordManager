import * as SQLite from 'expo-sqlite'
import { Elderly, ElderlyRequestStatus } from './types';
import { ErrorInstance } from '../exceptions/error';
import { Errors } from '../exceptions/types';

export let db: SQLite.SQLiteDatabase | null = null;

export function initDb() {
    db = SQLite.openDatabase('caregiver.db')
    
    //Os cuidadores também vão guardar as suas passwords
    db.transaction(tx => {
        /*tx.executeSql(
            'DROP TABLE IF EXISTS passwords;'
        )
        tx.executeSql(
            'DROP TABLE IF EXISTS elderly;'
        )*/
    })

    db.transaction(tx => {
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS passwords (id TEXT PRIMARY KEY, userId TEXT, password TEXT, timestamp INTEGER);'
        )
    })

    db.transaction(tx => {
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS elderly (elderlyId TEXT, userId TEXT, name TEXT, email TEXT , phoneNumber TEXT, status INTEGER DEFAULT 0,  PRIMARY KEY(userId, email, phoneNumber));'
        )
    })

    db.transaction(tx => {
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS sessionsSignal (id TEXT, userId TEXT, record TEXT, PRIMARY KEY (id, userId));'
        )
    })
}

export const saveElderly = async (userId: string, id: string, name: string, email: string, phoneNumber: string, requestStatus: ElderlyRequestStatus): Promise<void> => {

    if (requestStatus == ElderlyRequestStatus.WAITING && await checkElderlyByEmailNotAccepted(userId, email)) {
        return Promise.reject(new ErrorInstance(Errors.ERROR_ELDERLY_ALREADY_ADDED))
    } 

    return new Promise((resolve, reject) => {
        if(db != null) {
            db.transaction(async tx => {
                tx.executeSql(
                    'INSERT INTO elderly (elderlyId, userId, name, email, phoneNumber, status) VALUES (?,?,?,?,?,?)',
                    [id, userId, name, email, phoneNumber, requestStatus],
                    (_, result) => {
                        if (result.rowsAffected > 0) {
                            return resolve()
                        } else {
                            return reject(new ErrorInstance(Errors.ERROR_SAVING_SESSION))
                        }
                    },
                    (_, _error) => {
                        return false
                    }
                );
            });
        } else {
            return reject(new ErrorInstance(Errors.ERROR_SAVING_SESSION))
        }
    });
}

export const updateElderly = async (userId: string, elderlyId: string, email: string, newName: string, newPhoneNumber: string) => {
    if (db != null) {
        db.transaction(tx => {
            tx.executeSql(
                'UPDATE elderly SET elderlyId = ?, name = ?, phoneNumber = ?, status = ? WHERE email = ? AND userId = ?',
                [elderlyId, newName, newPhoneNumber, ElderlyRequestStatus.ACCEPTED.valueOf(), email, userId],
                (_, result) => {
                    // Verifique se houve alguma linha afetada para confirmar se a atualização foi bem-sucedida.
                    if (result.rowsAffected > 0) {
                        console.log('-> Idoso atualizado com sucesso.')
                    } else {
                        console.log('-> Nenhum idoso foi atualizado. Verifique o email fornecido.')
                    }
                },
                (_, _error) => {
                    return false
                }
            );
        });
    }
}

//todo: adicionar o userId na query
export const acceptElderlyOnDatabase = async (email: string) => {
    if (db != null) {
        db.transaction(tx => {
            tx.executeSql(
                'UPDATE elderly SET status = ? WHERE email = ?',
                [ElderlyRequestStatus.ACCEPTED.valueOf(), email],
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
export const deleteElderly = async (userId: string, elderlyEmail: string): Promise<boolean> => {
    if(db != null) {
        db.transaction((tx) => {
            tx.executeSql(
              'DELETE FROM elderly WHERE email = ? AND userId = ?',
              [elderlyEmail, userId],
              (_, result) => {
                if (result.rowsAffected > 0) {
                    console.log("-> Idoso apagado da base de dados.")
                    return true
                } else {
                    console.log('-> Idoso não apagado, verifique o email fornecido.')
                    return false
                }
              },
              (error) => {
               console.log('-> Error deleting elderly from database', error)
               return false
              }
            );
        });
    }
    return false
}

export const checkElderlyByEmail = async (userId: string, email: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        if (db != null) {
            db.transaction(tx => {
                tx.executeSql(
                    'SELECT COUNT(*) AS count FROM elderly WHERE email = ? AND userId = ? AND status = ?;',
                    [email, userId, ElderlyRequestStatus.ACCEPTED.valueOf()],
                    (_, result) => {
                        const count = result.rows.item(0).count;
                        return resolve(count > 0); 
                    }
                );
            });
        } else {
            reject(new Error('Database not initialized.')); 
        }
    })
}

export const checkElderlyByEmailNotAccepted = async (userId: string, email: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        if (db != null) {
            db.transaction(tx => {
                tx.executeSql(
                    'SELECT COUNT(*) AS count FROM elderly WHERE email = ? AND userId = ? AND status = ?;',
                    [email, userId, ElderlyRequestStatus.WAITING.valueOf()],
                    (_, result) => {
                        const count = result.rows.item(0).count;
                        return resolve(count > 0); 
                    },
                    (_, _error) => {
                     return false
                    }
                );
            });
        } else {
            reject(new Error('Database not initialized.')); 
        }
    })
}

export const getAllElderly = (userId: string): Promise<Elderly[]> => {
    console.log(userId)
    return new Promise((resolve, reject) => {
        const sql = '';

        const data: Elderly[] = [];
        try {
            if(db == null) {
                throw (new Error("Database is not connected."))
            }
            db.transaction((tx) => {
                tx.executeSql('SELECT elderlyId, name, email, phoneNumber, status FROM elderly WHERE userId = ?;', 
                [userId], (_tx, results) => {
                    for (let i = 0; i < results.rows.length; i++) {                        
                        data.push({
                            elderlyId: results.rows.item(i).elderlyId,
                            name: results.rows.item(i).name,//decrypt(results.rows.item(i).name, localDBKey),   
                            email: results.rows.item(i).email,//decrypt(results.rows.item(i).password, localDBKey), 
                            phoneNumber: results.rows.item(i).phoneNumber,//decrypt(results.rows.item(i).phoneNumber, localDBKey),   
                            status: results.rows.item(i).status
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