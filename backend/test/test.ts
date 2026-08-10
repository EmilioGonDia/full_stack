import dotenv from 'dotenv';
import path from 'path';
import request from 'supertest';
import app from '../src/index.js';
import mongoose from 'mongoose';

dotenv.config({ path: path.resolve(__dirname, '../.env.test') });

beforeAll(async () => {
  const url = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/test';
  await mongoose.connect(url);
});

afterAll(async () => {
  if (mongoose.connection.db) {
    await mongoose.connection.dropDatabase();
  }
  await mongoose.connection.close();
});

describe('SUITE COMPLETA CRUD Y ERRORES DE API DE PERSONAS (/api/usuarios)', () => {
  
  // Usuario base de prueba para reutilizar en los tests
  const usuarioTest = {
    id: 999,
    nombre: 'Test',
    apellidos: 'Testing',
    email: 'test.crud@ejemplo.com',
    edad: 30,
  };

  // ==========================================
  // 1. CREATE (POST) & ERRORES DE CREACIÓN
  // ==========================================
  describe('POST /api/usuarios (Crear)', () => {
    
    test('Debería crear una nueva persona correctamente', async () => {
    const res = await request(app)
        .post('/api/usuarios')
        .send(usuarioTest);

    expect(res.status).toBe(201); // 👈 Cambiado de 200 a 201
    expect(res.body.nombre).toBe(usuarioTest.nombre);
    expect(res.body.email).toBe(usuarioTest.email);
    });

    test('Error: Debería fallar si falta un campo obligatorio (ej. nombre)', async () => {
    const personaSinNombre = {
        id: 1001,
        apellidos: 'Sin Nombre',
        email: 'sinnombre@ejemplo.com',
    };

    const res = await request(app)
        .post('/api/usuarios')
        .send(personaSinNombre);

    expect(res.status).toBe(400); 
    });

    test('Error: Debería fallar al duplicar un email único', async () => {
    const usuarioDuplicado = {
        id: 1002,
        nombre: 'Duplicado',
        apellidos: 'User',
        email: 'test.crud@ejemplo.com',
    };

    const res = await request(app)
        .post('/api/usuarios')
        .send(usuarioDuplicado);

    expect(res.status).toBe(400); 
    });
  });

  // ==========================================
  // 2. READ (GET)
  // ==========================================
  describe('GET /api/usuarios (Leer)', () => {
    
    test('Debería devolver la lista de usuarios y status 200', async () => {
      const res = await request(app).get('/api/usuarios');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

    describe('GET /api/usuarios/:id (Obtener por ID)', () => {

    test('Debería obtener un usuario existente por su ID', async () => {

        const nuevoUsuario = await request(app)
        .post('/api/usuarios')
        .send({
            id: 888,
            nombre: 'Buscar',
            apellidos: 'Test',
            email: 'buscar@ejemplo.com',
            edad: 25
        });

        const mongoId = nuevoUsuario.body._id; 
        // 2. Probar la petición GET /:id
        const res = await request(app).get(`/api/usuarios/${mongoId}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('_id', mongoId);
        expect(res.body.nombre).toBe('Buscar');
    });

    test('Error: Debería devolver 404 si el usuario no existe (ID válido pero inexistente)', async () => {
        const idInexistente = '60d5ecb8b5c9c22a5c8e4567';

        const res = await request(app).get(`/api/usuarios/${idInexistente}`);

        expect(res.status).toBe(404);
        expect(res.body.mensaje).toBe('Persona no encontrado');
    });

    test('Error: Debería devolver 500 si el ID tiene un formato no válido para MongoDB', async () => {
        const idInvalido = 'id-no-valido-123';

        const res = await request(app).get(`/api/usuarios/${idInvalido}`);

        expect(res.status).toBe(500);
        expect(res.body.mensaje).toBe('ID no válido o error de servidor');
    });

    });
  // ==========================================
  // 3. UPDATE (PUT) & ERRORES DE EDICIÓN
  // ==========================================
  describe('PUT /api/usuarios/:id (Actualizar)', () => {
    
    test('Debería actualizar los datos de la persona existente', async () => {
      const datosActualizados = {
        ...usuarioTest,
        nombre: 'TestModificado',
        edad: 35,
      };

      const res = await request(app)
        .put(`/api/usuarios/${usuarioTest.id}`)
        .send(datosActualizados);

      expect(res.status).toBe(200);
      expect(res.body.nombre).toBe('TestModificado');
      expect(res.body.edad).toBe(35);
    });

    test('Debería actualizar permitiendo que la edad sea nula', async () => {
      const datosSinEdad = {
        ...usuarioTest,
        edad: null,
      };

      const res = await request(app)
        .put(`/api/usuarios/${usuarioTest.id}`)
        .send(datosSinEdad);

      expect(res.status).toBe(200);
      expect(res.body.edad).toBeNull();
    });

    test('Error: Debería fallar si se intenta actualizar con un email en formato inválido', async () => {
      const datosMailError = {
        ...usuarioTest,
        email: 'email-mal-formado',
      };

      const res = await request(app)
        .put(`/api/usuarios/${usuarioTest.id}`)
        .send(datosMailError);

      expect(res.status).toBe(500);
    });
  });

  // ==========================================
  // 4. DELETE (DELETE) & ERRORES DE ELIMINACIÓN
  // ==========================================
  describe('DELETE /api/usuarios/:id (Eliminar)', () => {
    
    test('Debería eliminar la persona creada correctamente', async () => {
    const res = await request(app).delete(`/api/usuarios/${usuarioTest.id}`);

        expect(res.status).toBe(200);
        expect(res.body.mensaje).toBe('Persona eliminado correctamente'); 
    });

    test('Error/Comprobación: Intentar eliminar una persona inexistente', async () => {
      const res = await request(app).delete('/api/usuarios/999999');

      expect(res.status).toBe(404);
    });
  });

});