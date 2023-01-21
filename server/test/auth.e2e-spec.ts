import { HttpStatus } from '@nestjs/common';
import * as request  from 'supertest';
import * as jwt  from 'jsonwebtoken';
import { User } from '../src/auth/entity/user.class';

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
                    const {id, firstName, lastName, email, password, imagePath, role} = response.body;

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

        it('It should not register a new user if the passed email is already exists', () => {
            return request(authUrl)
                .post('/registration')
                .set('Accept', 'application/json')
                .send(mockUser)
                .expect(HttpStatus.BAD_REQUEST);
        });

        it('It should not log in nor return an JWT for unregistered user', () => {
            return request(authUrl)
                .post('/login')
                .set('Accept', 'application/json')
                .send({ email: 'doesnot@gmail.com', password: 'password' })
                .expect((response: request.Response) => {
                    const { token }: { token: string } = response.body;

                    expect(token).toBeUndefined();
                }).expect(HttpStatus.FORBIDDEN);
        });

        it('It should log and return a JWT for a registered user', () => {
            return request(authUrl)
                .post('/login')
                .set('Accept', 'application/json')
                .send(mockUser)
                .expect((response: request.Response) => {
                    const { token }: { token: string } = response.body;

                    expect(jwt.verify(token, 'secret')).toBeTruthy();
                }).expect(HttpStatus.OK);
        });
    });

});
