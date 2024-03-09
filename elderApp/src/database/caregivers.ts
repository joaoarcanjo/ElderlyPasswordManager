import { dbSQL } from ".";
import { Caregiver } from "./types";

  /**
 * Função para guardar os dados de determinado cuidador.
 * @param id 
 * @param email 
 * @param phoneNumber 
 */
  export const saveCaregiver = async (id: string, name: string, email: string, phoneNumber: string) => {
    if(dbSQL != null) {
        dbSQL.transaction(tx => {
            tx.executeSql(
                'INSERT INTO caregivers (id, name, email, phoneNumber) VALUES (?,?,?,?)',
                [id, name, email, phoneNumber],
                (_, result) => {
                    return Promise.resolve(result.rowsAffected > 0)
                }
            );
        });
    }
}

export const updateCaregiver = async (email: string, newName: string, newPhoneNumber: string) => {
    //console.log("Email: "+email)
    if (dbSQL != null) {
        dbSQL.transaction(tx => {
            tx.executeSql(
                'UPDATE caregivers SET name = ?, phoneNumber = ? WHERE email = ?',
                [newName, newPhoneNumber, email],
                (_, result) => {
                      // Verifique se houve alguma linha afetada para confirmar se a atualização foi bem-sucedida.
                    if (result.rowsAffected > 0) {
                        console.log('- Cuidador atualizado com sucesso.')
                    } else {
                        console.log('- Nenhum cuidador foi atualizado. Verifique o email fornecido.')
                    }
                }
            );
        });
    }
}

export const deleteCaregiver = async (email: string) => {
    if (dbSQL != null) {
        dbSQL.transaction(tx => {
            tx.executeSql(
                'DELETE FROM caregivers WHERE email = ?',
                [email],
                (_, result) => {
                    if (result.rowsAffected > 0) {
                        console.log('- Cuidador apagado com sucesso.');
                    } else {
                        console.log('- Nenhum cuidador foi apagado. Verifique o email fornecido.');
                    }
                }
            );
        });
    }
}

export const checkCaregiverByEmail = async (email: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        if (dbSQL != null) {
            dbSQL.transaction(tx => {
                tx.executeSql(
                    'SELECT COUNT(*) AS count FROM caregivers WHERE email = ?',
                    [email],
                    (_, result) => {
                        const count = result.rows.item(0).count;
                        resolve(count > 0); 
                    }
                );
            });
        } else {
            reject(new Error('Database not initialized.')); 
        }
    })
}

export const getCaregivers = (): Promise<Caregiver[]> => {
    return new Promise(async (resolve, reject) => {
        const sql = 'SELECT id, name, email, phoneNumber FROM caregivers LIMIT 2';

        const data: Caregiver[] = [];
        try {
            if(dbSQL == null) {
                throw (new Error("Database is not connected."))
            }
            dbSQL.transaction((tx) => {
                tx.executeSql(sql, [], (tx, results) => {
                    for (let i = 0; i < results.rows.length; i++) {                        
                        data.push({
                            id         : results.rows.item(i).id,
                            name       : results.rows.item(i).name,
                            email      : results.rows.item(i).email,
                            phoneNumber: results.rows.item(i).phoneNumber
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