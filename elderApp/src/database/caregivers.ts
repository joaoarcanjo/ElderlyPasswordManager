import { dbSQL } from ".";
import { maxCaregiversCount } from "../assets/constants/constants";
import { ErrorInstance } from "../exceptions/error";
import { Errors } from "../exceptions/types";
import { Caregiver, CaregiverRequestStatus } from "./types";

/**
 * Saves a caregiver to the database.
 * @param userId - The ID of the user.
 * @param caregiverId - The ID of the caregiver.
 * @param name - The name of the caregiver.
 * @param email - The email of the caregiver.
 * @param phoneNumber - The phone number of the caregiver.
 * @param requestStatus - The request status of the caregiver.
 * @returns A Promise that resolves when the caregiver is successfully saved, or rejects with an error.
 */
export const saveCaregiver = async (userId: string, caregiverId: string, name: string, email: string, phoneNumber: string, requestStatus: CaregiverRequestStatus): Promise<void> => {
    console.log("===> saveCaregiverCalled")
    const aux = await checkCaregiverByEmailNotAccepted(userId, email)
    if (requestStatus == CaregiverRequestStatus.WAITING) {
        if(await checkCaregiverByEmailNotAccepted(userId, email)) {
            return Promise.reject(new ErrorInstance(Errors.ERROR_CAREGIVER_REQUEST_ALREADY_SENT))
        } else if (await checkCaregiverByEmail(userId, email)) {
            return Promise.reject(new ErrorInstance(Errors.ERROR_CAREGIVER_ALREADY_ADDED))
        }
    }

    return new Promise(async (resolve, reject) => {
        if (dbSQL != null) {
            await dbSQL.runAsync('INSERT INTO caregivers (caregiverId, userId, name, email, phoneNumber, status) VALUES (?,?,?,?,?,?)', [caregiverId, userId, name, email, phoneNumber, requestStatus.valueOf()])
                .then((result) => {
                    if(result.changes > 0) {
                        console.log('- Cuidador armazenado com sucesso.')
                        return resolve()
                    } else {
                        console.log('- Cuidador não armazenado.')
                        return reject(new ErrorInstance(Errors.ERROR_SAVING_SESSION))
                    }
                })
                .catch(() => {
                    return reject(new ErrorInstance(Errors.ERROR_SAVING_SESSION))
                })
        } else {
            return reject(new ErrorInstance(Errors.ERROR_SAVING_SESSION))
        }
    })
}


/**
 * Updates a caregiver in the database.
 * @param caregiverId - The ID of the caregiver to update.
 * @param userId - The ID of the user associated with the caregiver.
 * @param email - The email of the caregiver.
 * @param newName - The new name of the caregiver.
 * @param newPhoneNumber - The new phone number of the caregiver.
 * @returns A Promise that resolves when the caregiver is updated successfully, or rejects with an error if the update fails.
 */
export const updateCaregiver = async (caregiverId: string, userId: string, email: string, newName: string, newPhoneNumber: string) => {
    console.log("===> updateCaregiverCalled")
    if (dbSQL != null) {
        return await dbSQL.runAsync('UPDATE caregivers SET caregiverId = ?, name = ?, phoneNumber = ?, status = ? WHERE email = ? AND userId = ?'
        , [caregiverId, newName, newPhoneNumber, CaregiverRequestStatus.ACCEPTED.valueOf(), email, userId])
            .then(async (result) => {
                if(result.changes) {
                    console.log('--- Cuidador atualizado com sucesso.')
                    return Promise.resolve()
                } else {
                    console.log('--- Nenhum cuidador foi atualizado. Verifique o email fornecido.')
                    return Promise.reject(new ErrorInstance(Errors.ERROR_UPDATING_CAREGIVER))
                }
            })
            .catch(() => {
                return Promise.reject(new ErrorInstance(Errors.ERROR_UPDATING_CAREGIVER))
            })
    }
}

/**
 * Deletes a caregiver from the database.
 * 
 * @param userId - The ID of the user.
 * @param email - The email of the caregiver to delete.
 * @returns A Promise that resolves with void if the caregiver is deleted successfully, or rejects with an error if there was a problem deleting the caregiver.
 */
