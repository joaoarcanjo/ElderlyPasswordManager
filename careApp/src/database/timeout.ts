import { dbSQL } from "."
import { ErrorInstance } from "../exceptions/error";
import { Errors } from "../exceptions/types";
import { TimeoutType } from "./types";

export async function insertTimeoutToLocalDB(userId: string, timestamp: number, type: TimeoutType): Promise<void> {
    console.log("===> insertTimeoutCalled")
    return new Promise((resolve, reject) => {
        if (dbSQL != null) {
            dbSQL.transaction(tx => {
                tx.executeSql(
                    'INSERT INTO timeout (userId, timestamp, type) VALUES (?, ?, ?);',
                    [userId, timestamp, type],
                    (_, result) => {
                        console.log(result.rowsAffected + " timeout inserted")
                        resolve()
                    },
                    (_, error) => {
                        console.log("Error: " + error.message)
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
                        console.log("Error: " + error.message)
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
                        console.log("Error: " + error.message)
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