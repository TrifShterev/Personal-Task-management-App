export function signUpAndOpenTasks() {
  const uniqueId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  cy.visit("/sign-up");
  cy.intercept("POST", "/api/forms/sign-up", (request) => {
    expect(request.headers.origin).to.equal(new URL(request.url).origin);
  });
  cy.get("#name").type("Cypress User");
  cy.get("#email").type(`cypress-${uniqueId}@example.test`);
  cy.get("#password").type("CypressTestPassword123!");
  cy.contains("button", "Create account").click();

  cy.location("pathname").should("eq", "/tasks");
  cy.get('[role="status"]').should("contain.text", "Your account is ready.");
}

export function createTask(title: string, description: string) {
  cy.contains("a", "New task").click();
  cy.location("pathname").should("eq", "/tasks/new");
  cy.get("#title").type(title);
  if (description) {
    cy.get("#description").type(description);
  }
  cy.contains("button", "Create task").click();

  cy.location("pathname").should("eq", "/tasks");
  cy.get('[role="status"]').should("contain.text", "Task created.");
  cy.contains(".task-title", title).should("be.visible");
}