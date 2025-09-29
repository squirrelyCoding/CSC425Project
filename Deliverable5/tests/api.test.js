const request = require('supertest');
const app = require('../server');

describe('API Route Tests', () => {
  it('should create a new message', async () => {
    const res = await request(app)
      .post('/api/messages')
      .send({ text: 'Hello World' })
      .set('Accept', 'application/json');
    expect(res.status).toBe(201);
    expect(res.body.text).toBe('Hello World');
  });

  it('should fetch all messages', async () => {
    const res = await request(app).get('/api/messages');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should fetch a specific message', async () => {
    const message = await request(app)
      .post('/api/messages')
      .send({ text: 'Test Message' });
    const res = await request(app).get(`/api/messages/${message.body._id}`);
    expect(res.status).toBe(200);
    expect(res.body.text).toBe('Test Message');
  });

  it('should update a message', async () => {
    const message = await request(app)
      .post('/api/messages')
      .send({ text: 'Old Message' });
    const res = await request(app)
      .put(`/api/messages/${message.body._id}`)
      .send({ text: 'Updated Message' });
    expect(res.status).toBe(200);
    expect(res.body.text).toBe('Updated Message');
  });

  it('should delete a message', async () => {
    const message = await request(app)
      .post('/api/messages')
      .send({ text: 'Message to Delete' });
    const res = await request(app).delete(`/api/messages/${message.body._id}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Deleted');
  });
});
