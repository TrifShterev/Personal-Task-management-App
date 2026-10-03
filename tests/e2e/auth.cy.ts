describe("authentication forms", () => {
  it("signs up, signs out, and signs back in", () => {
    const uniqueId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const email = `cypress-auth-${uniqueId}@example.test`;
    const password = "CypressTestPassword123!";

    cy.visit("/sign-up");
    cy.get("#name").type("Cypress Auth User");
    cy.get("#email").type(email);
    cy.get("#password").type(password);
    cy.contains("button", "Create account").click();
    cy.location("pathname").should("eq", "/tasks");

    cy.contains("button", "Sign out").click();
    cy.location("pathname").should("eq", "/sign-in");

    cy.get("#email").type(email);
    cy.get("#password").type(password);
    cy.contains("button", "Sign in").click();
    cy.location("pathname").should("eq", "/tasks");
    cy.get(".header-account").should("contain.text", "Cypress Auth User");
  });
});