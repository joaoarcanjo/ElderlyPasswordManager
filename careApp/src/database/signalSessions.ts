import { db } from ".";
import { decrypt, encrypt } from "../algorithms/0thers/crypto";
import { SessionSignal } from "./types";

  /**
 * Função para guardar os dados de uma sessão.
 * @param id 
 * @param email 
 * @param phoneNumber 
 */
  export const saveSignalSessions = async (userId: string, otherId: string, record: string, localDBKey: string) => {

    const encrypted = encrypt(record, localDBKey)
    
    if(db != null) {
        return db.transaction(async tx => {
            tx.executeSql(
                'SELECT * FROM sessionsSignal WHERE id = ? AND userId = ?',
                [otherId, userId],
                (_, result) => {
                    if (result.rows.length > 0) {
                        // Row with given id and userId exists, perform UPDATE
                        tx.executeSql(
                            'UPDATE sessionsSignal SET record = ? WHERE id = ? AND userId = ?',
                            [encrypted, otherId, userId],
                            () => {
                                //console.log('- Sessão atualizada com sucesso.')
                                return Promise.resolve();
                            },
                            (_, error) => {
                                console.log(error);
                                return Promise.reject();
                            }
                        );
                    } else {
                        // No row with given id and userId exists, perform INSERT
                        tx.executeSql(
                            'INSERT INTO sessionsSignal (id, userId, record) VALUES (?,?,?)',
                            [otherId, userId, encrypted],
                            () => {
                                //console.log('- Sessão salva com sucesso.')
                                return Promise.resolve();
                            },
                            (_, error) => {
                                console.log(error);
                                return Promise.reject();
                            }
                        );
                    }
                },
                (_, error) => {
                    console.log(error);
                    return Promise.reject();
                }
            );
        });
    }
    return Promise.reject();
}


/**
 * Função para obter a sessão com determinado id.
 * @param id 
 * @returns 
 */
export const getSessionById = async (otherId: string, userId: string, localDBKey: string): Promise<SessionSignal | undefined> => {
    console.log("===> getSessionByIdCalled")
    return new Promise((resolve, reject) => {
        if(db != null) {
            db.transaction(async tx => {
                tx.executeSql(
                    'SELECT (record) FROM sessionsSignal WHERE id = ? AND userId = ?',
                    [otherId, userId],
                    (_, result) => {
                        if (result.rows.length > 0) {
                            resolve({
                                record: decrypt(result.rows.item(0).record, localDBKey),
                            })
                        } else {
                            resolve(undefined)
                        }
                    },
                    (_, error) => {
                        console.log(error)
                        reject(error)
                        return false
                    }
                );
            });
        } else {
            reject(new Error("Database connection not established"));
        }
    });
}

/**
 * Função para apagar a sessão com determinado id.
 * @param id 
 * @returns 
 */
export const deleteSessionById = async (userId: string, otherId: string) => {
    if(db != null) {
        db.transaction(async tx => {
            tx.executeSql(
                'DELETE FROM sessionsSignal WHERE userId = ? AND id = ?;',
                [userId, otherId],
                (_, result) => {
                    return Promise.resolve(result.rowsAffected > 0);
                },
                (_, error) => {
                    return Promise.reject(error);
                }
            );
        });
    }
    return Promise.reject(false)
}

/**
 * Função para apagar todas as sessões
 */
 export const deleteAllSessions = async (userId: string) => {
    if(db != null) {
        db.transaction(async tx => {
            tx.executeSql(
                'DELETE FROM table_name WHERE userId = ?',
                [userId],
                (_, result) => {
                    return Promise.resolve(result.rowsAffected > 0);
                },
                (_, error) => {
                    return Promise.reject(error);
                }
            );
        });
    }
    return Promise.reject(false)
}