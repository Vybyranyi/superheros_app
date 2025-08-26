import { Request, Response } from 'express';
import Superhero from '@models/Superhero';
import fs from 'fs';
import path from 'path';

const deleteFile = (filePath: string) => {
    const fullPath = path.join(__dirname, '..', '..', filePath);
    fs.unlink(fullPath, (err) => {
        if (err) console.error(`Failed to delete file: ${fullPath}`, err);
    });
};

export const createSuperhero = async (req: Request, res: Response) => {
    try {
        const { nickname, real_name, origin_description, superpowers, catch_phrase } = req.body;

        if (!nickname || !real_name || !origin_description || !superpowers || !catch_phrase) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingSuperhero = await Superhero.findOne({ nickname });
        if (existingSuperhero) {
            return res.status(400).json({ message: 'Superhero already exists' });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No images were uploaded' });
        }

        const imagePaths = (req.files as Express.Multer.File[]).map(file => `/uploads/${file.filename}`);

        const newSuperhero = new Superhero({
            ...req.body,
            images: imagePaths
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

export const getSuperheroes = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 5;
        const skip = (page - 1) * limit;

        const superheroes = await Superhero.find({})
            .limit(limit)
            .skip(skip)
            .select('nickname images');

        const totalSuperheroes = await Superhero.countDocuments();
        const totalPages = Math.ceil(totalSuperheroes / limit);

        const responseData = superheroes.map(superhero => ({
            _id: superhero._id,
            nickname: superhero.nickname,
            images: superhero.images.length > 0 ? [superhero.images[0]] : [],
        }));

        let nextPageUrl = null;
        if (page < totalPages) {
            nextPageUrl = `/superheroes/all?page=${page + 1}&limit=${limit}`;
        }

        let prevPageUrl = null;
        if (page > 1) {
            prevPageUrl = `/superheroes/all?page=${page - 1}&limit=${limit}`;
        }

        res.status(200).json({
            superheroes: responseData,
            totalPages,
            currentPage: page,
            nextPageUrl,
            prevPageUrl,
        });


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while fetching superheroes' });
    }
};

export const getSuperheroById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const superhero = await Superhero.findById(id);

        if (!superhero) {
            return res.status(404).json({ message: 'Superhero not found' });
        }

        return res.status(200).json(superhero);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error during superhero getting' });
    }
};

export const updateSuperhero = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const superhero = await Superhero.findById(id);
        if (!superhero) {
            return res.status(404).json({ message: 'Superhero not found' });
        }

        const fieldsToUpdate = ['nickname', 'real_name', 'origin_description', 'superpowers', 'catch_phrase'];
        fieldsToUpdate.forEach(filed => {
            if (updateData[filed]) {
                (superhero as any)[filed] = updateData[filed];
            }
        })

        const newImagePaths: string[] = [];
        if (req.files && Array.isArray(req.files) && req.files.length > 0) {
            (req.files as Express.Multer.File[]).forEach(file => {
                newImagePaths.push(`/uploads/${file.filename}`);
            });
        }

        const imagesToRemove: string[] = JSON.parse(updateData.imagesToRemove || '[]');

        if (imagesToRemove.length > 0) {
            superhero.images = superhero.images.filter(imagePath => {
                const shouldRemove = imagesToRemove.includes(imagePath);
                if (shouldRemove) {
                    deleteFile(imagePath);
                }
                return !shouldRemove;
            });
        }

        if (newImagePaths.length > 0) {
            superhero.images.push(...newImagePaths);
        }

        await superhero.save();

        res.status(200).json({
            message: 'Superhero updated successfully',
            superhero
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while updating superhero' });
    }
};

export const deleteSuperhero = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const superhero = await Superhero.findById(id);

        if (!superhero) {
            return res.status(404).json({ message: 'Superhero not found' });
        }

        await superhero.deleteOne();

        superhero.images.forEach(imagePath => {
            deleteFile(imagePath);
        });

        res.status(200).json({ message: 'Superhero and associated images deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while deleting superhero' });
    }
};