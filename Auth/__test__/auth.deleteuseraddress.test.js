const request = require('supertest');
const userModel = require('../src/models/user.model');
const app = require('../src/app');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const redis = require('../src/db/redis');

let user;

beforeEach(async () => {
    await userModel.deleteMany({});
    const password = "Secret123!";
    const hash = await bcrypt.hash(password, 10);

    user = await userModel.create({
        username: 'john_doe',
        email: "test@example.com",
        password: hash,
        fullname: {
            firstname: "John",
            lastname: 'Doe'
        },
        role: 'user',
        addresses: [{
            street: '123 Test Lane',
            city: 'Mumbai',
            state: 'Maharashtra',
            country: 'India',
            zip: '400001'
        }]
    });
});

describe('DELETE /user/me/addresses/:addressesId', () => {

    it('returns 200 and delete the list of addresses when valid token cookie is present', async () => {
        const addressId = user.addresses[0]._id.toString();
        const loginRes = await request(app).post('/api/auth/login').send({
            email: "test@example.com",
            password: "Secret123!"
        });

        const cookie = loginRes.headers['set-cookie'][0];
        const res = await request(app)
            .delete(`/api/auth/user/me/addresses/${addressId}`)
            .set('Cookie', cookie);

        expect(res.statusCode).toBe(200);
        expect(res.body.address).toBeDefined();
        expect(res.body.address.length).toBe(0);
    });

    it('returns 401 when no auth cookie is provided', async () => {
        const addressId = user.addresses[0]._id.toString();
        const res = await request(app)
            .delete(`/api/auth/user/me/addresses/${addressId}`);

        expect(res.statusCode).toBe(401);
    });

    it('returns 401 invalid token in cookie', async () => {
        const addressId = user.addresses[0]._id.toString();
        const fakeToken = jwt.sign({ id: "0000000000" }, 'wrong_secret');
        const res = await request(app)
            .delete(`/api/auth/user/me/addresses/${addressId}`)
            .set('Cookie', [`token=${fakeToken}`]);

        expect(res.statusCode).toBe(401);
    });

    it('returns 401 when token is blacklisted', async () => {
       
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({
                email: "test@example.com",
                password: "Secret123!"
            });

        const cookie = loginRes.headers['set-cookie'][0];
        const token = cookie.split(';')[0].split('=')[1];

        await redis.set(`blacklist_${token}`, 'true', 'EX', 3600);

        const addressId = user.addresses[0]._id.toString();

        const res = await request(app)
            .delete(`/api/auth/user/me/addresses/${addressId}`)
            .set('Cookie', cookie);

        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe('Token has been blacklisted');
    });
});