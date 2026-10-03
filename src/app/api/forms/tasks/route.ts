import { redirectTo, requestSession, sameOriginError } from "@/lib/form-routes";
import { createTask } from "@/lib/tasks";
import { taskInputSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const originError = sameOriginError(request);

  if (originError) {
    return originError;
  }

  const session = await requestSession(request);

  if (!session) {
    return redirectTo(request, "/sign-in");
  }

  const form = await request.formData();
  const input = taskInputSchema.safeParse({
    title: form.get("title"),
    description: form.get("description"),
  });

  if (!input.success) {
    return redirectTo(request, "/tasks/new?error=invalid");
  }

  await createTask(session.user.id, input.data);
  return redirectTo(request, "/tasks?notice=created");
}