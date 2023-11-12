import { MovieRealmContext } from './index'
import uuid from 'react-native-uuid'

const { useRealm } = MovieRealmContext
const realm = useRealm()

const getCount = (type: string) => { let c = 0; realm.objects(type).map(() => {c++}); return c }

export const deleteGenerated = () => {
    console.log(getCount('GeneratedPassword'))
    if(getCount('GeneratedPassword') > 10) {
        const passwordToDelete = realm.objects('GeneratedPassword').filtered('creationTimestamp = $0', realm.objects('GeneratedPassword').min('creationTimestamp'))[0];
        if (passwordToDelete) {
          realm.write(() => {
            realm.delete(passwordToDelete);
          });
        } 
      }
}

export const savePasswordGenerated = (password: string) => {
    realm.write(() => {
        realm.create('GeneratedPassword', {_id: uuid.v4(), password: password, creationTimestamp: Date.now()});
    });
}

    