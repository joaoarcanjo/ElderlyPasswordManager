import { dbSQL } from ".";
import * as Crypto from 'expo-crypto'
import { Password } from './types';
import { decrypt, encrypt } from '../algorithms/0thers/crypto';
  /*
This function is used to delete the older password generated. 
*/
const deletePasswordGenerated = () => {
    if(dbSQL != null) {
        dbSQL.transaction((tx) => {
            tx.executeSql(
              'DELETE FROM passwords WHERE id IN (SELECT id FROM passwords ORDER BY timestamp DESC LIMIT -10 OFFSET 9)',
              [],
              (_, result) => {
                  //console.log('Tuplo com timestamp mais antigo excluído com sucesso:', result);
              }
            );
        });
    }
}
  
  /*
Function to save the new generated password.
*/
export const savePasswordGenerated = async (password: string, localDBKey: string) => {
    deletePasswordGenerated()

    const encrypted = encrypt(password, localDBKey)

    if(dbSQL != null) {
        dbSQL.transaction(tx => {
            tx.executeSql('INSERT INTO passwords (id, password, timestamp) VALUES (?, ?, ?);',
            [Crypto.randomUUID(), encrypted, Date.now()],
            (_, result) => {
                  //console.log('Novo registro inserido com sucesso:', result);
            })
        });
    }
}
  
export const getPasswords = () => {
    if(dbSQL != null) {
        dbSQL.transaction(tx => {
            return tx.executeSql('SELECT (id, password, timestamp) FROM passwords', [],
                (txObj, resultSet) => resultSet.rows._array
            );
        });
    }
}

export const getGeneratedPasswords = (localDBKey: string): Promise<Password[]> => {
    return new Promise(async (resolve, reject) => {
        const sql = 'SELECT id, password, timestamp FROM passwords ORDER BY timestamp DESC LIMIT 10';

        const data: Password[] = [];
        try {
            if(dbSQL == null) {
                throw (new Error("Database is not connected."))
            }
            dbSQL.transaction((tx) => {
                tx.executeSql(sql, [], (tx, results) => {
                    for (let i = 0; i < results.rows.length; i++) {                        
                        data.push({
                            id       : results.rows.item(i).id,
                            password : decrypt(results.rows.item(i).password, localDBKey),
                            timestamp: results.rows.item(i).timestamp
                        });
                    }
                    resolve(data)
                    }
                );
            });
        } catch (error) {
            reject(error)
        }
    })
}