import { dbSQL } from "."
import { ErrorInstance } from "../exceptions/error";
import { Errors } from "../exceptions/types";

export async function insertTimeoutToLocalDB(userId: string, timestamp: number): Promise<void> {
    console.log("===> insertTimeoutCalled")
    return new Promise((resolve, reject) => {
        if (dbSQL != null) {
            dbSQL.transaction(tx => {
                tx.executeSql(
                    'INSERT INTO sssTimeout (userId, timestamp) VALUES (?, ?);',
                    [userId, timestamp],
                    (_, result) => {
                        console.log(result.rowsAffected + " timeout inserted")
                        resolve()
                    },
                    (_, error) => {
                        console.log("Error 5: " + error.message)
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

export async function updateTimeoutToLocalDB(userId: string, timestamp: number): Promise<void> {
    console.log("===> updateTimeoutCalled")
    return new Promise((resolve, reject) => {
        if (dbSQL != null) {
            dbSQL.transaction(tx => {
                tx.executeSql(
                    'UPDATE sssTimeout SET timestamp = ? WHERE userId = ?;',
                    [timestamp, userId],
                    (_, result) => {
                        console.log(result.rowsAffected + " timeout updated")
                        resolve()
                    },
                    (_, error) => {
                        console.log("Error 7: " + error.message)
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

export async function getTimeoutFromLocalDB(userId: string): Promise<number | null> {
    console.log("===> getTimeoutCalled")
    return new Promise((resolve, reject) => {
        if (dbSQL != null) {
            dbSQL.transaction(tx => {
                tx.executeSql(
                    'SELECT timestamp FROM sssTimeout WHERE userId = ?;',
                    [userId],
                    (_, result) => {
                        if (result.rows.length > 0) {
                            const timestamp = result.rows.item(0).timestamp
                            console.log("Timeout retrieved: " + timestamp)
                            resolve(timestamp)
                        } else {
                            console.log("Timeout not found")
                            resolve(null)
                        }
                    },
                    (_, error) => {
                        console.log("Error 4: " + error.message)
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