describe("Unit test the search functionality", function() {
  beforeEach(() => {
    cy.visit("/");
  });
  it("the search bar exists", () => {
    cy.get("#search-field");
  });
});
