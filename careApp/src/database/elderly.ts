import { Alert } from "react-native";
import { dbSQL } from ".";
import { maxElderlyCount } from "../assets/constants/constants";
import { ErrorInstance } from "../exceptions/error";
import { Errors } from "../exceptions/types";
import { Elderly, ElderlyRequestStatus } from "./types";

/**
 * Função para armazenar determinado elderly na base de dados. 
 * @param userId 
 * @param id 
 * @param name 
 * @param email 
 * @param phoneNumber 
 * @param requestStatus 
 * @returns 
 */
export const saveElderly = async (userId: string, elderlyId: string, elderlyName: string, elderlyEmail: string, elderlyphoneNumber: string, requestStatus: ElderlyRequestStatus): Promise<void> => {

    if (requestStatus == ElderlyRequestStatus.WAITING) {
        if(await checkElderlyByEmailWaitingForResponse(userId, elderlyEmail)) {
            return Promise.reject(new ErrorInstance(Errors.ERROR_ELDERLY_REQUEST_ALREADY_SENT))
        } else if (await checkElderlyByEmail(userId, elderlyEmail)) {
            return Promise.reject(new ErrorInstance(Errors.ERROR_ELDERLY_ALREADY_ADDED))
        }
    } 

    return new Promise(async (resolve, reject) => {
        if(dbSQL != null) {
            await dbSQL.runAsync('INSERT INTO elderly (elderlyId, userId, name, email, phoneNumber, status) VALUES (?,?,?,?,?,?);', [elderlyId, userId, elderlyName, elderlyEmail, elderlyphoneNumber, requestStatus])
            .then((result) => {
                if (result.changes > 0) {
                    return resolve()
                } else {
                    return reject(new ErrorInstance(Errors.ERROR_SAVING_SESSION))
                }
            })
            .catch((error) => {
                Alert.alert('Erro', "Unexpected error.")
                return false
            })  
        } else {
            return reject(new ErrorInstance(Errors.ERROR_SAVING_SESSION))
        }
    })
}

/**
 * Função para atualizar o id, o nome e o phone number de determinado idoso
 * @param userId 
 * @param elderlyId Corresponde ao id do idoso na firebase
 * @param email 
 * @param newName 
 * @param newPhoneNumber 
 */
export const updateElderly = async (userId: string, elderlyId: string, elderlyEmail: string, elderlyNewName: string, elderlyNewPhoneNumber: string) => {
    if (dbSQL != null) {
        return await dbSQL.runAsync('UPDATE elderly SET elderlyId = ?, name = ?, phoneNumber = ?, status = ? WHERE email = ? AND userId = ?;',
         [elderlyId, elderlyNewName, elderlyNewPhoneNumber, ElderlyRequestStatus.ACCEPTED, elderlyEmail, userId])
        .then((result) => {
            if (result.changes > 0) {
                console.log('-> Idoso atualizado com sucesso.')
            } else {
                console.log('-> Nenhum idoso foi atualizado. Verifique o email fornecido.')
            }
        })
        .catch((error) => {
            return false
        })
    }
}

/**
 * Função para colocar o estado do idoso como aceite na base de dados. O estado de aceite é basicamente o estado de relação ativa.
 * @param userId 
 * @param emailEmail 
 * @returns 
 */
export const acceptElderlyOnDatabase = async (userId: string, emailEmail: string) => {
    if (dbSQL != null) {
        return await dbSQL.runAsync('UPDATE elderly SET status = ? WHERE email = ? AND userId = ?;', [ElderlyRequestStatus.ACCEPTED, emailEmail, userId])
        .then((result) => {
            if (result.changes > 0) {
                console.log('-> Idoso aceite.')
            } else {
                console.log('-> Idoso não aceite, erro.')
            }
        })
        .catch((error) => {
            return false
        })
    } else {
        return 
    }
}

/**
 * Função para apagar os dados de determinado idoso da base de dados.
 * @param userId 
 * @param emailEmail 
 * @returns 
 */
export const deleteElderly = async (userId: string, elderlyEmail: string): Promise<boolean> => {
    console.log("===> deleteElderlyCalled")
    console.log("userId: "+ userId)
    console.log("elderlyEmail: "+ elderlyEmail)
    if(dbSQL != null) {
        return await dbSQL.runAsync('DELETE FROM elderly WHERE email = ? AND userId = ?;', [elderlyEmail, userId])
        .then((result) => {
            if (result.changes > 0) {
                console.log("-> Idoso apagado da base de dados.")
                return true
            } else {
                console.log('-> Idoso não apagado, verifique o email fornecido.')
                return false
            }
        })
        .catch((error) => {
            console.log('-> Error deleting elderly from database', error)
            return false
        })
    }
    return false
}

/**
 * Função para verificar se foi enviado um pedido para o idoso e se está à espera de um idoso
 * @param userId 
 * @param email 
 * @returns 
 */
export const checkElderlyByEmailWaitingForResponse = async (userId: string, email: string): Promise<boolean> => {
    console.log("===> checkElderlyByEmailWaitingForResponseCalled")
    return new Promise((resolve, reject) => {
        if (dbSQL != null) {
            return dbSQL.getFirstAsync('SELECT COUNT(*) AS count FROM elderly WHERE email = ? AND userId = ? AND status = ?;', [email, userId, ElderlyRequestStatus.WAITING.valueOf()])
            .then((result) => {
                const count = result as any
                return resolve(count.count > 0)
            })
            .catch((error) => {
                console.log("Error: "+ error.message)
                return false
            })
        } else {
            reject(new Error('Database not initialized.')); 
        }
    })
}

