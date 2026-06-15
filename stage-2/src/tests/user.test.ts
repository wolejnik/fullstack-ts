import express from 'express';
import request from 'supertest';
import myRouter from '../index'; 

const app = express();
app.use(express.json()); 
app.use('/users', myRouter); 

describe('Users Router Endpoints', () => {
  
  describe('GET /users', () => {
    it('should pass validation and return 200 with valid query parameters', async () => {
      const response = await request(app)
        .get('/users')
        .query({ page: '1', limit: '10' }); 

      // 🔍 DEBUG LOG FOR 500 CRASH
      if (response.status === 500) {
        console.log('\n🚨 GET 500 ERROR DETAILS:', response.text || response.body);
      }

      expect(response.status).toBe(200);
      expect(response.text).toBe('Fetching page 1 with limit 10');
    });

    it('should fail validation and return 400 with invalid query parameters', async () => {
      const response = await request(app)
        .get('/users')
        .query({ page: 'not-a-number', limit: '-5' });

      expect(response.status).toBe(400);
    });
  });

describe('POST /users', () => {
  it('should pass validation and return 201 with valid body data', async () => {
    // 🌟 Update this payload to include exactly what CreateUserDto wants:
    const validUser = {
      username: 'johndoe',         // 👈 Added missing username
      email: 'john@example.com',
    };

    const response = await request(app)
      .post('/users')
      .send(validUser);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(validUser);
  });

  it('should fail validation and return 400 when body data is invalid', async () => {
    const invalidUser = {
      username: '', 
      email: 'not-an-email', 
    };

    const response = await request(app)
      .post('/users')
      .send(invalidUser);

    expect(response.status).toBe(400);
  });
});

});