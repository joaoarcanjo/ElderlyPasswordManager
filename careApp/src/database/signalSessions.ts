import { dbSQL } from ".";
import { decrypt, encrypt } from "../algorithms/0thers/crypto";
import { Errors } from "../exceptions/types";
import { SessionSignal } from "./types";

/**
 * Função para guardar os dados de uma sessão, entre os dois utilizadores
 * @param userId 
 * @param otherId 
 * @param record 
 * @param localDBKey 
 * @returns 
 */
  export const saveSignalSessions = async (userId: string, otherId: string, record: string, localDBKey: string) => {

    const encrypted = encrypt(record, localDBKey)
    
    if(dbSQL != null) {
        return dbSQL.transaction(async tx => {
            tx.executeSql(
                'SELECT * FROM sessionsSignal WHERE id = ? AND userId = ?;',
                [otherId, userId],
                (_, result) => {
                    if (result.rows.length > 0) {
                        // Row with given id and userId exists, perform UPDATE
                        tx.executeSql(
                            'UPDATE sessionsSignal SET record = ? WHERE id = ? AND userId = ?;',
                            [encrypted, otherId, userId],
                            () => {
                                //console.log('- Sessão atualizada com sucesso.')
                                return Promise.resolve()
                            },
                            (_, error) => {
                                console.log(error)
                                return false
                            }
                        );
                    } else {
                        // No row with given id and userId exists, perform INSERT
                        tx.executeSql(
                            'INSERT INTO sessionsSignal (id, userId, record) VALUES (?,?,?);',
                            [otherId, userId, encrypted],
                            () => {
                                //console.log('- Sessão salva com sucesso.')
                                return Promise.resolve();
                            },
                            (_, error) => {
                                console.log(error)
                                return false
                            }
                        );
                    }
                },
                (_, error) => {
                    console.log(error)
                    return false
                }
            );
        });
    }
    return Promise.reject();
}


/**
 * Função para obter uma sessão com determinado utilizador
 * @param otherId 
 * @param userId 
 * @param localDBKey 
 * @returns 
 */
export const getSessionById = async (otherId: string, userId: string, localDBKey: string): Promise<SessionSignal | undefined> => {
    console.log("===> getSessionByIdCalled")
    return new Promise((resolve, reject) => {
        if(dbSQL != null) {
            dbSQL.transaction(async tx => {
                tx.executeSql(
                    'SELECT (record) FROM sessionsSignal WHERE id = ? AND userId = ?;',
                    [otherId, userId],
                    (_, result) => {
                        if (result.rows.length > 0) {
                            return resolve({
                                record: decrypt(result.rows.item(0).record, localDBKey),
                            })
                        } else {
                            return resolve(undefined)
                        }
                    },
                    (_, error) => {
                        console.log(error)
                        return false
                    }
                )
            })
        } else {
            reject(new Error("Database connection not established"));
        }
    });
}

/**
 * Deletes a session by its user ID and other ID.
 * 
 * @param {string} userId - The user ID.
 * @param {string} otherId - The other ID.
 * @returns {Promise<boolean>} A promise that resolves to true if the session was deleted successfully, or false otherwise.
 * @throws {Errors.ERROR_DELETING_SESSION} If there was an error deleting the session.
 * @throws {Errors.ERROR_DATABASE_NOT_INITIALIZED} If the database is not initialized.
 */
export const deleteSessionById = async (userId: string, otherId: string) => {
    if(dbSQL != null) {
        dbSQL.transaction(async tx => {
            tx.executeSql(
                'DELETE FROM sessionsSignal WHERE userId = ? AND id = ?;',
                [userId, otherId],
                (_, result) => {
                    return Promise.resolve(result.rowsAffected > 0)
                },
                (_, _error) => {
                    Promise.reject(Errors.ERROR_DELETING_SESSION)
                    return false
                }
            )
        })
    } else {
        Promise.reject(Errors.ERROR_DATABASE_NOT_INITIALIZED)
    }
}

/**
 * Função para apagar todas as sessões
 * @param userId 
 * @returns 
 */
 export const deleteAllSessions = async (userId: string) => {
    if(dbSQL != null) {
        dbSQL.transaction(async tx => {
            tx.executeSql(
                'DELETE FROM table_name WHERE userId = ?;',
                [userId],
                (_, result) => {
                    return Promise.resolve(result.rowsAffected > 0);
                },
                (_, error) => {
                    console.log(error)
                    return false
                }
            )
        })
    }
    return Promise.reject(false)
}