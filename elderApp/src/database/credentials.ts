import { dbSQL } from "."
import { ErrorInstance } from "../exceptions/error"
import { Errors } from "../exceptions/types"

/**
 * Insere uma credencial no banco de dados
 * 
 * @param userId - O ID do utilizador
 * @param credentialId - O ID da credencial
 * @param record - Os dados associados à credencial
 * @param updatedBy - O usuário que atualizou a credencial
 * @param updatedAt - O timestamp da atualização da credencial
 * @returns Uma Promise que é resolvida quando a credencial é inserida com sucesso, ou rejeitada com um erro se a inserção falhar
 */

//TODO: chamado quando a inserção é bem sucedida na cloud.
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
 * Obtém uma credencial do banco de dados.
 * 
 * @param userId - O ID do utilizador.
 * @param credentialId - O ID da credencial.
 * @returns Uma Promise que é resolvida com os dados da credencial se for encontrada, ou rejeitada com um erro se a busca falhar.
 */
export async function getCredential(userId: string, credentialId: string): Promise<any> {
    console.log("===> getCredentialCalled")
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
    //return Promise.resolve()
}

/**
 * Apaga uma credencial do banco de dados.
 * 
 * @param userId - O ID do utilizador.
 * @param credentialId - O ID da credencial.
 * @returns Uma Promise que é resolvida quando a credencial é deletada com sucesso, ou rejeitada com um erro se a deleção falhar.
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
 * Atualiza uma credencial no banco de dados.
 * 
 * @param userId - O ID do utilizador.
 * @param credentialId - O ID da credencial.
 * @param newRecord - Os novos dados associados à credencial.
 * @param updatedBy - O usuário que atualizou a credencial.
 * @param updatedAt - O timestamp da atualização da credencial.
 * @returns Uma Promise que é resolvida quando a credencial é atualizada com sucesso, ou rejeitada com um erro se a atualização falhar.
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
/**
 * Obtém todas as credenciais de um determinado usuário.
 * 
 * @param userId - O ID do usuário.
 * @returns Uma Promise que é resolvida com um array contendo todas as credenciais do usuário, ou rejeitada com um erro se a busca falhar.
 */


export interface CredentialLocalRecord {
    credentialId: string;
    record: string;
}

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