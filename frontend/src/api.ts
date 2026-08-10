import type { Usuario } from './types.js';

const API_URL = 'http://localhost:3000/api/usuarios';

export const obtenerUsuariosAPI = async (): Promise<Usuario[]> => {
  const respuesta = await fetch(API_URL);
  if (!respuesta.ok) throw new Error('Error al traer usuarios');
  return respuesta.json();
};

export const crearUsuarioAPI = async (nuevoUsuario: Usuario): Promise<void> => {
  const respuesta = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(nuevoUsuario),
  });
  if (!respuesta.ok) throw new Error('Error al guardar el usuario');
};

export const eliminarUsuarioAPI = async (id: string): Promise<void> => {
  const respuesta = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!respuesta.ok) throw new Error('Error al eliminar el usuario');
};

export const actualizarUsuarioAPI = async (id: string, usuarioActualizado: Partial<Usuario>): Promise<Usuario> => {
  const respuesta = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(usuarioActualizado),
  });
  if (!respuesta.ok) throw new Error('Error al actualizar el usuario');
  return respuesta.json();
};