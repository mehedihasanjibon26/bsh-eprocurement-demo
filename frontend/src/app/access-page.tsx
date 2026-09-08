import { Link } from "react-router-dom";
import { ArrowLeft, FileQuestion, ShieldAlert } from "lucide-react";
import { BshBrand } from "@/components/bsh-brand";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/use-auth";
import { workspacePath } from "@/features/auth/roles";

export function AccessPage({ unauthorized = false }: { unauthorized?: boolean }) {
  const { user } = useAuth();
  const home = user ? workspacePath(user.role) : "/login";
  return <section className="flex min-h-[70dvh] flex-col items-center justify-center gap-6 p-6 text-center">
    <BshBrand compact />
    <span className="mt-4 flex size-16 items-center justify-center rounded-2xl bg-secondary text-primary">{unauthorized ? <ShieldAlert className="size-8" /> : <FileQuestion className="size-8" />}</span>
    <div><p className="mb-2 text-xs font-semibold tracking-widest text-muted-foreground">{unauthorized ? "403 · UNAUTHORIZED" : "404 · NOT FOUND"}</p><h1 className="text-2xl font-semibold">{unauthorized ? "Access restricted" : "Page not found"}</h1><p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">{unauthorized ? "Your role does not have access to this workspace. Return to your assigned workspace to continue." : "This page could not be found. Use the link below to return to the portal."}</p></div>
    <Button render={<Link to={home === "/unauthorized" ? "/login" : home} />} nativeButton={false} className="h-10 px-4"><ArrowLeft />{user ? "Return to my workspace" : "Return to sign in"}</Button>
  </section>;
}
