// models/Usuario.ts
import { Schema, model } from 'mongoose';
import validator from 'validator';

interface IPerson {
    id: number;
    nombre:string;
    apellidos: string;
    email: string;
    edad?: number; 
}

const personSchema = new Schema<IPerson>({
    id: {type: Number, required:true},
    nombre: { type: String, required: true },
    apellidos: { type: String, required: true },
    email: { 
    type: String, 
    required: [true, 'El email es obligatorio'], 
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: (val: string) => validator.isEmail(val), 
      message: 'El formato del email no es válido'
    }
  },
    edad: { type: Number }
});

const Person = model<IPerson>('Person', personSchema);
export default Person;