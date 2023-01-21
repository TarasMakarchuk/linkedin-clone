// ***********************************************
// This example namespace declaration will help
// with Intellisense and code completion in your
// IDE or Text Editor.
// ***********************************************
// import type = Mocha.utils.type;

declare namespace Cypress {
  interface Chainable<Subject = any> {
    register(
      firstName: string,
      lastName: string,
      email: string,
      password: string
    ): typeof register;
  }

  interface Chainable<Subject = any> {
    login (
      email: string,
      password: string
    ): typeof login;
  }

}

function register(
  firstName: string,
  lastName: string,
  email: string,
  password: string
): void {
  cy.get('ion-input[name="firstName"]').type(firstName);
  cy.get('ion-input[name="lastName"]').type(lastName);
  cy.get('ion-input[name="email"]').type(email);
  cy.get('ion-input[name="password"]').type(password);
  cy.get('ion-button').should('not.have.attr', 'disabled');
  cy.get('ion-button').click();
}

function login(
  email: string,
  password: string
): void {
  cy.get('ion-input[name="email"]').type(email);
  cy.get('ion-input[name="password"]').type(password);
  cy.get('ion-button').should('not.have.attr', 'disabled');
}
//
// NOTE: You can use it like so:
Cypress.Commands.add('register', register);
Cypress.Commands.add('login', login);
//
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
