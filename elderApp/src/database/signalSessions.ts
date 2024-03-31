import { dbSQL } from ".";
import { decrypt, encrypt } from "../algorithms/0thers/crypto";
import { Errors } from "../exceptions/types";
import { SessionSignal } from "./types";

/**
 * Saves the signal sessions to the database.
 * 
 * @param userId - The ID of the user.
 * @param otherId - The ID of the other user.
 * @param record - The record to be saved.
 * @param localDBKey - The key used for encryption.
 * @returns A promise that resolves when the sessions are saved successfully, or rejects with an error.
 * @throws {Errors.ERROR_DELETING_SESSION} If there is an error updating the session.
 * @throws {Errors.ERROR_CREATING_SESSION} If there is an error creating the session.
 * @throws {Errors.ERROR_RETRIEVING_SESSION} If there is an error retrieving the session.
 */
export const saveSignalSessions = async (userId: string, otherId: string, record: string, localDBKey: string) => {
    const encrypted = encrypt(record, localDBKey)

    if(dbSQL != null) {
        return dbSQL.transaction(async tx => {
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
                                return Promise.resolve()
                            },
                            (_, _error) => {
                                Promise.reject(Errors.ERROR_DELETING_SESSION)
                                return false
                            }
                        )
                    } else {
                        // No row with given id and userId exists, perform INSERT
                        tx.executeSql(
                            'INSERT INTO sessionsSignal (id, userId, record) VALUES (?,?,?)',
                            [otherId, userId, encrypted],
                            () => {
                                console.log('- Sessão salva com sucesso.')
                                return Promise.resolve();
                            },
                            (_, _error) => {
                                Promise.reject(Errors.ERROR_CREATING_SESSION)
                                return false
                            }
                        )
                    }
                },
                (_, _error) => {
                    Promise.reject(Errors.ERROR_RETRIEVING_SESSION)
                    return false
                }
            );
        });
    } else {
        Promise.reject(Errors.ERROR_DATABASE_NOT_INITIALIZED)
    }
}

/**
 * Retrieves a session by its ID and user ID from the database.
 * @param otherId - The ID of the other user in the session.
 * @param userId - The ID of the current user.
 * @param localDBKey - The encryption key for the local database.
 * @returns A promise that resolves to the session signal object if found, or undefined if not found.
 * @throws {Errors.ERROR_RETRIEVING_SESSION} If there was an error retrieving the session.
 * @throws {Errors.ERROR_DATABASE_NOT_INITIALIZED} If the database is not initialized.
 */
export const getSessionById = async (otherId: string, userId: string, localDBKey: string): Promise<SessionSignal | undefined> => {
    console.log("===> getSessionByIdCalled")
    return new Promise((resolve, reject) => {
        if(dbSQL != null) {
            dbSQL.transaction(async tx => {
                tx.executeSql(
                    'SELECT (record) FROM sessionsSignal WHERE id = ? AND userId = ?',
                    [otherId, userId],
                    (_, result) => {
                        if (result.rows.length > 0) {
                            resolve({
                                record: decrypt(result.rows.item(0).record, localDBKey),
                            })
                        } else {
                            reject(Errors.ERROR_RETRIEVING_SESSION)
                        }
                    },
                    (_, _error) => {
                        reject(Errors.ERROR_RETRIEVING_SESSION)
                        return false
                    }
                )
            })
        } else {
            reject(Errors.ERROR_DATABASE_NOT_INITIALIZED)
        }
    })
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
 * Deletes all sessions associated with a given user ID from the database.
 * @param userId - The ID of the user.
 * @returns A promise that resolves to a boolean indicating whether the deletion was successful.
 * @throws {Errors.ERROR_DELETING_SESSION} If there was an issue deleting the sessions or if the database is not initialized.
 */
 export const deleteAllSessions = async (userId: string) => {
    if(dbSQL != null) {
        dbSQL.transaction(async tx => {
            tx.executeSql(
                'DELETE FROM table_name WHERE userId = ?',
                [userId],
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