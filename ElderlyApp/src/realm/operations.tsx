import { MovieRealmContext } from './index'
import uuid from 'react-native-uuid'

const { useRealm } = MovieRealmContext

let realm = useRealm()

/*
Get the number of elements inside a specific collection.
*/
const getCount = (type: string) => { 
  if(realm.isClosed) realm = useRealm()
  let c = 0; 
  realm.objects(type).map(() => {c++}); 
  return c 
}

/*
This function is used to delete the older password generated. 
*/
export const deleteGenerated = () => {
  if(realm.isClosed) realm = useRealm()
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

/*
Function to save the new generated password.
*/
export const savePasswordGenerated = (password: string) => {
  if(realm.isClosed) realm = useRealm()
  realm.write(() => {
      realm.create('GeneratedPassword', {_id: uuid.v4(), password: password, creationTimestamp: Date.now()});
  });
}

    