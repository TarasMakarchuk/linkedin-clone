import { User } from '../src/auth/entity/user.class';
import * as request from 'supertest';
import { HttpStatus } from '@nestjs/common';

describe('AuthController (e2e)', () => {
  const authUrl = `http://localhost:5001/api/auth`;

  const mockUser: User = {
    firstName: 'firstName',
    lastName: 'lastName',
    email: 'email@gmail.com',
    password: 'password',
  };

  describe('auth/register (POST)', () => {
    it('It should register a user and return the new user object', () => {
      return request(authUrl)
          .post('/registration')
          .set('Accept', 'application/json')
          .send(mockUser)
          .expect((response: request.Response) => {
            const { id, firstName, lastName, email, password, imagePath, role } = response.body;

            expect(typeof id).toBe('number');
            expect(firstName).toEqual(mockUser.firstName);
            expect(lastName).toEqual(mockUser.lastName);
            expect(email).toEqual(mockUser.email);
            expect(password).toBeUndefined();
            expect(imagePath).toBeNull();
            expect(role).toEqual('user');
          })
          .expect(HttpStatus.CREATED);
    });
  });
});
