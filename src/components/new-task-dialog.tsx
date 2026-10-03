"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";

type NewTaskDialogProps = {
  children: ReactNode;
  openOnLoad?: boolean;
  triggerLabel?: string;
  triggerClassName?: string;
};

export function NewTaskDialog({
  children,
  openOnLoad = false,
  triggerLabel = "New task",
  triggerClassName = "button",
}: NewTaskDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    const dialog = dialogRef.current;

    if (openOnLoad && dialog && !dialog.open) {
      dialog.showModal();
    }
  }, [openOnLoad]);

  function clearDialogQuery() {
    if (!openOnLoad) {
      return;
    }

    const url = new URL(window.location.href);
    url.searchParams.delete("newTask");
    url.searchParams.delete("taskError");
    window.history.replaceState(
      null,
      "",
      `${url.pathname}${url.search}${url.hash}`,
    );
  }

  function closeDialog() {
    dialogRef.current?.close();
  }

  function closeFromBackdrop(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) {
      closeDialog();
    }
  }

  return (
    <>
      <button
        className={triggerClassName}
        data-hydrated={hydrated ? "true" : "false"}
        type="button"
        onClick={() => dialogRef.current?.showModal()}
      >
        {triggerLabel === "New task" ? (
          <>
            <span aria-hidden="true">+</span> {triggerLabel}
          </>
        ) : (
          triggerLabel
        )}
      </button>
      <dialog
        aria-labelledby={titleId}
        className="task-dialog"
        onClick={closeFromBackdrop}
        onClose={clearDialogQuery}
        ref={dialogRef}
      >
        <div className="task-dialog-header">
          <div>
            <p className="eyebrow">Capture it while it is clear</p>
            <h2 id={titleId}>New task</h2>
          </div>
          <button
            aria-label="Close new task dialog"
            className="dialog-close"
            onClick={closeDialog}
            type="button"
          >
            Close
          </button>
        </div>
        {children}
      </dialog>
    </>
  );
}