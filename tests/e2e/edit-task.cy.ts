import { createTask, signUpAndOpenTasks } from "../support/task-flows";

describe("edit a task", () => {
  it("saves updated task details", () => {
    const originalTitle = "Review first draft";
    const updatedTitle = "Review revised draft";
    const updatedDescription = "Add the new feedback before sharing.";

    signUpAndOpenTasks();
    createTask(originalTitle, "Review the initial version.");
    cy.contains(".task-row", originalTitle).contains("a", "Edit").click();

    cy.location("pathname").should("match", /\/tasks\/[^/]+\/edit$/);
    cy.get("#title").clear().type(updatedTitle);
    cy.get("#description").clear().type(updatedDescription);
    cy.contains("button", "Save changes").click();

    cy.location("pathname").should("eq", "/tasks");
    cy.get('[role="status"]').should("contain.text", "Task updated.");
    cy.contains(".task-row", updatedTitle)
      .should("contain.text", updatedDescription)
      .and("be.visible");
    cy.contains(".task-title", originalTitle).should("not.exist");
  });
});