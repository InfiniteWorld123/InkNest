import { Button, Form } from "@heroui/react";
import { useForm } from "@tanstack/react-form";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useSignUpMutation } from "#/frontend/api/queries/auth.query";
import { getCaughtErrorMessage } from "#/frontend/api/utils";
import { AuthMessage } from "#/frontend/components/pages/auth/sections/AuthMessage";
import {
  AuthShell,
  authLinkClass,
} from "#/frontend/components/pages/auth/sections/AuthShell";
import { TextField } from "#/frontend/components/shared/ui/TextField";
import { SignUpSchema } from "#/shared/validation/auth.validation";

export function SignUp() {
  const navigate = useNavigate();
  const signUp = useSignUpMutation();
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onChange: SignUpSchema,
    },
    onSubmit: async ({ value }) => {
      setSubmissionError(null);

      try {
        await signUp.mutateAsync(value);
        await navigate({
          to: "/verify-email",
          search: { email: value.email },
        });
      } catch (error) {
        setSubmissionError(
          getCaughtErrorMessage(
            error,
            "Unable to create your account. Please try again.",
          ),
        );
      }
    },
  });

  return (
    <AuthShell
      title="Create your account"
      subtitle="Start writing and sharing on InkNest."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/sign-in" className={authLinkClass}>
            Sign in
          </Link>
        </>
      }
    >
      {submissionError ? (
        <AuthMessage
          status="danger"
          title="Sign-up failed"
          message={submissionError}
        />
      ) : null}
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="flex flex-col gap-5"
      >
        <form.Field name="name">
          {(field) => (
            <TextField
              label="Name"
              name={field.name}
              autoComplete="name"
              placeholder="Ada Lovelace"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              errors={
                field.state.meta.isTouched
                  ? field.state.meta.errors.map((error) => error?.message)
                  : []
              }
            />
          )}
        </form.Field>
        <form.Field name="email">
          {(field) => (
            <TextField
              label="Email"
              name={field.name}
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              errors={
                field.state.meta.isTouched
                  ? field.state.meta.errors.map((error) => error?.message)
                  : []
              }
            />
          )}
        </form.Field>
        <form.Field name="password">
          {(field) => (
            <TextField
              label="Password"
              name={field.name}
              type="password"
              autoComplete="new-password"
              placeholder="••••••••••••"
              hint="At least 12 characters, with an uppercase letter, a number, and a special character."
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              errors={
                field.state.meta.isTouched
                  ? field.state.meta.errors.map((error) => error?.message)
                  : []
              }
            />
          )}
        </form.Field>
        <form.Field name="confirmPassword">
          {(field) => (
            <TextField
              label="Confirm password"
              name={field.name}
              type="password"
              autoComplete="new-password"
              placeholder="••••••••••••"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              errors={
                field.state.meta.isTouched
                  ? field.state.meta.errors.map((error) => error?.message)
                  : []
              }
            />
          )}
        </form.Field>
        <Button
          type="submit"
          fullWidth
          isDisabled={signUp.isPending}
          isPending={signUp.isPending}
        >
          {signUp.isPending ? "Creating account…" : "Create account"}
        </Button>
      </Form>
    </AuthShell>
  );
}
