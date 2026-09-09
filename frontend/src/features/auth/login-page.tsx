import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowRight,
  BadgeCheck,
  Eye,
  EyeOff,
  FileCheck2,
  Layers3,
  LoaderCircle,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";

import bshLogoHorizontal from "@/assets/branding/bsh-logo-horizontal.png";
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

const demoAccounts: {
  account: string;
  role: UserRole;
}[] = [
  { account: "admin", role: "admin" },
  { account: "approver", role: "approver" },
  { account: "evaluator", role: "evaluator" },
  {
    account: "management",
    role: "management_viewer",
  },
  { account: "vendor", role: "vendor" },
];

const featureItems = [
  {
    icon: Workflow,
    title: "Connected workflow",
    description: "Requisition to payment in one digital journey.",
  },
  {
    icon: ShieldCheck,
    title: "Controlled governance",
    description: "Role-based approvals and complete traceability.",
  },
  {
    icon: FileCheck2,
    title: "Transparent sourcing",
    description: "Tendering, evaluation and supplier collaboration.",
  },
];

const logoFilter = {
  filter:
    "brightness(1.42) saturate(1.42) contrast(1.08) drop-shadow(0 0 16px rgba(255,255,255,0.16))",
};

export function LoginPage() {
  const { user, login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: zodResolver(schema),
  });

  if (user) {
    return <Navigate to={workspacePath(user.role)} replace />;
  }

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
    <main className="relative min-h-dvh overflow-hidden bg-[#070a12] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-12%] top-[-22%] size-[620px] rounded-full bg-[#4f46e5]/30 blur-[120px]" />

        <div className="absolute bottom-[-28%] right-[-8%] size-[680px] rounded-full bg-[#06b6d4]/20 blur-[130px]" />

        <div className="absolute right-[28%] top-[20%] size-[360px] rounded-full bg-[#9333ea]/15 blur-[120px]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:30px_30px] opacity-60" />

        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#0b1020]/15 to-[#02040a]/80" />
      </div>

      <div className="relative z-10 grid min-h-dvh lg:grid-cols-[1.08fr_0.92fr]">
        <section className="relative hidden min-h-dvh flex-col justify-between border-r border-white/[0.08] px-10 py-10 lg:flex xl:px-16 xl:py-12">
          <div>
            <div className="w-fit">
              <div className="relative h-[96px] w-[350px] overflow-hidden xl:h-[108px] xl:w-[400px]">
                <img
                  src={bshLogoHorizontal}
                  alt="Bangladesh Specialized Hospital PLC"
                  style={logoFilter}
                  className="absolute left-1/2 top-1/2 w-[350px] max-w-none -translate-x-1/2 -translate-y-1/2 object-contain xl:w-[400px]"
                />
              </div>

              <h2 className="mt-1 text-lg font-semibold tracking-[-0.015em] text-white xl:text-xl">
                Bangladesh Specialized Hospital PLC
              </h2>

              <div className="mt-4 flex items-center gap-3">
                <span className="h-px w-10 bg-gradient-to-r from-indigo-400 to-cyan-400" />

                <p className="text-[10px] font-semibold tracking-[0.24em] text-white/45">
                  E-PROCUREMENT EXPERIENCE
                </p>
              </div>
            </div>
          </div>

          <div className="max-w-2xl py-12">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-300/15 bg-indigo-300/[0.08] px-3.5 py-2 text-[11px] font-medium text-indigo-100 backdrop-blur-xl">
              <Sparkles className="size-3.5 text-cyan-300" />
              SMARTER PROCUREMENT. CLEARER DECISIONS.
            </div>

            <h1 className="max-w-2xl text-[44px] font-semibold leading-[1.05] tracking-[-0.045em] xl:text-[62px]">
              One workspace.
              <br />
              Every procurement
              <br />
              <span className="bg-gradient-to-r from-indigo-300 via-cyan-300 to-violet-300 bg-clip-text text-transparent">
                decision connected.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-[15px] leading-7 text-white/50 xl:text-base">
              A modern procurement experience connecting hospital teams,
              suppliers, approvals, tendering, contracts, delivery and payment
              through a single transparent workflow.
            </p>

            <div className="mt-11 grid max-w-2xl grid-cols-3 gap-3">
              {featureItems.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="rounded-[20px] border border-white/[0.09] bg-white/[0.045] p-4 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-300/20 hover:bg-white/[0.07]"
                >
                  <div className="mb-5 flex size-10 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-indigo-500/25 to-cyan-400/15">
                    <Icon className="size-[18px] text-cyan-200" />
                  </div>

                  <p className="text-xs font-semibold text-white/90">{title}</p>

                  <p className="mt-2 text-[10px] leading-4 text-white/38">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-white/[0.08] pt-6">
            <div className="flex items-center gap-2">
              <BadgeCheck className="size-4 text-cyan-300" />

              <span className="text-[11px] text-white/38">
                Enterprise procurement demonstration
              </span>
            </div>

            <span className="text-[10px] tracking-[0.12em] text-white/25">
              DHAKA, BANGLADESH
            </span>
          </div>
        </section>

        <section className="relative flex min-h-dvh items-center justify-center px-5 py-8 sm:px-10 lg:px-12 xl:px-16">
          <div className="w-full max-w-[470px]">
            <div className="mb-8 lg:hidden">
              <div className="mx-auto flex max-w-[340px] flex-col items-center text-center">
                <img
                  src={bshLogoHorizontal}
                  alt="Bangladesh Specialized Hospital PLC"
                  style={logoFilter}
                  className="w-[310px] object-contain"
                />

                <p className="-mt-5 text-sm font-semibold text-white">
                  Bangladesh Specialized Hospital PLC
                </p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[30px] border border-white/[0.12] bg-white/[0.075] p-1 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
              <div className="pointer-events-none absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />

              <div className="rounded-[26px] bg-[#0d111d]/88 p-6 sm:p-8 xl:p-9">
                <div className="mb-8">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex size-11 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-indigo-500/25 to-cyan-400/15">
                      <Layers3 className="size-5 text-cyan-200" />
                    </div>

                    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/10 bg-emerald-300/[0.07] px-2.5 py-1.5 text-[10px] font-semibold tracking-[0.13em] text-emerald-200">
                      <span className="size-1.5 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.8)]" />
                      CLIENT DEMO
                    </span>
                  </div>

                  <p className="text-[10px] font-semibold tracking-[0.22em] text-cyan-300/80">
                    E-PROCUREMENT PORTAL
                  </p>

                  <h2 className="mt-2 text-[32px] font-semibold tracking-[-0.035em] text-white">
                    Welcome back
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-white/42">
                    Sign in to access your procurement workspace.
                  </p>
                </div>

                <form
                  onSubmit={handleSubmit(signIn)}
                  noValidate
                  aria-busy={busy}
                  className="space-y-5"
                >
                  {error && (
                    <p
                      role="alert"
                      className="rounded-xl border border-red-400/20 bg-red-400/[0.08] p-3 text-sm text-red-200"
                    >
                      {error}
                    </p>
                  )}

                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-xs font-medium text-white/65"
                    >
                      Email address
                    </label>

                    <Input
                      id="email"
                      type="email"
                      autoComplete="username"
                      placeholder="you@bsh-demo.com"
                      className="h-12 rounded-xl border-white/[0.1] bg-white/[0.055] px-4 text-white shadow-none placeholder:text-white/25 focus:border-cyan-300/35 focus:bg-white/[0.075]"
                      disabled={busy}
                      aria-invalid={!!errors.email}
                      aria-describedby={
                        errors.email ? "email-error" : undefined
                      }
                      {...register("email")}
                    />

                    {errors.email && (
                      <p
                        id="email-error"
                        role="alert"
                        className="text-xs text-red-300"
                      >
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="password"
                      className="text-xs font-medium text-white/65"
                    >
                      Password
                    </label>

                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="Enter your password"
                        className="h-12 rounded-xl border-white/[0.1] bg-white/[0.055] px-4 pr-12 text-white shadow-none placeholder:text-white/25 focus:border-cyan-300/35 focus:bg-white/[0.075]"
                        disabled={busy}
                        aria-invalid={!!errors.password}
                        aria-describedby={
                          errors.password ? "password-error" : undefined
                        }
                        {...register("password")}
                      />

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 rounded-lg text-white/40 hover:bg-white/[0.08] hover:text-white"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        aria-pressed={showPassword}
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={busy}
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </Button>
                    </div>

                    {errors.password && (
                      <p
                        id="password-error"
                        role="alert"
                        className="text-xs text-red-300"
                      >
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="h-12 w-full justify-between rounded-xl border-0 bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500 px-4 text-white shadow-[0_14px_35px_rgba(79,70,229,0.28)] transition duration-300 hover:scale-[1.01] hover:opacity-95"
                    disabled={busy}
                  >
                    <span>{busy ? "Signing in..." : "Sign In"}</span>

                    {busy ? (
                      <LoaderCircle className="animate-spin" />
                    ) : (
                      <ArrowRight />
                    )}
                  </Button>
                </form>

                <div className="mt-8 border-t border-white/[0.08] pt-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-white">
                        Explore by role
                      </h3>

                      <p className="mt-1 text-[11px] text-white/35">
                        Instant access for demonstration.
                      </p>
                    </div>

                    <Sparkles className="size-4 text-violet-300" />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {demoAccounts.map(({ account, role }) => (
                      <Button
                        key={role}
                        type="button"
                        variant="outline"
                        className={
                          role === "vendor"
                            ? "col-span-2 h-11 justify-between rounded-xl border-white/[0.09] bg-white/[0.035] px-3 text-white hover:border-cyan-300/20 hover:bg-white/[0.07] hover:text-white"
                            : "h-11 justify-between gap-2 rounded-xl border-white/[0.09] bg-white/[0.035] px-3 text-xs text-white hover:border-violet-300/20 hover:bg-white/[0.07] hover:text-white"
                        }
                        disabled={busy}
                        onClick={() =>
                          signIn({
                            email: `${account}@bsh-demo.com`,
                            password: "Demo@12345",
                          })
                        }
                      >
                        <span className="min-w-0 text-left">
                          {roleLabels[role]}
                        </span>

                        <ArrowRight className="size-3.5 text-cyan-300/60" />
                      </Button>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.035] px-3 py-2.5">
                    <span className="text-[11px] text-white/35">
                      Demo password
                    </span>

                    <code className="text-[11px] font-semibold text-cyan-200">
                      Demo@12345
                    </code>
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-5 flex items-center justify-center gap-2 text-center text-[11px] text-white/30">
              <LockKeyhole className="size-3.5" />
              Demonstration environment • Sample accounts and data
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
