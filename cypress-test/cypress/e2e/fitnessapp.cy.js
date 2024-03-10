// base url configured in cypress.config.js

describe('The login page', () => {
  beforeEach(function () {
    cy.visit('/')
  })
  it('Loads the application', () => {
    // should connect to the login page 
    cy.url().should('include', '/login')
    
  })
  it('fails to login for unregistered user', () => {
    // alias this route so we can wait on it later
    cy.intercept('POST', '/auth/login').as('postLogin')

    //fail an unregistered user 
    cy.get('#formUsername').type('fakeUser')
    cy.get('#formPassword').type('incorrectPassword{enter}')

    // wait for the response 
    cy.wait('@postLogin')

    // error is visible
    cy.get('.alert-danger')
    .should('be.visible')
    .and('contain', 'Failed to login')
    
  })
})

// sign up 
// login 
// logout 
// how to setup test config with test database?