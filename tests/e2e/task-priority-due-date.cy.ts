import { createTask, signUpAndOpenTasks } from "../support/task-flows";

describe("task priority and due date", () => {
  it("defaults priority to 3 and leaves the due date empty", () => {
    const title = "Task with defaults";

    signUpAndOpenTasks();
    createTask(title, "");

    cy.contains(".task-row", title).within(() => {
      cy.get(".task-priority").should("have.text", "Priority 3");
      cy.get(".task-due-date").should("not.exist");
      cy.contains("a", "Edit").click();
    });

    cy.get("#priority").should("have.value", "3");
    cy.get("#dueDate").should("have.value", "");
  });

  it("creates and edits a custom priority and due date", () => {
    const title = "Task with a deadline";
    const dueDate = "2026-11-03";

    signUpAndOpenTasks();
    cy.get(".page-heading button[data-hydrated='true']")
      .should("have.attr", "data-hydrated", "true")
      .click();
    cy.get("#title").type(title);
    cy.get("#priority").select("1");
    cy.get("#dueDate").type(dueDate);
    cy.contains("button", "Create task").click();

    cy.contains(".task-row", title).within(() => {
      cy.get(".task-priority").should("have.text", "Priority 1");
      cy.get(".task-due-date time").should("have.attr", "datetime", dueDate);
      cy.contains("a", "Edit").click();
    });

    cy.get("#priority").should("have.value", "1");
    cy.get("#dueDate").should("have.value", dueDate);
    cy.get("#priority").select("4");
    cy.get("#dueDate").clear();
    cy.contains("button", "Save changes").click();

    cy.contains(".task-row", title).within(() => {
      cy.get(".task-priority").should("have.text", "Priority 4");
      cy.get(".task-due-date").should("not.exist");
    });
  });
});