import request from 'supertest';
import app from '@app';
import Superhero from '@models/Superhero';
import path from 'path';
import fs from 'fs';

jest.mock('fs', () => ({
    ...jest.requireActual('fs'),
    unlink: jest.fn((path, callback) => callback(null)),
}));

const superheroData = {
    nickname: 'TestHero',
    real_name: 'Test User',
    origin_description: 'Test origin',
    superpowers: 'Test power 1, Test power 2',
    catch_phrase: 'Test catchphrase'
};

const testImagePath1 = path.join(__dirname, '..', '..', 'test1.jpg');
const testImagePath2 = path.join(__dirname, '..', '..', 'test2.jpg');

describe('Superhero Controller', () => {
    describe('POST /superheroes/create', () => {
        it('should create a new superhero with images', async () => {
            const response = await request(app)
                .post('/superheroes/create')
                .field('nickname', superheroData.nickname)
                .field('real_name', superheroData.real_name)
                .field('origin_description', superheroData.origin_description)
                .field('superpowers', superheroData.superpowers)
                .field('catch_phrase', superheroData.catch_phrase)
                .attach('images', testImagePath1)
                .attach('images', testImagePath2)
                .expect(201);

            expect(response.body.message).toBe('Superhero created successfully');
            expect(response.body.superhero).toBeDefined();
            expect(response.body.superhero).toHaveProperty('_id');
            expect(response.body.superhero.nickname).toBe(superheroData.nickname);
            expect(response.body.superhero.images).toBeDefined();
            expect(response.body.superhero.images.length).toBe(2);

            const superhero = await Superhero.findById(response.body.superhero._id);
            expect(superhero).toBeDefined();
            expect(superhero?.nickname).toBe(superheroData.nickname);
            expect(superhero?.images.length).toBe(2);
        });

        it('should return 400 error if required fields are missing', async () => {
            const response = await request(app)
                .post('/superheroes/create')
                .field('nickname', superheroData.nickname)
                .field('real_name', superheroData.real_name)
                .field('origin_description', superheroData.origin_description)
                .field('superpowers', superheroData.superpowers)
                .attach('images', testImagePath1)
                .attach('images', testImagePath2)
                .expect(400);

            expect(response.body.message).toBe('All fields are required');
            expect(response.body.superhero).toBeUndefined();
        });

        it('should return 400 error if superhero already exists', async () => {
            await request(app)
                .post('/superheroes/create')
                .field('nickname', superheroData.nickname)
                .field('real_name', superheroData.real_name)
                .field('origin_description', superheroData.origin_description)
                .field('superpowers', superheroData.superpowers)
                .field('catch_phrase', superheroData.catch_phrase)
                .attach('images', testImagePath1)
                .attach('images', testImagePath2)
                .expect(201);

            const response = await request(app)
                .post('/superheroes/create')
                .field('nickname', superheroData.nickname)
                .field('real_name', superheroData.real_name)
                .field('origin_description', superheroData.origin_description)
                .field('superpowers', superheroData.superpowers)
                .field('catch_phrase', superheroData.catch_phrase)
                .attach('images', testImagePath1)
                .attach('images', testImagePath2)
                .expect(400);

            expect(response.body.message).toBe('Superhero already exists');
            expect(response.body.superhero).toBeUndefined();
        });

        it('should return 400 error if superhero already exists', async () => {
            const response = await request(app)
                .post('/superheroes/create')
                .field('nickname', superheroData.nickname)
                .field('real_name', superheroData.real_name)
                .field('origin_description', superheroData.origin_description)
                .field('superpowers', superheroData.superpowers)
                .field('catch_phrase', superheroData.catch_phrase)
                .expect(400);

            expect(response.body.message).toBe('No images were uploaded');
            expect(response.body.superhero).toBeUndefined();
        });
    });

    describe('GET /superheroes/all', () => {
        it('should get a paginated list of superheroes', async () => {
            await Superhero.create({ ...superheroData, nickname: 'Hero1', images: ['/uploads/1.jpg'] });
            await Superhero.create({ ...superheroData, nickname: 'Hero2', images: ['/uploads/2.jpg'] });
            await Superhero.create({ ...superheroData, nickname: 'Hero3', images: ['/uploads/3.jpg'] });
            await Superhero.create({ ...superheroData, nickname: 'Hero4', images: ['/uploads/4.jpg'] });
            await Superhero.create({ ...superheroData, nickname: 'Hero5', images: ['/uploads/5.jpg'] });
            await Superhero.create({ ...superheroData, nickname: 'Hero6', images: ['/uploads/6.jpg'] });

            const response = await request(app)
                .get('/superheroes/all?page=1&limit=5')
                .expect(200);

            expect(response.body.superheroes.length).toBe(5);
            expect(response.body.totalPages).toBe(2);
            expect(response.body.currentPage).toBe(1);
            expect(response.body.nextPageUrl).toBe('/superheroes/all?page=2&limit=5');
            expect(response.body.prevPageUrl).toBeNull();
        });

        it('should get a prevPageUrl', async () => {
            await Superhero.create({ ...superheroData, nickname: 'Hero1', images: ['/uploads/1.jpg'] });
            await Superhero.create({ ...superheroData, nickname: 'Hero2', images: ['/uploads/2.jpg'] });
            await Superhero.create({ ...superheroData, nickname: 'Hero3', images: ['/uploads/3.jpg'] });
            await Superhero.create({ ...superheroData, nickname: 'Hero4', images: ['/uploads/4.jpg'] });
            await Superhero.create({ ...superheroData, nickname: 'Hero5', images: ['/uploads/5.jpg'] });
            await Superhero.create({ ...superheroData, nickname: 'Hero6', images: ['/uploads/6.jpg'] });

            const response = await request(app)
                .get('/superheroes/all?page=2&limit=5')
                .expect(200);

            expect(response.body.superheroes.length).toBe(1);
            expect(response.body.totalPages).toBe(2);
            expect(response.body.currentPage).toBe(2);
            expect(response.body.nextPageUrl).toBeNull();
            expect(response.body.prevPageUrl).toBe('/superheroes/all?page=1&limit=5');
        });
    });

    describe('GET /superheroes/:id', () => {
        it('should get a superhero by ID', async () => {
            const newSuperhero = await Superhero.create(superheroData);

            const response = await request(app)
                .get(`/superheroes/${newSuperhero._id}`)
                .expect(200);

            expect(response.body.nickname).toBe(superheroData.nickname);
            expect(response.body.real_name).toBe(superheroData.real_name);
        });

        it('should return 404 if superhero not found', async () => {
            const nonExistentId = '60c72b2f9b1d8f5b4a1a4b4c';
            const response = await request(app)
                .get(`/superheroes/${nonExistentId}`)
                .expect(404);

            expect(response.body.message).toBe('Superhero not found');
        });
    });

    describe('PUT /superheroes/update/:id', () => {
        it('should update a superhero with new data and images', async () => {
            const newSuperhero = await Superhero.create({
                ...superheroData,
                images: ['/uploads/old_image.jpg']
            });

            const updatedData = {
                nickname: 'UpdatedHero',
                imagesToRemove: JSON.stringify(['/uploads/old_image.jpg']),
            };

            const response = await request(app)
                .put(`/superheroes/update/${newSuperhero._id}`)
                .field('nickname', updatedData.nickname)
                .field('imagesToRemove', updatedData.imagesToRemove)
                .attach('images', testImagePath1)
                .expect(200);

            expect(response.body.message).toBe('Superhero updated successfully');
            expect(response.body.superhero.nickname).toBe('UpdatedHero');
            expect(response.body.superhero.images.length).toBe(1);
        });

        it('should return 404 if superhero to update is not found', async () => {
            const nonExistentId = '60c72b2f9b1d8f5b4a1a4b4c';
            const response = await request(app)
                .put(`/superheroes/update/${nonExistentId}`)
                .field('nickname', 'NonExistentHero')
                .expect(404);

            expect(response.body.message).toBe('Superhero not found');
        });
    });

    describe('DELETE /superheroes/delete/:id', () => {
        it('should delete a superhero and its associated images', async () => {
            const newSuperhero = await Superhero.create(superheroData);

            const response = await request(app)
                .delete(`/superheroes/delete/${newSuperhero._id}`)
                .expect(200);

            expect(response.body.message).toBe('Superhero and associated images deleted successfully');

            const deletedSuperhero = await Superhero.findById(newSuperhero._id);
            expect(deletedSuperhero).toBeNull();
        });

        it('should return 404 if superhero to delete is not found', async () => {
            const nonExistentId = '60c72b2f9b1d8f5b4a1a4b4c';
            const response = await request(app)
                .delete(`/superheroes/delete/${nonExistentId}`)
                .expect(404);

            expect(response.body.message).toBe('Superhero not found');
        });
    });
});