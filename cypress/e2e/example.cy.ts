// https://on.cypress.io/api

describe('loading & router', () => {
    it('visits the app root url', () => {
      cy.visit('/')
      cy.contains('h5', 'Welcome')
    })
  
    it('should not allow you to chat without username', () => {
      cy.visit('/chat')
      cy.location('pathname').should('eq', '/')
      cy.contains('h5', 'Welcome')
    })
  
    it('should let you chat after you supply a username', () => {
      cy.visit('/')
      cy.contains('h5', 'Welcome')
      cy.get('#username').type('cypress test')
      cy.get('button').click()
      cy.location('pathname').should('eq', '/chat')
      cy.get('input').type('hello from cypress')
      cy.get('button').click()
      cy.contains('li', 'cypress test')
      cy.contains('li', 'hello from cypress')
    })
  })
  