// base url configured in cypress.config.js
// run through docker compose to enable database connection

describe('Load App and Sign Up', () => {
  beforeEach(function () {
    // cy.visit('/')   
    cy.visit(Cypress.env('baseUrl')) 
    cy.fixture('user').then(function (user) {
      this.user = user;
    })  
  })
  before(function () {
    cy.task('connectAndCleanDB')

  })
  it('Loads the application', function () {
    cy.visit(Cypress.env('baseUrl'))
    // should connect to the login page 
    cy.url().should('include', '/login')
    
  })
  it('fails to login for unregistered user', function () {
    // alias this route so we can wait on it later
    cy.intercept('POST', '/auth/login').as('postLogin')

    //fail an unregistered user 
    cy.get('#formUsername').type(this.user.wrongUsername)
    cy.get('#formPassword').type(`${this.user.wrongPassword}{enter}`)

    // wait for the response 
    // cy.wait('@postLogin')

    // error is visible
    cy.get('.alert-danger')
    .should('be.visible')
    .and('contain', 'Failed to login')
    
    cy.screenshot()
  })
  it('loads the sign up page and save new user', function () {
    // verify the link to sign up page
    cy.get('a').should('have.attr', 'href').and('equal', '/signup')

    // load signup page 
    cy.get('a').click()
    cy.url().should('include', '/signup')
    
    // fails on simple password
    cy.get('#username').type(this.user.testUsername)
    cy.get('#password').type(this.user.testSimplePassword)
    cy.get('#name').type(this.user.FirstName)
    cy.get('#surname').type(this.user.LastName)
    cy.get('#email').type(this.user.email)
    cy.get('#dob').type(this.user.DOB)
    cy.get('#height').type(this.user.Height)
    cy.get('#weight').type(this.user.Weight)

    cy.get('[data-cy="signup-button"]').click()
    
    // error is visible
    cy.get('.alert-danger')
    .should('be.visible')
    .and('contain', 'Password')
    
    // login in on new user
    cy.get('#username').clear().type(this.user.testUsername)
    cy.get('#password').clear().type(this.user.testPassword)

    cy.get('[data-cy="signup-button"]').click()
    
    // loads home page 
    cy.url().should('include', '/homepage')

    cy.screenshot()
  })
  it('Sign up fails on user that exists', function () {
    // verify the link to sign up page
    cy.get('a').should('have.attr', 'href').and('equal', '/signup')

    // load signup page 
    cy.get('a').click()
    cy.url().should('include', '/signup')
      
    // Fails on a registered user
    cy.get('#username').type(this.user.testUsername)
    cy.get('#password').type(this.user.testPassword)
    cy.get('#name').type(this.user.FirstName)
    cy.get('#surname').type(this.user.LastName)
    cy.get('#email').type(this.user.email)
    cy.get('#dob').type(this.user.DOB)
    cy.get('#height').type(this.user.Height)
    cy.get('#weight').type(this.user.Weight)

    cy.get('[data-cy="signup-button"]').click()

    // Error is visible
    cy.get('.alert-danger')
    .should('be.visible')
    .and('contain', 'User already exists')

    cy.screenshot()
  })
  it('login with a registered user', function () {
    // alias this route so we can wait on it later
    cy.intercept('POST', '/auth/login').as('postLogin')

    //login with test user
    cy.get('#formUsername').type(this.user.testUsername)
    cy.get('#formPassword').type(`${this.user.testPassword}{enter}`)
    
    // wait for the response 
    cy.wait('@postLogin')

    // loads home page 
    cy.url().should('include', '/homepage')

    cy.screenshot()
  })
})

describe('Login and Navigate the App', () => {
  beforeEach(function () {
    cy.fixture('user').then((user) => {
      this.user = user
    })  
  })
  it('login with registered user', function() {
      cy.login(this.user.testUsername, this.user.testPassword)
  })
  it('navigates to application routes', function() {
      cy.login(this.user.testUsername, this.user.testPassword)

      // navigation to track exercise page
      cy.contains('Track New Exercise').click()
      cy.url().should('include', '/trackExercise')

      // navigation to statistics page
      cy.contains('Statistics').click()
      cy.url().should('include', '/statistics_v2')

      // navigation to weekly journal page
      cy.contains('Weekly Journal').click()
      cy.url().should('include', '/journal_v2')
    
      // navigation to User profile page
      cy.contains('User Profile').click()
      cy.url().should('include', '/userProfile')

      // user log out 
      cy.contains('Logout').click()
      cy.url().should('include', '/login')
  })
  it('tracks a new activity', function() {
    cy.login(this.user.testUsername, this.user.testPassword)

    // navigation to track exercise page
    cy.contains('Track New Exercise').click()
    cy.url().should('include', '/trackExercise')

    // select an activity
    cy.get('[aria-label="Swimming"]').click()
    cy.get('[aria-label="Swimming"]').should('have.class', 'MuiIconButton-colorPrimary')  // has been highlighted

    // add a description
    cy.get('#description').type('this is an activity')

    //select a date?

    // enter a duration
    cy.get('#duration').type(60)
    
    //enter a distance
    cy.get('#distance').type(1)

    // the speed / pace / calories have been calculated
    cy.get('#speed').invoke('val').then(value => {      
      expect(parseFloat(value)).to.be.greaterThan(0)})
    cy.get('#pace').invoke('val').then(value => {      
      expect(parseFloat(value)).to.be.greaterThan(0)})
    cy.get('#calories').invoke('val').then(value => {      
      expect(parseFloat(value)).to.be.greaterThan(0)})

    // fail to submit with a missing value 
    cy.get('[aria-label="Save activity"]').click()
    cy.get('p[style="color: red;"]').should('be.visible')

    // add the mood 
    cy.get('[aria-label="Great"]').click()
    cy.get('[aria-label="Great"]').should('have.class', 'MuiIconButton-colorPrimary')  // has been highlighted

    cy.intercept('POST', '/exercises/add').as('addExercise')

    cy.get('[aria-label="Save activity"]').click()

    cy.wait('@addExercise').then((response) => {
      expect(response.response.statusCode).to.eq(200)

      cy.screenshot()
    })

  })
})

// login 
// track an exercise
// logout 