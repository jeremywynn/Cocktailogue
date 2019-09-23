describe('Unit test the add item functionality', function() {
  beforeEach(() => {
    cy.visit('/')
  })
  it('the add item button exists', () => {
    cy.get('#add-item')
  })
})