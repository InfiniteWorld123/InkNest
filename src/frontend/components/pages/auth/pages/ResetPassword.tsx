import { Link } from "@tanstack/react-router";
import type { FormEvent } from "react";
import {
  AuthShell,
  authLinkClass,
} from "#/frontend/components/pages/auth/sections/AuthShell";
import { Button } from "#/frontend/components/shared/ui/Button";
import { TextField } from "#/frontend/components/shared/ui/TextField";

export function ResetPassword() {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter the code we emailed you and choose a new password."
      footer={
        <>
          Remembered it?{" "}
          <Link to="/sign-in" className={authLinkClass}>
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <TextField
          label="New password"
          name="newPassword"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••••••"
          hint="At least 12 characters, with an uppercase letter, a number, and a special character."
        />
        <TextField
          label="Confirm new password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••••••"
        />
        <Button type="submit" fullWidth>
          Reset password
        </Button>
      </form>
    </AuthShell>
  );
}
