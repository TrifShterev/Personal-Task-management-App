import { redirectTo, requestSession, sameOriginError } from "@/lib/form-routes";
import { updateTask } from "@/lib/tasks";
import { taskInputSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const originError = sameOriginError(request);

  if (originError) {
    return originError;
  }

  const session = await requestSession(request);

  if (!session) {
    return redirectTo(request, "/sign-in");
  }

  const { id } = await context.params;
  const form = await request.formData();
  const input = taskInputSchema.safeParse({
    title: form.get("title"),
    description: form.get("description"),
  });

  if (!input.success) {
    return redirectTo(request, `/tasks/${encodeURIComponent(id)}/edit?error=invalid`);
  }

  const updated = await updateTask(session.user.id, id, input.data);
  return redirectTo(
    request,
    updated ? "/tasks?notice=updated" : "/tasks?notice=missing",
  );
}