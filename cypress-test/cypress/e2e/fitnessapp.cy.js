// base url configured in cypress.config.js

// run through docker compose to enable database connection?

describe('The login page', () => {
  beforeEach(function () {
    // cy.visit('/')   
    cy.visit(Cypress.env('baseUrl'))   
  })
  before(() => {
    cy.task('connectAndCleanDB')
  })
  it('Loads the application', () => {
    cy.visit(Cypress.env('baseUrl'))
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
  it('loads the sign up page and save new user', () => {
    // verify the link to sign up page
    cy.get('a').should('have.attr', 'href').and('equal', '/signup')

    // load signup page 
    cy.get('a').click()
    cy.url().should('include', '/signup')
    
    // fails on simple password
    cy.get('#formBasicEmail').type('testUser')
    cy.get('#formBasicPassword').type('simplePassword{enter}')
    
    // error is visible
    cy.get('.alert-danger')
    .should('be.visible')
    .and('contain', 'Password')
    
    // login in on new user
    cy.get('#formBasicEmail').clear().type('testUser')
    cy.get('#formBasicPassword').clear().type('Strong123!{enter}')
    
    // loads home page 
    cy.url().should('include', '/homepage')
  })
})

// sign up 
// login 
// logout 
// how to setup test config with test database?