import { dbSQL } from ".";
import { ErrorInstance } from "../exceptions/error";
import { Errors } from "../exceptions/types";
import { Caregiver, CaregiverRequestStatus } from "./types";

  /**
   * Função para armazenar a informação relativamente a determinado cuidador.
   * @param userId 
   * @param id 
   * @param name 
   * @param email 
   * @param phoneNumber 
   * @param requestStatus 
   * @returns 
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
                );
            });
        } else {
            return reject(new ErrorInstance(Errors.ERROR_SAVING_SESSION))
        }
    });
}


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
                    }
                },
                (_, _error) => {
                    return false
                }
            );
        });
    }
}

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
                    } else {
                        console.log('--- Nenhum cuidador foi apagado. Verifique o email fornecido.')
                        Promise.reject(new ErrorInstance(Errors.ERROR_DELETING_CAREGIVER))
                    }
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
                );
            });
        } else {
            reject(new Error('Database not initialized.')); 
        }
    })
}

export const checkNumberOfCaregivers = async (userId: string): Promise<boolean> => {
    console.log("===> checkNumberOfCaregiversCalled")
    return new Promise((resolve, reject) => {
        if (dbSQL != null) {
            dbSQL.transaction(tx => {
                tx.executeSql(
                    'SELECT COUNT(*) AS count FROM caregivers WHERE userId = ? AND status = ?',
                    [userId, CaregiverRequestStatus.ACCEPTED.valueOf()],
                    (_, result) => {
                        const count = result.rows.item(0).count;
                        resolve(count > 0); 
                    },
                    (_, _error) => {
                     return false
                    }
                );
            });
        } else {
            reject(new Error('Database not initialized.')); 
        }
    })
}


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
                );
            });
        } else {
            reject(new Error('Database not initialized.')); 
        }
    })
}

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
            );
        });
    }
}

export const getCaregivers = (userId: string): Promise<Caregiver[]> => {
    console.log("===> getCaregiversCalled")
    return new Promise((resolve, reject) => {
        const data: Caregiver[] = [];
        try {
            if(dbSQL == null) {
                throw (new Error("Database is not connected."))
            }
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
                        return false
                    }
                )
            });
        } catch (error) {
            reject(error)
        }
    })
}

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
                );
            });
        } else {
            reject(new Error('Database not initialized.')); 
        }
    })
}