import { dbSQL } from ".";
import * as Crypto from 'expo-crypto'
import { Password } from './types';
import { Errors } from "../exceptions/types";
import { decrypt, encrypt } from "../algorithms/tweetNacl/crypto";

/**
 * Deletes the generated password with the oldest timestamp from the passwords table.
 */
const deletePasswordGenerated = (userId: string) => {
    if(dbSQL != null) {
        dbSQL.runAsync(`
            DELETE FROM passwords WHERE id IN (SELECT id FROM passwords ORDER BY timestamp DESC LIMIT -10 OFFSET 9) AND userId = ?;
        `, [userId])
    }
}

/**
 * Saves the generated password to the database.
 * 
 * @param password - The password to be saved.
 * @param localDBKey - The key used for encrypting the password.
 * @returns A promise that resolves when the password is saved successfully.
 */
export const savePasswordGenerated = async (password: string, userId: string, localDBKey: string) => {
    deletePasswordGenerated(userId)

    const encrypted = encrypt(password, localDBKey)

    if(dbSQL != null) {
        dbSQL.runAsync(`   
            INSERT INTO passwords (id, password, userId, timestamp) VALUES (?, ?, ?, ?);
        `, [Crypto.randomUUID(), encrypted, userId, Date.now()])
    }
}

/**
 * Retrieves the most recently generated passwords from the database.
 * @param localDBKey - The encryption key used to decrypt the passwords.
 * @returns A promise that resolves to an array of Password objects.
 * @throws {Errors.ERROR_DATABASE_NOT_INITIALIZED} if the database is not initialized.
 * @throws {Errors.ERROR_GETTING_GENERATED_PASSWORDS} if there was an error retrieving the passwords.
 */
export const getGeneratedPasswords = (localDBKey: string, userId: string): Promise<Password[]> => {
    return new Promise(async (resolve, reject) => {
        const data: Password[] = [];
        try {
            if(dbSQL != null) {
                await dbSQL.getAllAsync('SELECT id, password, timestamp FROM passwords WHERE userId = ? ORDER BY timestamp DESC LIMIT 10 ', [userId])
                .then((result) => {
                    const passwords = result as any[]
                    for (let i = 0; i < passwords.length; i++) {  
                        const decrypted = decrypt(passwords[i].password, localDBKey)
                        data.push({
                            id       : passwords[i].id,
                            password : decrypted,
                            timestamp: passwords[i].timestamp,
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