export const deleteCaregiver = async (userId: string, email: string): Promise<void> => {
    console.log("===> deleteCaregiverCalled")
    if (dbSQL != null) {
        return await dbSQL.runAsync('DELETE FROM caregivers WHERE email = ? AND userId = ?', [email, userId])
            .then((result) => {
                if(result.changes) {
                    console.log('--- Cuidador apagado com sucesso.')
                    return Promise.resolve()
                } else {
                    console.log('--- Cuidador não apagado, erro.')
                    return Promise.reject(new ErrorInstance(Errors.ERROR_DELETING_CAREGIVER))
                }
            })
            .catch(() => {
                return Promise.reject(new ErrorInstance(Errors.ERROR_DELETING_CAREGIVER))
            })
    } else {
        return Promise.reject(new ErrorInstance(Errors.ERROR_DATABASE_NOT_INITIALIZED))
    }
}

/**
 * Checks if a caregiver with the specified email exists for a given user ID.
 * @param userId - The ID of the user.
 * @param email - The email of the caregiver.
 * @returns A promise that resolves to a boolean indicating whether the caregiver exists or not.
 */
export const checkCaregiverByEmailAccepted = async (userId: string, email: string): Promise<boolean> => {
    return new Promise(async (resolve,) => {
        if (dbSQL != null) {
            await dbSQL.getFirstAsync('SELECT COUNT(*) AS count FROM caregivers WHERE email = ? AND userId = ? AND status = ?', [email, userId, CaregiverRequestStatus.ACCEPTED])
                .then((result) => {
                    const count = result as any 
                    return resolve(count.count > 0)
                })
                .catch(() => {
                    return false
                })
        } else {
            return false
        }
    })
}

/**
 * Checks the number of caregivers associated with a user.
 * 
 * @param userId - The ID of the user.
 * @returns A promise that resolves to the number of caregivers.
 */
export const checkNumberOfCaregivers = async (userId: string): Promise<number> => {
    console.log("===> checkNumberOfCaregiversCalled")
    return new Promise(async (resolve,) => {
        if (dbSQL != null) {
            await dbSQL.getFirstAsync('SELECT COUNT(*) AS count FROM caregivers WHERE userId = ? AND status = ?', [userId, CaregiverRequestStatus.ACCEPTED])
                .then((result) => {
                    const count = result as any
                    return resolve(count.count)
                })
                .catch(() => {
                    return false
                })
        } else {
            return false
        }
    })
}

/**
 * Checks if the elderly is waiting for the caregiver to accept the request.
 * @param userId - The ID of the user.
 * @param email - The email of the caregiver.
 * @returns A Promise that resolves to a boolean indicating whether the caregiver is not accepted.
 */
export const checkCaregiverByEmailNotAccepted = async (userId: string, email: string): Promise<boolean> => {
    console.log("===> checkCaregiverByEmailNotAccepted")
    return new Promise(async (resolve,) => {
        if (dbSQL != null) {
            await dbSQL.getFirstAsync('SELECT COUNT(*) AS count FROM caregivers WHERE email = ? AND userId = ? AND status = ?', [email, userId, CaregiverRequestStatus.WAITING])
                .then((result) => {
                    const count = result as any
                    return resolve(count.count > 0)
                })
                .catch((error) => {
                    console.log("Error 11: "+ error.message)
                    return false
                })
        } else {
            return false
        }
    })
}

/**
 * Retrieves the emails of caregivers who received a request from the user.
 * @param userId - The ID of the user.
 * @returns A promise that resolves to an array of caregiver emails.
 */
export const getCaregiversWithSpecificState = async (userId: string, state: CaregiverRequestStatus): Promise<string[]> => {
    return new Promise(async (resolve,) => {
        if (dbSQL != null) {
            await dbSQL.getAllAsync('SELECT email FROM caregivers WHERE userId = ? AND status = ?', [userId, state])
                .then((result) => {
                    const caregivers = result as any
                    const data: string[] = [];
                    for (let i = 0; i < caregivers.length; i++) {
                        data.push(caregivers[i].email)
                    }
                    return resolve(data)
                })
                .catch(() => {
                    resolve([])
                    return false
                })
        } else {
            resolve([])
        }         
    })
}

/**
 * Updates the status of a caregiver in the database.
 * 
 * @param userId - The ID of the user associated with the caregiver.
 * @param email - The email of the caregiver.
 * @param status - The new status of the caregiver.
 */
