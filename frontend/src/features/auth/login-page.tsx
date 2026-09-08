import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, ClipboardCheck, Eye, EyeOff, Handshake, LoaderCircle, LockKeyhole, ShieldCheck } from "lucide-react";
import { BshBrand } from "@/components/bsh-brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/features/auth/use-auth";
import { roleLabels, workspacePath } from "@/features/auth/roles";
import { authErrorMessage } from "@/services/auth";
import type { LoginCredentials } from "@/types/auth";
import type { UserRole } from "@/types/procurement";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

const demoAccounts: { account: string; role: UserRole }[] = [
  { account: "admin", role: "admin" },
  { account: "approver", role: "approver" },
  { account: "evaluator", role: "evaluator" },
  { account: "management", role: "management_viewer" },
  { account: "vendor", role: "vendor" },
];

export function LoginPage() {
  const { user, login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const { register, handleSubmit, formState: { errors } } = useForm<LoginCredentials>({ resolver: zodResolver(schema) });

  if (user) return <Navigate to={workspacePath(user.role)} replace />;

  async function signIn(credentials: LoginCredentials) {
    setBusy(true);
    setError("");
    try {
      await login(credentials);
    } catch (error) {
      setError(authErrorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-dvh lg:grid-cols-[0.95fr_1.05fr]">
      <section className="login-story relative isolate flex flex-col justify-between overflow-hidden bg-sidebar p-7 text-sidebar-foreground sm:p-10 lg:p-14 xl:p-16">
        <BshBrand inverse />
        <div className="relative my-12 hidden max-w-lg lg:block lg:my-16">
          <span className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs tracking-wide text-white/80"><span className="size-1.5 rounded-full bg-teal-300" /> CONNECTING PROCUREMENT & CARE</span>
          <h1 className="text-4xl font-semibold leading-[1.12] tracking-tight sm:text-5xl xl:text-6xl">Better procurement.<br /><span className="text-teal-200">Better care.</span></h1>
          <p className="mt-6 max-w-sm text-base leading-relaxed text-white/70">One portal for hospital teams and trusted suppliers. Supporting the supplies, equipment, and services that care depends on.</p>
          <div className="mt-10 hidden border-t border-white/15 pt-7 lg:block">
            <p className="mb-5 text-[10px] font-medium tracking-[0.2em] text-white/50">A CONNECTED PROCUREMENT JOURNEY</p>
            <div className="flex items-start justify-between gap-3 text-sm">
              {[{ icon: ClipboardCheck, title: "Plan & request" }, { icon: Handshake, title: "Source & partner" }, { icon: ShieldCheck, title: "Approve & deliver" }].map(({ icon: Icon, title }, index) => (
                <div key={title}><Icon className="mb-3 size-5 text-teal-200" aria-hidden="true" /><p className="text-xs text-white/75"><span className="mr-2 text-white/40">0{index + 1}</span>{title}</p></div>
              ))}
            </div>
          </div>
        </div>
        <p className="hidden text-xs text-white/50 lg:block">Bangladesh Specialized Hospital PLC <span className="mx-2">/</span> Dhaka, Bangladesh</p>
      </section>

      <section className="flex flex-col justify-center bg-card px-6 py-10 sm:px-12 lg:px-16">
        <div className="mx-auto w-full max-w-[420px]">
          <div className="mb-8">
            <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-primary">E-Procurement Portal</p>
            <h2 className="text-3xl font-semibold tracking-tight">Welcome back</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Sign in to your hospital or vendor workspace.</p>
          </div>

          <form onSubmit={handleSubmit(signIn)} noValidate aria-busy={busy} className="space-y-5">
            {error && <p role="alert" className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">{error}</p>}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input id="email" type="email" autoComplete="username" placeholder="you@bsh-demo.com" className="h-12 bg-background" disabled={busy} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} {...register("email")} />
              {errors.email && <p id="email-error" role="alert" className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Enter your password" className="h-12 bg-background pr-12" disabled={busy} aria-invalid={!!errors.password} aria-describedby={errors.password ? "password-error" : undefined} {...register("password")} />
                <Button type="button" variant="ghost" size="icon" className="absolute right-2 top-2" aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)} disabled={busy}>{showPassword ? <EyeOff /> : <Eye />}</Button>
              </div>
              {errors.password && <p id="password-error" role="alert" className="text-xs text-destructive">{errors.password.message}</p>}
            </div>
            <Button type="submit" className="h-12 w-full justify-between px-4" disabled={busy}><span>{busy ? "Signing in…" : "Sign In"}</span>{busy ? <LoaderCircle className="animate-spin" /> : <ArrowRight />}</Button>
          </form>

          <div className="mt-8 border-t pt-6">
            <div className="mb-1 flex items-center justify-between"><h3 className="text-sm font-semibold">Demo Access</h3><span className="rounded bg-accent px-2 py-1 text-[10px] font-semibold tracking-wide text-accent-foreground">CLIENT DEMO</span></div>
            <p className="mb-4 text-xs text-muted-foreground">Choose a role to sign in instantly.</p>
            <div className="grid grid-cols-2 gap-2">
              {demoAccounts.map(({ account, role }) => <Button key={role} type="button" variant="outline" className={role === "vendor" ? "col-span-2 h-10 justify-between px-3" : "h-11 justify-between gap-2 whitespace-normal px-3 text-xs"} disabled={busy} onClick={() => signIn({ email: `${account}@bsh-demo.com`, password: "Demo@12345" })}><span className="min-w-0 text-left">{roleLabels[role]}</span><ArrowRight className="size-3.5 text-muted-foreground" /></Button>)}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">Demo password: <code className="font-medium text-foreground">Demo@12345</code></p>
          </div>
          <p className="mt-8 flex items-center gap-2 text-xs leading-relaxed text-muted-foreground"><LockKeyhole className="size-3.5 shrink-0" aria-hidden="true" /> Demonstration environment · Sample accounts and data</p>
        </div>
      </section>
    </main>
  );
}
