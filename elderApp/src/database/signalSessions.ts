import { dbSQL } from ".";
import { decrypt, encrypt } from "../algorithms/tweetNacl/crypto";
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
export const saveSignalSession = async (userId: string, otherId: string, record: string) => {
    console.log("===> saveSignalSessionCalled")

    if(dbSQL != null) {
        await dbSQL.getAllAsync('SELECT caregiverId FROM sessionsSignal WHERE caregiverId = ? AND userId = ?', [otherId, userId])
            .then(async (result) => {
                if (result.length > 0) {
                    console.log("Session exists")
                    // Row with given id and userId exists, perform UPDATE
                    if (dbSQL != null) {
                        await dbSQL.runAsync('UPDATE sessionsSignal SET record = ? WHERE caregiverId = ? AND userId = ?', [record, otherId, userId])
                            .then(() => {
                                return Promise.resolve()
                            })
                            .catch(() => {
                                Promise.reject(Errors.ERROR_UPDATING_SESSION)
                                return false
                            })
                    } else {
                        Promise.reject(Errors.ERROR_DATABASE_NOT_INITIALIZED)
                    }
                } else {
                    console.log("Session not exists")
                    if (dbSQL != null) {
                        console.log("===> saveSignalSessionCalled")
                        console.log("OtherId: ", otherId)
                        // Row with given id and userId does not exist, perform INSERT
                        await dbSQL.runAsync('INSERT INTO sessionsSignal (caregiverId, userId, record) VALUES (?,?,?)', [otherId, userId, record])
                        .then(() => {
                            console.log('- Sessão salva com sucesso.')
                            return Promise.resolve()
                        })
                        .catch(() => {
                            Promise.reject(Errors.ERROR_CREATING_SESSION)
                            return false
                        })
                    } else {
                        Promise.reject(Errors.ERROR_DATABASE_NOT_INITIALIZED)
                    }
                }
            })
            .catch((error) => {
                Promise.reject(Errors.ERROR_RETRIEVING_SESSION)
                return false
            })
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
export const getSession = async (otherId: string, userId: string, localDBKey: string): Promise<SessionSignal | undefined> => {
    console.log("===> getSessionCalled")

    return new Promise(async (resolve, reject) => {
        if(dbSQL != null) {
            await dbSQL.getAllAsync('SELECT record FROM sessionsSignal WHERE caregiverId = ? AND userId = ?', [otherId, userId])
                .then(async (result) => { 
                    if (result.length > 0) {
                        const record = (result[0] as any).record
                        resolve({ record: decrypt(record, localDBKey) })
                    } else {
                        resolve(undefined)
                    }
                })
                .catch((error) => {
                    console.log("AHHHHH")
                    console.log("Error: " + error)
                    reject(Errors.ERROR_RETRIEVING_SESSION)
                    return false
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
    console.log("===> deleteSessionByIdCalled")
    
    const otherIdAux = 'session'+otherId+'.1'
    if(dbSQL != null) {
        return await dbSQL.runAsync('DELETE FROM sessionsSignal WHERE userId = ? AND caregiverId = ?', [userId, otherIdAux])
            .then(async (result) => {
                return Promise.resolve(result.changes > 0)
            })
            .catch(() => {
                Promise.reject(Errors.ERROR_DELETING_SESSION)
                return false
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
        return await dbSQL.runAsync('DELETE FROM sessionsSignal WHERE userId = ?', [userId])
            .then((result) => {
                return Promise.resolve(result.changes > 0)
            })
            .catch(() => {
                Promise.reject(Errors.ERROR_DELETING_SESSION)
                return false
            })
    } else {
        Promise.reject(Errors.ERROR_DATABASE_NOT_INITIALIZED)
    }
}