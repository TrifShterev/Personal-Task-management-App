import { createTask, signUpAndOpenTasks } from "../support/task-flows";

describe("task completion", () => {
  it("marks a task complete and toggles it back to incomplete", () => {
    const title = "Send the project update";

    signUpAndOpenTasks();
    createTask(title, "");

    cy.contains(".task-row", title).within(() => {
      cy.get(".task-completion-toggle")
        .should("have.attr", "aria-pressed", "false")
        .click();
    });

    cy.contains(".task-row", title)
      .should("have.class", "task-row-completed")
      .within(() => {
        cy.get(".task-completion-toggle")
          .should("have.attr", "aria-pressed", "true")
          .and("have.css", "background-color", "rgb(22, 163, 74)");
      });

    cy.contains(".task-row", title).find(".task-completion-toggle").click();

    cy.contains(".task-row", title)
      .should("not.have.class", "task-row-completed")
      .find(".task-completion-toggle")
      .should("have.attr", "aria-pressed", "false");
  });
});