import { createTask, signUpAndOpenTasks } from "../support/task-flows";

describe("create a task", () => {
  it("creates and displays a task for a new account", () => {
    const title = "Prepare project notes";
    const description = "Capture the decisions from today's planning session.";

    signUpAndOpenTasks();
    createTask(title, description);

    cy.contains(".task-row", title).should("contain.text", description);
  });
});