import mongoose, { Document, Schema } from 'mongoose';

export interface ISuperhero extends Document {
    nickname: string;
    real_name: string;
    origin_description: string;
    superpowers: string[];
    catch_phrase: string;
    image: string[];
    createdAt: Date;
    updatedAt: Date;

}

const SuperheroSchema: Schema = new Schema({
    nickname: { type: String, required: true },
    real_name: { type: String, required: true },
    origin_description: { type: String, required: true },
    superpowers: { type: [String], required: true },
    catch_phrase: { type: String, required: true },
    image: { type: [String], required: true },
}, { timestamps: true });

const Superhero = mongoose.model<ISuperhero>('Superhero', SuperheroSchema);

export default Superhero;