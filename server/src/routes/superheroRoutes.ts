import { createSuperhero, getSuperheroById, getSuperheroes, updateSuperhero } from "@controllers/superheroController";
import upload from "@middlewares/upload";
import { Router } from "express";

const router = Router();

router.post('/create', upload.array('images', 5), createSuperhero);
router.get('/all', getSuperheroes);
router.get('/:id', getSuperheroById);
router.put('/update/:id', upload.array('images', 5), updateSuperhero);

export default router;