/**
 * Retrieves the emails of elderly who received a request from the user.
 * @param userId - The ID of the user.
 * @returns A promise that resolves to an array of caregiver emails.
 */
export const getElderlyWithSpecificState = async (userId: string, state: ElderlyRequestStatus): Promise<string[]> => {
    return new Promise(async (resolve,) => {
        if (dbSQL != null) {
            return await dbSQL.getAllAsync('SELECT email FROM elderly WHERE userId = ? AND status = ?;', [userId, state.valueOf()])
            .then((result) => {
                const elderlyEmails = result as any[]
                const data: string[] = []
                for (let i = 0; i < elderlyEmails.length; i++) {
                    data.push(elderlyEmails[i].email)
                }
                return resolve(data)
            })
            .catch((error) => {
                resolve([])
                console.log("Error: "+ error.message)
            })
        } else {
            resolve([])
        }         
    })
}

/**
 * Função para obter todos os idosos de determinado cuidador
 * @param userId 
 * @returns 
 */
export const getAllElderly = (userId: string): Promise<Elderly[]> => {
    return new Promise(async (resolve, reject) => {

        const data: Elderly[] = [];
        try {
            if (dbSQL != null) {
                return await dbSQL.getAllAsync('SELECT elderlyId, name, email, phoneNumber, status FROM elderly WHERE userId = ?;', [userId])
                .then((result) => {
                    const elderlies = result as any[]
                    for (let i = 0; i < elderlies.length; i++) {                        
                        data.push({
                            elderlyId: elderlies[i].elderlyId,
                            name: elderlies[i].name,
                            email: elderlies[i].email,
                            phoneNumber: elderlies[i].phoneNumber,
                            status: elderlies[i].status
                        });
                    }
                    return resolve(data)
                })
                .catch((error) => {
                    console.log("Error: "+ error.message)
                    return false
                })
            } else {
                Alert.alert('Erro', "Problema ao tentar obter os idosos, tente novamente.")
            }            
        } catch (error) {
            console.log("-> Erro a obter os idosos.")
            reject(error)
        }
    });
};

/**
 * Função para obter a informação de um idoso especifico.
 * @param userId 
 * @param elderlyId 
 * @returns 
 */
export const getElderly = (userId: string, elderlyId: string): Promise<Elderly> => {
    return new Promise((resolve, reject) => {
        try {
            if (dbSQL != null) {
                return dbSQL.getFirstAsync('SELECT elderlyId, name, email, phoneNumber, status FROM elderly WHERE userId = ? AND elderlyId = ?;', [userId, elderlyId])
                .then((result) => {
                    const elderly = result as any
                    return resolve({
                        elderlyId: elderly.elderlyId,
                        name: elderly.name,
                        email: elderly.email,
                        phoneNumber: elderly.phoneNumber,
                        status: elderly.status
                    })
                })
                .catch((error) => {
                    console.log("Error: "+ error.message)
                    return false
                })
            } else {
                alert("Problema ao tentar obter o idoso, tente novamente.")
            }            
        } catch (error) {
            console.log("-> Erro a obter o idoso.")
            reject(error)
        }
    })
}

export const checkElderlyByEmail = async (userId: string, email: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        if (dbSQL != null) {
            dbSQL.getFirstAsync('SELECT COUNT(*) AS count FROM elderly WHERE email = ? AND userId = ? AND status = ?;', [email, userId, ElderlyRequestStatus.ACCEPTED])
            .then((result) => {
                const count = result as any
                return resolve(count.count > 0)
            })
            .catch((error) => {
                console.log("Error: "+ error.message)
                return false
            })
        } else {
            reject(new Error('Database not initialized.')); 
        }
    })
}

export const isMaxElderlyReached = async (userId: string): Promise<boolean> => {
    console.log("===> isMaxCaregiversReachedCalled")
    return new Promise(async (resolve, reject) => {
        if (dbSQL != null) {
            await dbSQL.getFirstAsync('SELECT COUNT(*) AS count FROM elderly WHERE userId = ? AND status = ?;', [userId, ElderlyRequestStatus.ACCEPTED])
            .then((result) => {
                const count = result as any
                return resolve(count.count >= maxElderlyCount)
            })
            .catch((error) => {
                console.log("Error: "+ error.message)
                return false
            })
        } else {
            reject(new Error('Database not initialized.'))
        }
    })
}

/**
 * Retrieves the elderly ID based on the elderly's email and user ID.
 * @param elderlyEmail - The email of the elderly.
 * @param userId - The ID of the user.
 * @returns A Promise that resolves to the caregiver ID.
 */
export async function getElderlyId(elderlyEmail: string, userId: string): Promise<string> {
    console.log("===> getElderlyIdCalled")
    return new Promise(async (resolve, reject) => {
        if (dbSQL != null) {
            await dbSQL.getFirstAsync('SELECT elderlyId FROM elderly WHERE email = ? AND userId = ?;', [elderlyEmail, userId])
            .then((result) => {
                const elderly = result as any
                return resolve(elderly.elderlyId)
            })
            .catch((error) => {
                console.log("Error: "+ error.message)
                return false
            })
        } else {
            reject(new ErrorInstance(Errors.ERROR_DATABASE_NOT_INITIALIZED))
        }
    })
}