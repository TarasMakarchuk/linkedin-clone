beforeEach(() => {
  cy.visit('/');
});

describe('AuthModule', () => {

  it('should redirect to auth page if not signed in', () => {
    cy.url().should('includes', 'auth');
  });

  it('should have a disabled sign in button', () => {
    cy.get('ion-button')
      .should('contain', 'Sign in')
      .should('have.attr', 'disabled');
  });

  it('should have a disabled register button', () => {
    cy.get('ion-text.toggle-auth-mode').click();
    cy.get('ion-button')
      .should('contain', 'Accept &')
      .should('have.attr', 'disabled');
  });

  it('should register and toggle to login form', () => {
    cy.get('ion-text.toggle-auth-mode').click();
    cy.fixture('user').then((newUser) => {
      const { firstName, lastName, email, password } = newUser;
      console.log(firstName, lastName, email, password);
      cy.register(firstName, lastName, email, password);
      cy.get('ion-button')
        .should('contain', 'Accept &');
    });
  });

  it('should login and go to /home', () => {
    cy.fixture('user').then((user) => {
      const { email, password } = user;
      cy.login(email, password);
      cy.get('ion-button').should('not.have.attr', 'disabled');
      cy.get('ion-button').click();

      cy.url().should('not.include', 'auth');
      cy.url().should('includes', 'home');
      cy.wait(2000);
    });
  });

  it('should logout and go to /auth login page', () => {
    cy.fixture('user').then((user) => {
      const {email, password} = user;
      cy.login(email, password);
      cy.get('ion-button').click();

      cy.get('ion-col.popover-menu').click();
        cy.get('p.sign-out').click();
        cy.url().should('not.include', 'home');
        cy.url().should('includes', 'auth');
    });
  });
});
