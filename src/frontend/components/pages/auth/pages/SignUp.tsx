import { Link } from "@tanstack/react-router";
import type { FormEvent } from "react";
import {
  AuthShell,
  authLinkClass,
} from "#/frontend/components/pages/auth/sections/AuthShell";
import { Button } from "#/frontend/components/shared/ui/Button";
import { TextField } from "#/frontend/components/shared/ui/TextField";

export function SignUp() {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

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
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">

        <TextField
          label="Name"
          name="name"
          autoComplete="name"
          placeholder="Ada Lovelace"
        />
		
        <TextField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••••••"
          hint="At least 12 characters, with an uppercase letter, a number, and a special character."
        />
        <TextField
          label="Confirm password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••••••"
        />
        <Button type="submit" fullWidth>
          Create account
        </Button>
      </form>
    </AuthShell>
  );
}
