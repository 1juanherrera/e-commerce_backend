const request = require('supertest');
const app = require('../app');
const ProductImg = require('../models/ProductImg');
require('../models')

let token;
let productId;

beforeAll(async() => {
    const credentials = {
        email: "test@gmail.com",
        password: "test1234"
    }
    const res = await request(app)
        .post('/users/login')
        .send(credentials);
    token = res.body.token;
})

test('POST /products should create a product', async() => {
    const products = {
        title: "Iphone 14",
        description: "Pantalla de 6,1 pulgadas (15 cm) con tecnología Super Retina XDR OLED con una resolución de 2532×1170 píxeles y una densidad de píxeles de aproximadamente 460 PPI con una frecuencia de actualización de 60 Hz",
        price: "5.990.000",
    }
    const res = await request(app)
        .post('/products')
        .send(products)
        .set('Authorization', `Bearer ${token}`);
    productId = res.body.id;
    expect(res.status).toBe(201);
    expect(res.body.title).toBe(products.title)
})

test('GET /products should return all products', async() => {
    const res = await request(app).get('/products')
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(0);
})

test('POST /products/:id/images should set the products images', async() => {
    const image = await ProductImg.create({ url: "auwhe8217", filename: "128hdnd"})
    const res = await request(app)
        .post(`/products/${productId}/images`)
        .send([image.id])
        .set('Authorization', `Bearer ${token}`);
        await image.destroy();
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
})
 
test('PUT /products/:id should update an user', async() => {
    const body = {
        title: "Iphone 14 updated"
    }
    const res = await request(app)
        .put(`/products/${productId}`)
        .send(body)
        .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200);
    expect(res.body.title).toBe(body.title);    
})

test('DELETE /products/:id should delete one user', async() => {
    const res = await request(app)
        .delete(`/products/${productId}`)
        .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(204);
})