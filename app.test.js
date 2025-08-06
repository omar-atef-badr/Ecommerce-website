import supertest from 'supertest';
import app from './app.js';
import { describe, test } from 'vitest' //identical to jest but with an ES-module compatible API
//I attempted to use jest but it was not working with the ES-module syntax
//and as a result have been advised by practical demonstrators to use vitest, as both jest and vitest APIs are nearly-identical

let productID;

describe('Test the Get Fit! service', () => {
    test('GET /api/v1/products succeeds', () => {
        return supertest(app)
	        .get('/api/v1/products')
	        .expect(200);
    });

    test('GET /api/v1/products returns JSON', () => {
        return supertest(app)
	        .get('/api/v1/products')
	        .expect('Content-type', /json/);
    });

    test('GET /api/v1/products includes Adidas Classic T-shirt', () => {
        return supertest(app)
	        .get('/api/v1/products')
	        .expect(/Adidas Classic T-shirt/);
    });

    test('GET /api/v1/products/:id succeeds', () => {
        return supertest(app)
	        .get('/api/v1/products/580ab068-319b-4156-baca-31d02300266c')
	        .expect(200);
    });

    test('GET /api/v1/products/580ab068-319b-4156-baca-31d02300266c returns JSON', () => {
        return supertest(app)
	        .get('/api/v1/products/580ab068-319b-4156-baca-31d02300266c')
	        .expect('Content-type', /json/);
    });

    test('GET /api/v1/products/580ab068-319b-4156-baca-31d02300266c includes 100', () => {
        return supertest(app)
	        .get('/api/v1/products/580ab068-319b-4156-baca-31d02300266c')
	        .expect(/100/);
    });

    test('GET /api/v1/products/101 fails', () => {
        return supertest(app)
	        .get('/api/v1/products/101')
	        .expect(404);
    });

    test('POST /api/v1/products succeeds', () => {
        const params = {'title': 'TestShirt', 'price': 100, 'rating': 5, 'image_url': 'https://images-na.ssl-images-amazon.com/images/I/61pBJEYe2BL._AC_UL600_SR600,600_.jpg', 'stock_count': 0};
        return supertest(app)
            .post('/api/v1/products')
            .send(params)
            .expect(201)
            .then(postResponse => {
                productID = postResponse.body.data.product.id;
            });
    });

    test('POST /api/v1/products returns JSON', () => {
        const params = {'title': 'TestShirt2', 'price': 100, 'rating': 5, 'image_url': 'https://images-na.ssl-images-amazon.com/images/I/61pBJEYe2BL._AC_UL600_SR600,600_.jpg', 'stock_count': 0};
        return supertest(app)
	        .post('/api/v1/products')
            .send(params)
	        .expect('Content-type', /json/);
    });


    test('GET /api/v1/products includes TestShirt after previous POST', () => {
        return supertest(app)
	        .get('/api/v1/products')
	        .expect(/TestShirt/);
    });

    test('GET /api/v1/sellers succeeds', () => {
        return supertest(app)
	        .get('/api/v1/products')
	        .expect(200);
    });

    test('GET /api/v1/sellers returns JSON', () => {
        return supertest(app)
	        .get('/api/v1/sellers')
	        .expect('Content-type', /json/);
    });

    test('GET /api/v1/sellers includes Nike', () => {
        return supertest(app)
	        .get('/api/v1/sellers')
	        .expect(/Puma/);
    });

    test('GET /api/v1/sellers/:id succeeds', () => {
        return supertest(app)
	        .get('/api/v1/sellers/0a0eba65-d485-4a05-b3d0-d1bc9767604b')
	        .expect(200);
    });

    test('GET /api/v1/sellers/0a0eba65-d485-4a05-b3d0-d1bc9767604b returns JSON', () => {
        return supertest(app)
	        .get('/api/v1/products/0a0eba65-d485-4a05-b3d0-d1bc9767604b')
	        .expect('Content-type', /json/);
    });

    test('GET /api/v1/sellers/0a0eba65-d485-4a05-b3d0-d1bc9767604b includes Nike', () => {
        return supertest(app)
	        .get('/api/v1/sellers/0a0eba65-d485-4a05-b3d0-d1bc9767604b')
	        .expect(/Nike/);
    });

    test('GET /api/v1/sellers/101 fails', () => {
        return supertest(app)
	        .get('/api/v1/sellers/101')
	        .expect(404);
    });

    test('PATCH /api/v1/products/59c577af-0372-4410-8275-cc35c02b6694/buy succeeds', () => {
        return supertest(app)
	        .patch('/api/v1/products/59c577af-0372-4410-8275-cc35c02b6694/buy')
	        .expect(200);
    });

    test('PATCH /api/v1/products/59c577af-0372-4410-8275-cc35c02b6694/buy returns JSON', () => {
        return supertest(app)
	        .patch('/api/v1/products/59c577af-0372-4410-8275-cc35c02b6694/buy')
	        .expect('Content-type', /json/);
    });

    test('PATCH /api/v1/products/59c577af-0372-4410-8275-cc35c02b6694/buy includes Nike', () => {
        return supertest(app)
	        .patch('/api/v1/products/59c577af-0372-4410-8275-cc35c02b6694/buy')
	        .expect(/Nike/);
    });

    test('PATCH /api/v1/products/101/buy fails', () => {
        return supertest(app)
	        .patch('/api/v1/products/101/buy')
	        .expect(404);
    });

    test('PATCH /api/v1/products/59c577af-0372-4410-8275-cc35c02b6694/buy with quantity 2 succeeds', () => {
        return supertest(app)
            .patch('/api/v1/products/59c577af-0372-4410-8275-cc35c02b6694/buy')
            .send({'quantity': 2})
            .expect(200);
    });

    test('PATCH /api/v1/products/59c577af-0372-4410-8275-cc35c02b6694/buy with quantity 1000 fails', () => {
        return supertest(app)
            .patch('/api/v1/products/59c577af-0372-4410-8275-cc35c02b6694/buy')
            .send({'quantity': 1000})
            .expect(400);
    });

    test('PATCH /api/v1/products/${productID}/buy with quantity 1 fails as its out of stock', () => {
        return supertest(app)
            .patch(`/api/v1/products/${productID}/buy`)
            .send({'quantity': 1})
            .expect(400);
    });
});