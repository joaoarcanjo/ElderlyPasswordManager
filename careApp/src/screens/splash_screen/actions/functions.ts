import { dbSQL, initDb } from "../../../database"
import { getTimeoutFromLocalDB, insertTimeoutToLocalDB, updateTimeoutToLocalDB } from "../../../database/timeout"
import { TimeoutType } from "../../../database/types"

const time = 2000//TODO: COLOCAR NO FICHEIRO DE CONSTANTES
const timeToNewSplash = 1000 * 10 //60 * 60 * 24 // 1 day


export const flashTimeoutPromise = async (userId: string, setXd: Function) => {
    console.log("flashTimeoutPromise")
    if(userId == '' || userId == null) return Promise.resolve()
    if(dbSQL == null) {
        initDb()
    }
    const timestamp = await getTimeoutFromLocalDB(userId, TimeoutType.SPLASH)
    
    if(timestamp == null) {
        setXd(false)
        return insertTimeoutToLocalDB(userId, new Date().getTime(), TimeoutType.SPLASH)
        .then(() => new Promise(resolve => setTimeout(resolve, time)))
    } else {
        console.log("AHHHH")
        setXd(false)
        const currentDate = new Date().getTime()
        if(currentDate - timestamp > timeToNewSplash) {
            return updateTimeoutToLocalDB(userId, currentDate, TimeoutType.SPLASH)
            .then(() => new Promise(resolve => setTimeout(resolve, time)))
        }
    }
}
