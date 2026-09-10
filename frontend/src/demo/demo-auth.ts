import { getSessionToken } from "@/services/session";
import type { AuthUser, LoginCredentials, LoginResponse } from "@/types/auth";

const demoPassword = "Demo@12345";

const demoUsers: AuthUser[] = [
  {
    id: 1,
    name: "Rahim Ahmed",
    email: "admin@bsh-demo.com",
    role: "admin",
  },
  {
    id: 2,
    name: "Karim Hasan",
    email: "approver@bsh-demo.com",
    role: "approver",
  },
  {
    id: 3,
    name: "Evaluation Committee",
    email: "evaluator@bsh-demo.com",
    role: "evaluator",
  },
  {
    id: 4,
    name: "Nusrat Jahan",
    email: "management@bsh-demo.com",
    role: "management_viewer",
  },
  {
    id: 5,
    name: "MediSupply Ltd.",
    email: "vendor@bsh-demo.com",
    role: "vendor",
  },
];

function tokenFor(user: AuthUser) {
  return `bsh-demo-${user.id}-${user.role}`;
}

function userFromToken(token: string | null) {
  if (!token) {
    return null;
  }

  return demoUsers.find((user) => tokenFor(user) === token) ?? null;
}

function wait(milliseconds = 250) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
}

export class DemoAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DemoAuthError";
  }
}

export const demoAuthService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    await wait();

    const normalizedEmail = credentials.email.trim().toLowerCase();

    const user = demoUsers.find(
      (candidate) => candidate.email.toLowerCase() === normalizedEmail,
    );

    if (!user || credentials.password !== demoPassword) {
      throw new DemoAuthError("The email or password is incorrect.");
    }

    return {
      user,
      token: tokenFor(user),
      token_type: "Bearer",
    };
  },

  async me(): Promise<AuthUser> {
    await wait(120);

    const user = userFromToken(getSessionToken());

    if (!user) {
      throw new DemoAuthError("Your demo session has expired.");
    }

    return user;
  },

  async logout(): Promise<void> {
    await wait(100);
  },
};

export { demoUsers };
