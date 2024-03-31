import { dbSQL } from ".";
import { maxCaregiversCount } from "../assets/constants";
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
    if (requestStatus == CaregiverRequestStatus.WAITING && aux) {
        return Promise.reject(new ErrorInstance(Errors.ERROR_CAREGIVER_ALREADY_ADDED))
    }

    return new Promise((resolve, reject) => {
        if (dbSQL != null) {
            dbSQL.transaction(async tx => {
                tx.executeSql(
                    'INSERT INTO caregivers (caregiverId, userId, name, email, phoneNumber, status) VALUES (?,?,?,?,?,?)',
                    [caregiverId, userId, name, email, phoneNumber, requestStatus.valueOf()],
                    (_, result) => {
                        if (result.rowsAffected > 0) {
                            console.log('- Cuidador armazenado com sucesso.')
                            return resolve()
                        } else {
                            console.log('- Cuidador não armazenado.')
                            return reject(new ErrorInstance(Errors.ERROR_SAVING_SESSION))
                        }
                    },
                    (_, _error) => {
                        return false
                    }
                )
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
        return dbSQL.transaction(tx => {
            tx.executeSql(
                'UPDATE caregivers SET caregiverId = ?, name = ?, phoneNumber = ?, status = ? WHERE email = ? AND userId = ?',
                [caregiverId, newName, newPhoneNumber, CaregiverRequestStatus.ACCEPTED.valueOf(), email, userId],
                (_, result) => {
                      // Verifique se houve alguma linha afetada para confirmar se a atualização foi bem-sucedida.
                    if (result.rowsAffected > 0) {
                        console.log('--- Cuidador atualizado com sucesso.')
                    } else {
                        console.log('--- Nenhum cuidador foi atualizado. Verifique o email fornecido.')
                        Promise.reject(new ErrorInstance(Errors.ERROR_UPDATING_CAREGIVER))
                    }
                },
                (_, _error) => {
                    Promise.reject(new ErrorInstance(Errors.ERROR_UPDATING_CAREGIVER))
                    return false
                }
            )
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
        return dbSQL.transaction(tx => {
            tx.executeSql(
                'DELETE FROM caregivers WHERE email = ? AND userId = ?;',
                [email, userId],
                (_, result) => {
                    if (result.rowsAffected > 0) {
                        console.log('--- Cuidador apagado com sucesso.');
                        return Promise.resolve()
                    }
                    return Promise.resolve()
                },
                (error) => {
                    console.log('-> Error deleting caregiver from database', error)
                    Promise.reject(new ErrorInstance(Errors.ERROR_DELETING_CAREGIVER))
                    return false
                }
            )
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
export const checkCaregiverByEmail = async (userId: string, email: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        if (dbSQL != null) {
            dbSQL.transaction(tx => {
                tx.executeSql(
                    'SELECT COUNT(*) AS count FROM caregivers WHERE email = ? AND userId = ? AND status = ?',
                    [email, userId, CaregiverRequestStatus.ACCEPTED.valueOf()],
                    (_, result) => {
                        const count = result.rows.item(0).count;
                        resolve(count > 0); 
                    },
                    (_, _error) => {
                     return false
                    }
                )
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
    return new Promise((resolve, reject) => {
        if (dbSQL != null) {
            dbSQL.transaction(tx => {
                tx.executeSql(
                    'SELECT COUNT(*) AS count FROM caregivers WHERE userId = ? AND status = ?',
                    [userId, CaregiverRequestStatus.ACCEPTED.valueOf()],
                    (_, result) => {
                        resolve(result.rows.item(0).count); 
                    },
                    (_, _error) => {
                     return false
                    }
                )
            })
        } else {
            return false
        }
    })
}

/**
 * Checks if a caregiver with the given email is not accepted for the specified user.
 * @param userId - The ID of the user.
 * @param email - The email of the caregiver.
 * @returns A Promise that resolves to a boolean indicating whether the caregiver is not accepted.
 */
export const checkCaregiverByEmailNotAccepted = async (userId: string, email: string): Promise<boolean> => {
    console.log("===> checkCaregiverByEmailNotAccepted")
    return new Promise((resolve, reject) => {
        if (dbSQL != null) {
            dbSQL.transaction(tx => {
                tx.executeSql(
                    'SELECT COUNT(*) AS count FROM caregivers WHERE email = ? AND userId = ? AND status = ?;',
                    [email, userId, CaregiverRequestStatus.WAITING.valueOf()],
                    (_, result) => {
                        const count = result.rows.item(0).count;
                        return resolve(count > 0); 
                    },
                    (_, error) => {
                        console.log("Error: "+ error.message)
                        return false
                    }
                )
            })
        } else {
            return false
        }
    })
}

/**
 * Retrieves the emails of caregivers who are waiting for a response from a specific user.
 * @param userId - The ID of the user.
 * @returns A promise that resolves to an array of caregiver emails.
 */
export const getCaregiverWaitingForResponse = async (userId: string): Promise<string[]> => {
    return new Promise((resolve, reject) => {
        if (dbSQL != null) {
            dbSQL.transaction((tx) => {
                tx.executeSql('SELECT email FROM caregivers WHERE userId = ? AND status = ?;', 
                [userId, CaregiverRequestStatus.RECEIVED.valueOf()], 
                (_tx, results) => {
                    const data: string[] = [];
                    for (let i = 0; i < results.rows.length; i++) {
                        data.push(results.rows.item(i).email)
                    }
                    return resolve(data)
                },
                (_, _error) => {
                    resolve([])
                    return false
                }
                )
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
        dbSQL.transaction(tx => {
            tx.executeSql(
                'UPDATE caregivers SET status = ? WHERE email = ? AND userId = ?',
                [status, email, userId],
                (_, result) => {
                    // Verifique se houve alguma linha afetada para confirmar se a atualização foi bem-sucedida.
                    if (result.rowsAffected > 0) {
                        //console.log('--- Cuidador aceite.')
                    } else {
                        console.log('--- Cuidador não aceite, erro.')
                    }
                }
            )
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
    return new Promise((resolve, reject) => {
        const data: Caregiver[] = [];
        try {
            if(dbSQL != null) {
                dbSQL.transaction((tx) => {
                    tx.executeSql('SELECT caregiverId, name, email, phoneNumber, status FROM caregivers WHERE userId = ?', 
                    [userId], (_tx, results) => {
                        for (let i = 0; i < results.rows.length; i++) { 
                            data.push({
                                caregiverId  : results.rows.item(i).caregiverId,
                                name         : results.rows.item(i).name,
                                email        : results.rows.item(i).email,
                                phoneNumber  : results.rows.item(i).phoneNumber,
                                requestStatus: results.rows.item(i).status
                            });
                        }
                        resolve(data)
                        },
                        (_, error) => {
                            console.log("Error: "+ error.message)
                            resolve([])
                            return false
                        }
                    )
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
    return new Promise((resolve, reject) => {
        if (dbSQL != null) {
            dbSQL.transaction(tx => {
                tx.executeSql(
                    'SELECT caregiverId FROM caregivers WHERE email = ? AND userId = ?;',
                    [caregiverEmail, userId],
                    (_, result) => {
                        return resolve(result.rows.item(0).caregiverId);
                    },
                    (_, error) => {
                        console.log("Error: "+ error.message)
                        return false
                    }
                )
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
    return new Promise((resolve, reject) => {
        if (dbSQL != null) {
            dbSQL.transaction(tx => {
                tx.executeSql(
                    'SELECT COUNT(*) AS count FROM caregivers WHERE userId = ? AND status = ?;',
                    [userId, CaregiverRequestStatus.ACCEPTED.valueOf()],
                    (_, result) => {
                        const count = result.rows.item(0).count
                        resolve(count >= maxCaregiversCount)
                    },
                    (_, _error) => {
                        return false
                    }
                )
            })
        } else {
            reject(new ErrorInstance(Errors.ERROR_DATABASE_NOT_INITIALIZED))
        }
    })
}
