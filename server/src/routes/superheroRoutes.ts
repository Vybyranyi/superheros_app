import { createSuperhero, getSuperheroById, getSuperheroes } from "@controllers/superheroController";
import upload from "@middlewares/upload";
import { Router } from "express";

const router = Router();

router.post('/create', upload.array('images', 5), createSuperhero);
router.get('/all', getSuperheroes);
router.get('/:id', getSuperheroById);

export default router;