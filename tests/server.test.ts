import request from 'supertest';
import { app, server } from '../server';

type Book = {
  id: number;
  title: string;
  author: string;
};

afterAll((done) => {
  server.close(done);
});

describe('GET /api/books', () => {
  it('should return a list of books', async () => {
    const response = await request(app).get('/api/books');
    expect(response.status).toBe(200);
    response.body.forEach((book: Book) => {
      expect(book).toHaveProperty('id');
      expect(book).toHaveProperty('title');
      expect(book).toHaveProperty('author');
    });
  });
});

describe('DELETE /api/books/:id', () => {
  it('should delete a book that exists', async () => {
    const response = await request(app).delete('/api/books/1');
    expect(response.status).toBe(204);

    const getResponse = await request(app).get('/api/books');
    expect(getResponse.body).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ id: 1 })]),
    );
  });

  it('should return 404 for a book that does not exist', async () => {
    const bookID = 999;
    const response = await request(app).delete(`/api/books/${bookID}`);
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: `Book with ID ${bookID} not found`,
    });
  });

  it('should delete the correct book', async () => {
    const initialResponse = await request(app).get('/api/books');
    const initialBooksCount = initialResponse.body.length;

    const response = await request(app).delete('/api/books/2');
    expect(response.status).toBe(204);

    const finalResponse = await request(app).get('/api/books');
    expect(finalResponse.body.length).toBe(initialBooksCount - 1);
    expect(finalResponse.body).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ id: 2 })]),
    );
  });
});
