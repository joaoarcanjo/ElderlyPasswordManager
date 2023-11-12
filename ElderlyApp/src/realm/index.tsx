import {createRealmContext} from '@realm/react';
import {Person, GeneratedPassword} from './Models';

export const MovieRealmContext = createRealmContext({
  schema: [Person, GeneratedPassword]  
});