import { dbSQL } from "."
import { ErrorInstance } from "../exceptions/error"
import { Errors } from "../exceptions/types"


//TODO: chamado quando a inserção é bem sucedida na cloud.
/**
 * Inserts a credential into the local database.
 * 
 * @param userId - The ID of the user.
 * @param credentialId - The ID of the credential.
 * @param record - The record to be inserted.
 * @returns A Promise that resolves when the credential is successfully inserted, or rejects with an error.
 */
export async function insertCredentialToLocalDB(userId: string, credentialId: string, record: string): Promise<void> {
    console.log("===> insertCredentialCalled")
    return new Promise((resolve, reject) => {
        if (dbSQL != null) {
            dbSQL.transaction(tx => {
                tx.executeSql(
                    'INSERT INTO credentials (userId, credentialId, record) VALUES (?, ?, ?);',
                    [userId, credentialId, record],
                    (_, result) => {
                        resolve()
                    },
                    (_, error) => {
                        console.log("Error: "+ error.message)
                        reject(new ErrorInstance(Errors.ERROR_CREATING_CREDENTIAL))
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
 * Retrieves a credential from the database for a given user and credential ID.
 * @param userId - The ID of the user.
 * @param credentialId - The ID of the credential.
 * @returns A Promise that resolves with the retrieved credential record.
 * @throws {Errors.ERROR_RETRIEVING_CREDENTIAL} If there was an error retrieving the credential.
 * @throws {Errors.ERROR_DATABASE_NOT_INITIALIZED} If the database is not initialized.
 */
export async function getCredential(userId: string, credentialId: string): Promise<any> {
    //console.log("===> getCredentialCalled")
    return new Promise((resolve, reject) => {
        if (dbSQL != null) {
            dbSQL.transaction(tx => {
                tx.executeSql(
                    'SELECT record FROM credentials WHERE userId = ? AND credentialId = ?;',
                    [userId, credentialId],
                    (_, result) => {
                        if (result.rows.length > 0) {
                            resolve(result.rows.item(0).record)
                        } else {
                            resolve('')
                        }
                    },
                    (_, error) => {
                        console.log("Error: "+ error.message)
                        reject(Errors.ERROR_RETRIEVING_CREDENTIAL)
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
 * Deletes a credential from the database.
 * 
 * @param userId - The ID of the user.
 * @param credentialId - The ID of the credential.
 * @returns A Promise that resolves when the credential is successfully deleted, or rejects with an error.
 */
export async function deleteCredentialFromLocalDB(userId: string, credentialId: string): Promise<void> {
    console.log("===> deleteCredential called");
    return new Promise((resolve, reject) => {
        if (dbSQL != null) {
            dbSQL.transaction(tx => {
                tx.executeSql(
                    'DELETE FROM credentials WHERE userId = ? AND credentialId = ?;',
                    [userId, credentialId],
                    (_, result) => {
                        console.log("Affected: "+ result.rowsAffected)
                        resolve()
                    },
                    (_, error) => {
                        console.log("Error: "+ error.message)
                        reject(Errors.ERROR_DELETING_CREDENTIAL)
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
 * Updates a credential in the local database.
 * 
 * @param userId - The ID of the user.
 * @param credentialId - The ID of the credential.
 * @param newRecord - The new record to be updated.
 * @returns A Promise that resolves when the credential is successfully updated, or rejects with an error.
 */
export async function updateCredentialFromLocalDB(userId: string, credentialId: string, newRecord: string): Promise<void> {
    console.log("===> updateCredentialCalled")
    return new Promise((resolve, reject) => {
        if (dbSQL != null) {
            dbSQL.transaction(tx => {
                tx.executeSql(
                    'UPDATE credentials SET record = ? WHERE userId = ? AND credentialId = ?;',
                    [newRecord, userId, credentialId],
                    (_, result) => {
                        resolve()
                    },
                    (_, error) => {
                        reject(Errors.ERROR_UPDATING_CREDENTIAL)
                        return false
                    }
                )
            })
        } else {
            reject(Errors.ERROR_DATABASE_NOT_INITIALIZED)
        }
    })
}

export interface CredentialLocalRecord {
    credentialId: string;
    record: string;
}

/**
 * Retrieves all credentials from the local database for a given user.
 * 
 * @param userId - The ID of the user.
 * @returns A Promise that resolves with an array of all credential records.
 */
export async function getAllLocalCredentials(userId: string): Promise<CredentialLocalRecord[]> {
    console.log("===> getAllCredentialsCalled");
    return new Promise((resolve, reject) => {
        if (dbSQL != null) {
            dbSQL.transaction(tx => {
                tx.executeSql(
                    'SELECT credentialId, record FROM credentials WHERE userId = ?;',
                    [userId],
                    (_, result) => {
                        const credentials: CredentialLocalRecord[] = [];
                        for (let i = 0; i < result.rows.length; i++) {
                            credentials.push(result.rows.item(i));
                        }
                        resolve(credentials);
                    },
                    (_, error) => {
                        console.log("Error: "+ error.message)
                        reject(Errors.ERROR_RETRIEVING_CREDENTIALS)
                        return false
                    }
                )
            })
        } else {
            reject(Errors.ERROR_DATABASE_NOT_INITIALIZED)
        }
    })
}