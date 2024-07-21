import { dbSQL } from "."
import { emptyValue } from "../assets/constants/constants"
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

export async function insertCredentialToLocalDB(userId: string, credentialId: string, record: string): Promise<void> {
    console.log("===> insertCredentialCalled")
    return new Promise(async (resolve, reject) => {
        if (dbSQL != null) {
            await dbSQL.runAsync(`INSERT INTO credentials (userId, credentialId, record) VALUES (?, ?, ?);`, [userId, credentialId, record])
                .then(() => { resolve()})
                .catch((error) => {
                    console.log("UserKey " + error.message)
                    reject(new ErrorInstance(Errors.ERROR_CREATING_CREDENTIAL))
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
export async function getCredentialFromLocalDB(userId: string, credentialId: string): Promise<any> {
    //console.log("===> getCredentialCalled")
    return new Promise(async (resolve, reject) => {
        if (dbSQL != null) {
            await dbSQL.getFirstAsync(`SELECT record FROM credentials WHERE userId = ? AND credentialId = ?;`, [userId, credentialId])
                .then((result) => {
                    const credential = result as any
                    if (credential != null) {
                        resolve(credential.record)
                    } else {
                        resolve(emptyValue)
                    }
                })
                .catch((error) => {
                    console.log("Error: " + error.message)
                    reject(Errors.ERROR_RETRIEVING_CREDENTIAL)
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
    return new Promise(async (resolve, reject) => {
        if (dbSQL != null) {
            await dbSQL.runAsync(`DELETE FROM credentials WHERE userId = ? AND credentialId = ?;`, [userId, credentialId])
                .then(() => { resolve() })
                .catch((error) => {
                    console.log("Error: " + error.message)
                    reject(Errors.ERROR_DELETING_CREDENTIAL)
                })
        } else {
            reject(Errors.ERROR_DATABASE_NOT_INITIALIZED)
        }
    })
}

/**
 * Apaga uma credencial do banco de dados.
 */
export async function deleteAllCredentialFromLocalDB(): Promise<void> {
    console.log("===> deleteAllCredential called");
    return new Promise(async (resolve, reject) => {
        if (dbSQL != null) {
            await dbSQL.runAsync(`DELETE FROM credentials;`)
                .then(() => { resolve() })
                .catch((error) => {
                    console.log("Error: " + error.message)
                    reject(Errors.ERROR_DELETING_CREDENTIAL)
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
export async function updateCredentialOnLocalDB(userId: string, credentialId: string, newRecord: string): Promise<void> {
    console.log("===> updateCredentialCalled")
    return new Promise(async (resolve, reject) => {
        if (dbSQL != null) {
            await dbSQL.runAsync(`UPDATE credentials SET record = ? WHERE userId = ? AND credentialId = ?;`, [newRecord, userId, credentialId])
                .then(() => { resolve() })
                .catch((error) => {
                    console.log("Error: " + error.message)
                    reject(Errors.ERROR_UPDATING_CREDENTIAL)
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

export async function getAllCredentialsFromLocalDB(userId: string): Promise<CredentialLocalRecord[]> {
    console.log("===> getAllCredentialsCalled");
    return new Promise(async (resolve, reject) => {
        if (dbSQL != null) {
            await dbSQL.getAllAsync('SELECT credentialId, record FROM credentials WHERE userId = ?;', [userId])
            .then((result) => {
                const credentialsReaded = result as any
                const credentials: CredentialLocalRecord[] = []
                for (let i = 0; i < credentialsReaded.length; i++) {
                    credentials.push(credentialsReaded[i])
                }
                resolve(credentials)
            })
            .catch((error) => {
                console.log("Error: " + error.message)
                reject(Errors.ERROR_RETRIEVING_CREDENTIALS)
            })
        } else {
            reject(Errors.ERROR_DATABASE_NOT_INITIALIZED)
        }
    })
}