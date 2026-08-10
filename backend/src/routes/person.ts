import { Router, Request, Response } from 'express';
import Person from '../model/person.js'; 

const route = Router();


route.get('/', async (req: Request, res: Response) => {
    try {
        const persons = await Person.find(); 
        
        res.status(200).json(persons);
    } catch (error) {
        console.error("Error al obtener las personas:", error);
        res.status(500).json({ mensaje: "Hubo un error en el servidor" });
    }
});


route.get('/:id', async (req: Request, res: Response) => {
    try {
        const personId = req.params.id;
        
        const person = await Person.findById(personId);
        
        if (!person) {
            return res.status(404).json({ mensaje: "Persona no encontrado" });
        }
        
        res.status(200).json(person);
    } catch (error) {
        console.error("Error al obtener el persona:", error);
        res.status(500).json({ mensaje: "ID no válido o error de servidor" });
    }
});



route.post('/', async (req: Request, res: Response) => {
    try {
        const { id, nombre, apellidos, email, edad } = req.body;

        if (!nombre || !email) {
            return res.status(400).json({ mensaje: "El nombre y el email son obligatorios" });
        }

        const newPerson = await Person.create({
            id,
            nombre,
            apellidos,
            email,
            edad
        });

        res.status(201).json(newPerson);
    } catch (error: any) {
        console.error("Error al crear persona:", error);
        
        if (error.code === 11000) {
            return res.status(400).json({ mensaje: "El email ya está registrado" });
        }

        res.status(500).json({ mensaje: "Hubo un error al guardar el persona" });
    }
});


route.put('/:id', async (req: Request, res: Response) => {
    try {
        const personId =Number(req.params.id);
        const datosActualizados = req.body;

        const personaModificada = await Person.findOneAndUpdate(
            { id: personId },
            datosActualizados, 
            { new: true, runValidators: true }
        );

        if (!personaModificada) {
            return res.status(404).json({ mensaje: "Persona no encontrado para actualizar" });
        }

        res.status(200).json(personaModificada);
    } catch (error) {
        console.error("Error al actualizar persona:", error);
        res.status(500).json({ mensaje: "Error interno al actualizar el persona" });
    }
});


route.delete('/:id', async (req: Request, res: Response) => {
    try {
        const personId = req.params.id;

        const personaEliminado = await Person.findOneAndDelete({ id: Number(personId) });

        if (!personaEliminado) {
            return res.status(404).json({ mensaje: "Persona no encontrado para eliminar" });
        }

        res.status(200).json({ 
            mensaje: "Persona eliminado correctamente", 
            persona: personaEliminado 
        });
    } catch (error) {
        console.error("Error al eliminar persona:", error);
        res.status(500).json({ mensaje: "Error interno al eliminar el persona" });
    }
});

export default route;