import { emptyValue, splashScreenDuration, timeoutToNewSplash } from "../../../assets/constants/constants"
import { dbSQL, initDb } from "../../../database"
import { getTimeoutFromLocalDB, insertTimeoutToLocalDB, updateTimeoutToLocalDB } from "../../../database/timeout"
import { TimeoutType } from "../../../database/types"

export const flashTimeoutPromise = async (userId: string, setXd: Function, setLocalDBKey: Function) => {
    console.log("==> flashTimeoutPromiseCalled")
    if(userId == emptyValue || userId == null) return Promise.resolve()
    if(dbSQL == null) {
        initDb(userId).then((DBKey) => setLocalDBKey(DBKey))
    }
    await getTimeoutFromLocalDB(userId, TimeoutType.SPLASH).then(async (timestamp) => {
        if(timestamp == null) {
            setXd(false)
            return await insertTimeoutToLocalDB(userId, new Date().getTime(), TimeoutType.SPLASH)
            .then(() => new Promise(resolve => setTimeout(resolve, splashScreenDuration)))
            .catch(() => console.log("#1 Error inserting timeout"))
        } else {
            setXd(false)
            const currentDate = new Date().getTime()
            if(currentDate - timestamp > timeoutToNewSplash) {
                return await updateTimeoutToLocalDB(userId, currentDate, TimeoutType.SPLASH)
                .then(() => new Promise(resolve => setTimeout(resolve, splashScreenDuration)))
                .catch(() => console.log("#1 Error updating timeout"))
            }
        }
    }).catch(() => console.log("#1 Error getting timeout"))
}
