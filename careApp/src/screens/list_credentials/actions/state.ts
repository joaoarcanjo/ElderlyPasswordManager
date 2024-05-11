import { BehaviorSubject } from "rxjs";
import { getKey, listAllCredentialsFromFirestore } from "../../../firebase/firestore/functionalities";
import { getKeychainValueFor } from "../../../keychain";
import { elderlySSSKey } from "../../../keychain/constants";
import { getElderlyId } from "../../../database/elderly";
import { CredentialType } from "../../list_credentials/actions/types";
import { deriveSecret } from "../../../algorithms/shamirSecretSharing/sss";

export const credentialsListUpdated = new BehaviorSubject<CredentialType[]>([])

export const setCredentialsListUpdated = async (userId: string, elderlyEmail: string) => {
    console.log("===> setCredentialsListUpdatedCalled")
    console.log("1")
    const elderlyId = await getElderlyId(elderlyEmail, userId)
    console.log("2")
    const cloudKey = await getKey(elderlyId)
    console.log(cloudKey)
    const sssKey = await getKeychainValueFor(elderlySSSKey(elderlyId))
    console.log("4")
    const encryptionKey = deriveSecret([cloudKey, sssKey])
    console.log("5")
    listAllCredentialsFromFirestore(elderlyId, encryptionKey, true).then((credencials) => {
      let auxCredencials: CredentialType[] = [];
      credencials.forEach(value => {
        if(value.data) {
          auxCredencials.push({id: value.id, data: value.data})
        }
      })
      credentialsListUpdated.next(auxCredencials)
    })
}