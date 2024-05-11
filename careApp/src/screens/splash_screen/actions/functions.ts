import { emptyValue, splashScreenDuration, timeoutToNewSplash } from "../../../assets/constants/constants"
import { dbSQL, initDb } from "../../../database"
import { getTimeoutFromLocalDB, insertTimeoutToLocalDB, updateTimeoutToLocalDB } from "../../../database/timeout"
import { TimeoutType } from "../../../database/types"

export const flashTimeoutPromise = async (userId: string, setXd: Function) => {
    console.log("flashTimeoutPromise")
    if(userId == emptyValue || userId == null) return Promise.resolve()
    if(dbSQL == null) {
        initDb()
    }
    const timestamp = await getTimeoutFromLocalDB(userId, TimeoutType.SPLASH)
    
    if(timestamp == null) {
        setXd(false)
        return insertTimeoutToLocalDB(userId, new Date().getTime(), TimeoutType.SPLASH)
        .then(() => new Promise(resolve => setTimeout(resolve, splashScreenDuration)))
    } else {
        setXd(false)
        const currentDate = new Date().getTime()
        if(currentDate - timestamp > timeoutToNewSplash) {
            return updateTimeoutToLocalDB(userId, currentDate, TimeoutType.SPLASH)
            .then(() => new Promise(resolve => setTimeout(resolve, splashScreenDuration)))
        }
    }
}
