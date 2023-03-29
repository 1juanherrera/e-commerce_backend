const request = require('supertest');
const app = require('../app');
const Product = require('../models/Product');
require('../models')

let token;
let cartId;

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

test('POST /carts should create one cart', async() => {
    const product = await Product.create({
        title: "Iphone 14",
        description: "Pantalla de 6,1 pulgadas (15 cm) con tecnología Super Retina XDR OLED con una resolución de 2532×1170 píxeles y una densidad de píxeles de aproximadamente 460 PPI con una frecuencia de actualización de 60 Hz",
        price: "5.990.000",
    })
    const cart = {
        quantity: 1,
        productId: product.id
    }
    const res = await request(app)
            .post('/carts')
            .send(cart)
            .set('Authorization', `Bearer ${token}`);
        await product.destroy();
        cartId = res.body.id;
        expect(res.statusCode).toBe(201);
        expect(res.body.quantity).toBe(cart.quantity);
});

test('GET /carts should return all carts', async() => {
    const res = await request(app)
        .get('/carts')
        .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(0);
})

test('DELETE /cartñs/:id should delete a cart', async() => {
    const res = await request(app)
        .delete(`/carts/${cartId}`)
        .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(204);
})
