import { Request, Response } from 'express';
import Superhero from '@models/Superhero';

export const createSuperhero = async (req: Request, res: Response) => {
    try {
        const { nickname, real_name, origin_description, superpowers, catch_phrase, image } = req.body;

        if (!nickname || !real_name || !origin_description || !superpowers || !catch_phrase || !image) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingSuperhero = await Superhero.findOne({ nickname });
        if (existingSuperhero) {
            return res.status(400).json({ message: 'Superhero already exists' });
        }

        const newSuperhero = new Superhero({
            ...req.body,
        });

        await newSuperhero.save();
        return res.status(201).json({
            message: 'Superhero created successfully',
            superhero: newSuperhero
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error during superhero creation' });
    }
}