export const changeCaregiverStatusOnDatabase = async (userId: string, email: string, status: CaregiverRequestStatus) => {
    if (dbSQL != null) {
        return await dbSQL.runAsync('UPDATE caregivers SET status = ? WHERE email = ? AND userId = ?', [status, email, userId])
            .then((result) => {
                if(result.changes) {
                    console.log('--- Cuidador aceite.')
                    return Promise.resolve()
                } else {
                    console.log('--- Cuidador não aceite, erro.')
                    return Promise.reject(new ErrorInstance(Errors.ERROR_UPDATING_CAREGIVER))
                }
            })
            .catch(() => {
                return Promise.reject(new ErrorInstance(Errors.ERROR_UPDATING_CAREGIVER))
            })
    }
}

/**
 * Retrieves the caregivers associated with a user.
 * @param userId - The ID of the user.
 * @returns A promise that resolves to an array of caregivers.
 */
export const getCaregivers = (userId: string): Promise<Caregiver[]> => {
    console.log("===> getCaregiversCalled")
    return new Promise((resolve,) => {
        const data: Caregiver[] = [];
        try {
            if(dbSQL != null) {
                dbSQL.getAllAsync('SELECT caregiverId, name, email, phoneNumber, status FROM caregivers WHERE userId = ?', [userId])
                    .then((result) => {
                        const caregivers = result as any
                        for (let i = 0; i < caregivers.length; i++) {
                            data.push({
                                caregiverId  : caregivers[i].caregiverId,
                                name         : caregivers[i].name,
                                email        : caregivers[i].email,
                                phoneNumber  : caregivers[i].phoneNumber,
                                requestStatus: caregivers[i].status
                            });
                        }
                        resolve(data)
                    })
                    .catch(() => {
                        resolve([])
                        return false
                    })
            } else {
                throw (new Error("Database is not connected."))
            }
        } catch (error) {
            console.log("-> Erro a obter os cuidadores.")
            resolve([])
        }
    })
}

/**
 * Retrieves the caregiver ID based on the caregiver's email and user ID.
 * @param caregiverEmail - The email of the caregiver.
 * @param userId - The ID of the user.
 * @returns A Promise that resolves to the caregiver ID.
 */
export async function getCaregiverId(caregiverEmail: string, userId: string): Promise<string> {
    console.log("===> getCaregiverIdCalled")
    return new Promise(async (resolve, reject) => {
        if (dbSQL != null) {
            await dbSQL.getFirstAsync('SELECT caregiverId FROM caregivers WHERE email = ? AND userId = ?', [caregiverEmail, userId])
                .then((result) => {
                    const aux = result as any
                    return resolve(aux.caregiverId)
                })
                .catch(() => {
                    return false
                })
        } else {
            reject(new ErrorInstance(Errors.ERROR_DATABASE_NOT_INITIALIZED))
        }
    })
}

/**
 * Checks if the maximum number of caregivers has been reached for a user.
 * @param userId - The ID of the user.
 * @returns A promise that resolves to a boolean indicating whether the maximum number of caregivers has been reached.
 */
export const isMaxCaregiversReached = async (userId: string): Promise<boolean> => {
    console.log("===> isMaxCaregiversReachedCalled")
    return new Promise(async (resolve, reject) => {
        if (dbSQL != null) {
            await dbSQL.getFirstAsync('SELECT COUNT(*) AS count FROM caregivers WHERE userId = ? AND status = ?', [userId, CaregiverRequestStatus.ACCEPTED])
                .then((result) => {
                    const count = result as any
                    resolve(count.count >= maxCaregiversCount)
                })
                .catch(() => {
                    return false
                })
        } else {
            reject(new ErrorInstance(Errors.ERROR_DATABASE_NOT_INITIALIZED))
        }
    })
}

/**
 * Checks if a caregiver with the given email exists for a specific user.
 * @param userId - The ID of the user.
 * @param email - The email of the caregiver.
 * @returns A Promise that resolves to a boolean indicating whether the caregiver exists or not.
 */
export const checkCaregiverByEmail = async (userId: string, email: string): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
        if (dbSQL != null) {
            await dbSQL.getFirstAsync('SELECT COUNT(*) AS count FROM caregivers WHERE email = ? AND userId = ? AND status = ?', [email, userId, CaregiverRequestStatus.ACCEPTED])
                .then((result) => {
                    const count = result as any
                    return resolve(count.count > 0)
                })
                .catch(() => {
                    return false
                })
        } else {
            reject(new Error('Database not initialized.'))
        }
    })
}