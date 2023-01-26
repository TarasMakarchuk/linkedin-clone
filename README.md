![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![Typeorm](https://img.shields.io/badge/{_Typeorm_}-%21E0234E.svg?style=for-the-badge&logo=typeorm&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![Ionic](https://img.shields.io/badge/Ionic-%233880FF.svg?style=for-the-badge&logo=Ionic&logoColor=white)
![NPM](https://img.shields.io/badge/NPM-%23000000.svg?style=for-the-badge&logo=npm&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)
![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)
![WebStorm](https://img.shields.io/badge/webstorm-143?style=for-the-badge&logo=webstorm&logoColor=white&color=black)
___
## Description `📄`
This project is an attempt to replicate the limited functionality of the application "Linkedin".
Implemented design for mobile devices.
---
This project implements such functions as jwt authorization, roles, registration of new users, 
adding friends, adding posts, sending messages to friends in private chats.
___

## Installation on the Client and the Server`☕`
```bash
$ npm install
or
$ yarn install
```
___

## Setup environment on the Server`🔧`
```bash
# development mode
1. Create inside server dir file .env
2. Copy content from .env.dist to .env
3. correct inside the .env file the data to the required

```
___

## Run migrations on the Server
```bash
# generate migrations
$ npm run migration:generate -- db/migrations/migration_name

# run migrations
$ npm run migration:run
```

## Run the app on the Server`🚀`
```bash

# development mode
$ npm run start:dev
or
$ yarn start:dev
```
## Tests on the Server`🐛`

```bash
# unit tests
$ npm run test
$ yarn test

# e2e tests
$ npm run test:e2e
$ yarn test:e2e

# test coverage
$ npm run test:cov
$ yarn test:cov
```
______

## Running the app on the Client`🚀`
```bash

# development mode
$ ionic serve
```
___

## Tests on the Client `🐛`

```bash
# unit tests
$ ng test
or
$ ng test auth.page.spec.ts

# e2e tests
$ npm run cypress:open
$ npm run cypress:run

$ yarn test:cypress:open
$ yarn test:cypress:run

# test coverage
$ ng test --no-watch --code-coverage
```
___
