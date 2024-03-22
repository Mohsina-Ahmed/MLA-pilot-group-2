// base url configured in cypress.config.js

// run through docker compose to enable database connection?

describe('Load App and Sign Up', () => {
  beforeEach(function () {
    // cy.visit('/')   
    cy.visit(Cypress.env('baseUrl'))   
  })
  before(() => {
    // cy.task('connectAndCleanDB')
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
    cy.get('#formUsername').type(Cypress.env('wrongUsername'))
    cy.get('#formPassword').type(`${Cypress.env('wrongPassword')}{enter}`)

    // wait for the response 
    // cy.wait('@postLogin')

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
    cy.get('#formBasicEmail').type(Cypress.env('testUsername'))
    cy.get('#formBasicPassword').type(`${Cypress.env('testSimplePassword')}{enter}`)
    
    // error is visible
    cy.get('.alert-danger')
    .should('be.visible')
    .and('contain', 'Password')
    
    // login in on new user
    cy.get('#formBasicEmail').clear().type(Cypress.env('testUsername'))
    cy.get('#formBasicPassword').clear().type(`${Cypress.env('testPassword')}{enter}`)
    
    // loads home page 
    cy.url().should('include', '/homepage')
  })
  it('Sign up fails on user that exists', () => {
    // verify the link to sign up page
    cy.get('a').should('have.attr', 'href').and('equal', '/signup')

    // load signup page 
    cy.get('a').click()
    cy.url().should('include', '/signup')
      
    // Fails on a registered user
    cy.get('#formBasicEmail').clear().type(Cypress.env('testUsername'))
    cy.get('#formBasicPassword').clear().type(`${Cypress.env('testPassword')}{enter}`)
    
    // Error is visible
    cy.get('.alert-danger')
    .should('be.visible')
    .and('contain', 'User already exists')
  })
  it('login with a registered user', () => {
    // alias this route so we can wait on it later
    cy.intercept('POST', '/auth/login').as('postLogin')

    //login with test user
    cy.get('#formUsername').type(Cypress.env('testUsername'))
    cy.get('#formPassword').type(`${Cypress.env('testPassword')}{enter}`)
    
    // wait for the response 
    cy.wait('@postLogin')

    // loads home page 
    cy.url().should('include', '/homepage')
  })
})

describe('Login and do stuff', () => {
  it('login', function() {
      cy.login(Cypress.env('testUsername'), Cypress.env('testPassword'))
  })
})
// login 
// track an exercise
// logout 