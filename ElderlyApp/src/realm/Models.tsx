import Realm, { ObjectSchema } from "realm";

export class Person extends Realm.Object<Person> {
  _id!: string;
  name!: string;
  age?: number;
  
  static schema: ObjectSchema = {
    name: 'Person',
    primaryKey: '_id',
    properties: {
      _id: 'string',
      name: 'string',
      age: 'string',
    },
  };
}

export class GeneratedPassword extends Realm.Object<GeneratedPassword> {
  _id!: string;
  password!: string;
  creationTimestamp!: number;

  static schema: ObjectSchema = {
    name: 'GeneratedPassword',
    primaryKey: '_id',
    properties: {
      _id: 'string',
      password: 'string',
      creationTimestamp: 'int',
    },
  };
}
