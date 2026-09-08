import { Outlet } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BshBrand } from "@/components/bsh-brand";
import { useAuth } from "@/features/auth/use-auth";

export default function App() {
  const { status, retry } = useAuth();
  if (status === "ready") return <Outlet />;

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 p-6 text-center">
      <BshBrand compact />
      {status === "loading" ? <p role="status" className="flex items-center gap-2 text-sm text-muted-foreground"><LoaderCircle className="size-4 animate-spin" />Restoring your session…</p> : <div role="alert" className="space-y-4"><p className="text-sm text-muted-foreground">We couldn’t restore your session. Check your connection and try again.</p><Button onClick={retry}>Try again</Button></div>}
    </main>
  );
}
