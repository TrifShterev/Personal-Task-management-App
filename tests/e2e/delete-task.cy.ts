import { createTask, signUpAndOpenTasks } from "../support/task-flows";

describe("delete a task", () => {
  it("removes the task after confirmation", () => {
    const title = "Archive completed item";

    signUpAndOpenTasks();
    createTask(title, "This task should be removed.");
    cy.contains(".task-row", title).contains("a", "Delete").click();

    cy.location("pathname").should("match", /\/tasks\/[^/]+\/delete$/);
    cy.get(".confirm-panel").should("contain.text", title);
    cy.contains("button", "Delete task").click();

    cy.location("pathname").should("eq", "/tasks");
    cy.get('[role="status"]').should("contain.text", "Task deleted.");
    cy.contains(".task-title", title).should("not.exist");
  });
});