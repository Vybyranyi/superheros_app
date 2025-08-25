import { createSuperhero } from "@controllers/superheroController";
import { Router } from "express";

const router = Router();

router.post('/create', createSuperhero);

export default router;