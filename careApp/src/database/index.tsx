import * as SQLite from 'expo-sqlite'
import { ElderlyRequestStatus } from './types';
export let dbSQL: SQLite.SQLiteDatabase | null = null;

export function initDb() {
    dbSQL = SQLite.openDatabase('caregiver.db')
    
    //Os cuidadores também vão guardar as suas passwords
    dbSQL.transaction(tx => {
        tx.executeSql(
            'DROP TABLE IF EXISTS passwords;'
        )
        tx.executeSql(
            'DROP TABLE IF EXISTS elderly;'
        )
    })

    dbSQL.transaction(tx => {
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS passwords (id TEXT PRIMARY KEY, userId TEXT, password TEXT, timestamp INTEGER);'
        )
    })

    dbSQL.transaction(tx => {
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS elderly (elderlyId TEXT, userId TEXT, name TEXT, email TEXT , phoneNumber TEXT, status INTEGER DEFAULT 0,  PRIMARY KEY(userId, email, phoneNumber));'
        )
    })

    dbSQL.transaction(tx => {
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS sessionsSignal (id TEXT, userId TEXT, record TEXT, PRIMARY KEY (id, userId));'
        )
    })
}

export const checkElderlyByEmail = async (userId: string, email: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        if (dbSQL != null) {
            dbSQL.transaction(tx => {
                tx.executeSql(
                    'SELECT COUNT(*) AS count FROM elderly WHERE email = ? AND userId = ? AND status = ?;',
                    [email, userId, ElderlyRequestStatus.ACCEPTED.valueOf()],
                    (_, result) => {
                        const count = result.rows.item(0).count;
                        return resolve(count > 0); 
                    }
                );
            });
        } else {
            reject(new Error('Database not initialized.')); 
        }
    })
}