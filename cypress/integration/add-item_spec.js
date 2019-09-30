describe('Unit test the add item functionality', function() {
  beforeEach(() => {
    cy.visit('/')
  })
  it('the add item button exists', () => {
    cy.get('[data-entity=open-add-item-menu]')
  })
  it('the add item menu should start not being visible', () => {
    cy.get('[data-entity=add-item-menu]').should('be.hidden')
  })
  it('using the add item button reveals the add item menu', () => {
    cy.get('[data-entity=open-add-item-menu]').click()
    cy.get('[data-entity=add-item-menu]').should('be.visible')
  })
  it('the input type file form control for adding item json file exists', () => {
    cy.get('[data-entity=choose-json-file]')
  })
  it('using the choose-json-file form control works and the item preview appears with all pertinent controls', () => {
    const fileName = 'example1.json';
    cy.get('[data-entity=open-add-item-menu]').click()
    cy.fixture(fileName).then(fileJson => {
      const fileContent = JSON.stringify(fileJson)
      cy.get('input[type="file"]').upload({ fileContent, fileName, mimeType: 'application/json' })
    })
    cy.get('[data-entity=item-preview]').should('be.visible')
    cy.get('[data-entity=add-item-action]').should('be.visible')
    cy.get('[data-entity=cancel-add-item]').should('be.visible')
  })
  it('the cancel-add-item action should close the item preview area', () => {
    const fileName = 'example1.json';
    cy.get('[data-entity=open-add-item-menu]').click()
    cy.fixture(fileName).then(fileJson => {
      const fileContent = JSON.stringify(fileJson)
      cy.get('input[type="file"]').upload({ fileContent, fileName, mimeType: 'application/json' })
    })
    cy.get('[data-entity=cancel-add-item]').click()
    cy.get('[data-entity=item-preview]').should('be.hidden')
  })
})