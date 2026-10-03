import { redirectTo, submitAuthForm } from "@/lib/form-routes";
import { signInSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const form = await request.formData();
  const input = signInSchema.safeParse({
    email: form.get("email"),
    password: form.get("password"),
  });

  if (!input.success) {
    return redirectTo(request, "/sign-in?error=invalid");
  }

  return submitAuthForm(
    request,
    "sign-in/email",
    input.data,
    "/tasks",
    "/sign-in?error=credentials",
  );
}