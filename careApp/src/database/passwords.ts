import { dbSQL } from ".";
import * as Crypto from 'expo-crypto'
import { Password } from './types';
import { Errors } from "../exceptions/types";
import { decrypt, encrypt } from "../algorithms/tweetNacl/crypto";


/**
 * Deletes the generated password with the oldest timestamp from the passwords table.
 */
const deletePasswordGenerated = () => {
    if(dbSQL != null) {
        dbSQL.execAsync(`
            DELETE FROM passwords WHERE id IN (SELECT id FROM passwords ORDER BY timestamp DESC LIMIT -10 OFFSET 9);
        `)
        /*
        dbSQL.transaction((tx) => {
            tx.executeSql(
              'DELETE FROM passwords WHERE id IN (SELECT id FROM passwords ORDER BY timestamp DESC LIMIT -10 OFFSET 9)',
              [],
              (_, result) => {
                  //console.log('Tuplo com timestamp mais antigo excluído com sucesso:', result);
              }
            )
        })*/
    }
}
  

/**
 * Saves the generated password to the database.
 * 
 * @param password - The password to be saved.
 * @param localDBKey - The key used for encrypting the password.
 * @returns A promise that resolves when the password is saved successfully.
 */
export const savePasswordGenerated = async (password: string, localDBKey: string) => {
    deletePasswordGenerated()

    const encrypted = encrypt(password, localDBKey)

    if(dbSQL != null) {
        dbSQL.runAsync(`   
            INSERT INTO passwords (id, password, timestamp) VALUES (?, ?, ?);
        `, [Crypto.randomUUID(), encrypted, Date.now()])
    }
}
  
/**
 * Retrieves the passwords from the database.
 * @returns An array of password objects containing id, password, and timestamp.
 */
export const getPasswords = () => {
    if(dbSQL != null) {
        dbSQL.getAllAsync(`
            SELECT (id, password, timestamp) FROM passwords;
        `)
    }
}


/**
 * Retrieves the most recently generated passwords from the database.
 * @param localDBKey - The encryption key used to decrypt the passwords.
 * @returns A promise that resolves to an array of Password objects.
 * @throws {Errors.ERROR_DATABASE_NOT_INITIALIZED} if the database is not initialized.
 * @throws {Errors.ERROR_GETTING_GENERATED_PASSWORDS} if there was an error retrieving the passwords.
 */
export const getGeneratedPasswords = (localDBKey: string): Promise<Password[]> => {
    return new Promise(async (resolve, reject) => {
        const sql = 'SELECT id, password, timestamp FROM passwords ORDER BY timestamp DESC LIMIT 10';

        const data: Password[] = [];
        try {
            if(dbSQL != null) {
                await dbSQL.getAllAsync(sql)
                .then((result) => {
                    const passwords = result as any[]
                    for (let i = 0; i < passwords.length; i++) {                        
                        data.push({
                            id       : passwords[i].id,
                            password : decrypt(passwords[i].password, localDBKey),
                            timestamp: passwords[i].timestamp
                        });
                    }
                    resolve(data)
                })
            } else {
                reject(Errors.ERROR_DATABASE_NOT_INITIALIZED)
            }
        } catch (error) {
            reject(Errors.ERROR_GETTING_GENERATED_PASSWORDS)
        }
    })
}