import { dbSQL } from "."
import { ErrorInstance } from "../exceptions/error";
import { Errors } from "../exceptions/types";
import { TimeoutType } from "./types";

/**
 * Inserts a timeout record into the local database.
 * @param userId - The ID of the user.
 * @param timestamp - The timestamp of the timeout.
 * @param type - The type of the timeout.
 * @returns A Promise that resolves when the timeout is successfully inserted, or rejects with an error.
 */
export async function insertTimeoutToLocalDB(userId: string, timestamp: number, type: TimeoutType): Promise<void> {
    console.log("===> insertTimeoutCalled")
    return new Promise((resolve, reject) => {
        if (dbSQL != null) {
            dbSQL.transaction(tx => {
                tx.executeSql(
                    'INSERT INTO timeout (userId, timestamp, type) VALUES (?, ?, ?);',
                    [userId, timestamp, type],
                    (_, result) => {
                        //console.log(result.rowsAffected + " timeout inserted")
                        resolve()
                    },
                    (_, error) => {
                        console.log("Error 3: " + error.message)
                        reject(new ErrorInstance(Errors.ERROR_CREATING_TIMEOUT))
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
 * Updates the timeout value in the local database for a specific user.
 * @param userId - The ID of the user.
 * @param timestamp - The new timestamp value for the timeout.
 * @param type - The type of the timeout.
 * @returns A Promise that resolves when the timeout is updated successfully, or rejects with an error.
 */
export async function updateTimeoutToLocalDB(userId: string, timestamp: number, type: TimeoutType): Promise<void> {
    console.log("===> updateTimeoutCalled")
    return new Promise((resolve, reject) => {
        if (dbSQL != null) {
            dbSQL.transaction(tx => {
                tx.executeSql(
                    'UPDATE timeout SET timestamp = ? WHERE userId = ? AND type = ?;',
                    [timestamp, userId, type],
                    (_, result) => {
                        console.log(result.rowsAffected + " timeout updated")
                        resolve()
                    },
                    (_, error) => {
                        console.log("Error 2: " + error.message)
                        reject(new ErrorInstance(Errors.ERROR_UPDATING_TIMEOUT))
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
 * Retrieves the timeout value from the local database for a specific user and timeout type.
 * @param userId - The ID of the user.
 * @param type - The type of the timeout.
 * @returns A promise that resolves to the timeout value (in milliseconds) if found, or null if not found.
 * @throws {Errors.ERROR_GETTING_TIMEOUT} If there is an error getting the timeout value.
 */
export async function getTimeoutFromLocalDB(userId: string, type: TimeoutType): Promise<number | null> {
    console.log("===> getTimeoutCalled")
    return new Promise((resolve, reject) => {
        if (dbSQL != null) {
            dbSQL.transaction(tx => {
                tx.executeSql(
                    'SELECT timestamp FROM timeout WHERE userId = ? AND type = ?;',
                    [userId, type],
                    (_, result) => {
                        if (result.rows.length > 0) {
                            const timestamp = result.rows.item(0).timestamp
                            resolve(timestamp)
                        } else {
                            console.log("Timeout not found")
                            resolve(null)
                        }
                    },
                    (_, error) => {
                        console.log("Error 1: " + error.message)
                        reject(new ErrorInstance(Errors.ERROR_GETTING_TIMEOUT))
                        return false
                    }
                )
            })
        } else {
            reject(Errors.ERROR_DATABASE_NOT_INITIALIZED)
        }
    })
}