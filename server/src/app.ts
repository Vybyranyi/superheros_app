import express from "express";
import cors from "cors";
import superheroRoutes from "@routes/superheroRoutes";

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

//Routes
app.use('/superheroes', superheroRoutes);


export default app;