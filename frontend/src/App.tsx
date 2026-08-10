import { useState, useEffect } from 'react';
import type { SyntheticEvent } from 'react';
import type { Usuario } from './types.js';
import { obtenerUsuariosAPI, crearUsuarioAPI, eliminarUsuarioAPI,actualizarUsuarioAPI } from './api.js';
import './App.css';

function App() {
  const [id, setid] = useState<number>(0);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [apellidos, setApellidos] = useState<string>('');
  const [nombre, setNombre] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [edad, setEdad] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [idEditandoEnLista, setIdEditandoEnLista] = useState<number | null>(null);
  const [datosEdicion, setDatosEdicion] = useState<Partial<Usuario>>({});
  // Cargar usuarios al inicio
  const cargarUsuarios = async () => {
    try {
      const datos = await obtenerUsuariosAPI();
      setUsuarios(datos);
    } catch (err) {
      setError('No se pudo conectar con el servidor.');
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const manejarEnvio = async (e: SyntheticEvent) => {
    e.preventDefault();
    setError(null);

    if (!nombre || !email || !id || !apellidos) {
      setError('Nombre, Email e ID son requeridos');
      return;
    }

    try {
      await crearUsuarioAPI({ id, nombre, email, apellidos ,edad: edad ? parseInt(edad) : undefined });
      setNombre('');
      setEmail('');
      setEdad('');
      setApellidos('');
      setid(0);
      cargarUsuarios();
    } catch (err) {
      setError('Hubo un error al guardar al usuario.');
    }
  };


  const manejarEliminar = async (id: string | number | undefined) => {
    if (!id) return;
    if (!window.confirm('¿Seguro que deseas eliminarlo?')) return;

    try {
      await eliminarUsuarioAPI(id.toString());
      cargarUsuarios(); 
    } catch (err) {
      setError('No se pudo eliminar al usuario.');
    }
  };

  const iniciarEdicionTarjeta = (usuario: Usuario) => {
    setIdEditandoEnLista(usuario.id);
    setDatosEdicion(usuario);
  };

  const guardarEdicionTarjeta = async (id: number) => {
    try {
      await actualizarUsuarioAPI(id.toString(), datosEdicion);
      setIdEditandoEnLista(null);
      cargarUsuarios();
    } catch (err) {
      setError('Error al actualizar');
    }
  };
  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>Panel Fullstack Limpio</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={manejarEnvio} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px' }}>
        <input 
          type="number" 
          placeholder="ID del usuario" 
          value={id || ''} 
          onChange={e => setid(Number(e.target.value))} 
          style={{ padding: '8px' }} 
        />
        <input type="text" placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} style={{ padding: '8px' }} />
        <input type="text" placeholder="Apellidos" value={apellidos} onChange={e => setApellidos(e.target.value)} style={{ padding: '8px' }} />
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ padding: '8px' }} />
        <input type="number" placeholder="Edad" value={edad} onChange={e => setEdad(e.target.value)} style={{ padding: '8px' }} />
        <button type="submit" style={{ padding: '10px', background: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>
          Guardar Usuario
        </button>
      </form>

      {/* Lista */}
      <h2>Lista en Base de Datos</h2>
      {usuarios.map((usuario) => (
      <div key={usuario.id} style={{ border: '1px solid #fff', padding: '15px', marginBottom: '10px' }}>
        {idEditandoEnLista === usuario.id ? (
          <div>
            <input 
              value={datosEdicion.nombre || ''} 
              onChange={e => setDatosEdicion({...datosEdicion, nombre: e.target.value})} 
            />
            <input 
              value={datosEdicion.apellidos || ''} 
              onChange={e => setDatosEdicion({...datosEdicion, apellidos: e.target.value})} 
            />
            <input 
              value={datosEdicion.email || ''} 
              onChange={e => setDatosEdicion({...datosEdicion, email: e.target.value})} 
            />
            <input 
                type="number"
                placeholder="Edad (opcional)"
                value={datosEdicion.edad ?? ''} 
                onChange={e => {
                  const valor = e.target.value;
                  setDatosEdicion({...datosEdicion, edad: valor === '' ? undefined : Number(valor)});
                }} 
             />
            <button onClick={() => guardarEdicionTarjeta(usuario.id)} style={{ background: '#28a745', color: 'white' }}>
              Guardar
            </button>
            <button onClick={() => setIdEditandoEnLista(null)} style={{ background: '#6c757d', color: 'white' }}>
              Cancelar
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3>{usuario.nombre} {usuario.apellidos} ({usuario.edad} años)</h3>
              <p>{usuario.email}</p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => iniciarEdicionTarjeta(usuario)} style={{ background: '#007bff', color: 'white' }}>
                Editar
              </button>
              <button onClick={() => manejarEliminar(usuario.id)} style={{ background: '#dc3545', color: 'white' }}>
                Borrar
              </button>
            </div>
          </div>
        )}
      </div>
    ))}
      </div>
  );
}

export default App;