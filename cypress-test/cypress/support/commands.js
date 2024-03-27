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
Cypress.Commands.add('login', (username, password) => {
    // confirm on the login page 
    cy.visit(Cypress.env('baseUrl'))
    
    cy.url().should('include', '/login')

    // intercept the login post
    cy.intercept('POST', '/auth/login').as('postLogin')

    //login with test user
    cy.get('#formUsername').type(username)
    cy.get('#formPassword').type(`${password}{enter}`)
    
    // wait for the response 
    cy.wait('@postLogin')

    // loads home page 
    cy.url().should('include', '/homepage')
 })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })