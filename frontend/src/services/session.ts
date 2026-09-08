// Only the demo token is persisted. User identity and role always come from /auth/me.
const tokenKey = "bsh.demo.token.v1";
export const sessionExpiredEvent = "bsh:session-expired";

export function getSessionToken() {
  return localStorage.getItem(tokenKey);
}

export function setSessionToken(token: string | null) {
  if (token) localStorage.setItem(tokenKey, token);
  else localStorage.removeItem(tokenKey);
}
