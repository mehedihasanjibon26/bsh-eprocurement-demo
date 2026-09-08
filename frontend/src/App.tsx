import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { api } from "@/services/api";

type HealthResponse = {
  status: string;
  service: string;
};

function App() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["api-health"],
    queryFn: async () => {
      const response = await api.get<HealthResponse>("/health");
      return response.data;
    },
  });

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="space-y-4 text-center">
        <h1 className="text-3xl font-semibold">BSH E-Procurement</h1>

        <p className="text-muted-foreground">
          Frontend and backend connectivity check
        </p>

        {isLoading && (
          <p className="text-sm text-muted-foreground">Checking API...</p>
        )}

        {isError && (
          <p className="text-sm text-destructive">API connection failed</p>
        )}

        {data && (
          <div className="rounded-lg border p-4">
            <p className="font-medium">{data.service}</p>
            <p className="text-sm text-muted-foreground">
              Status: {data.status}
            </p>
          </div>
        )}

        <Button onClick={() => refetch()}>Check Again</Button>
      </div>
    </main>
  );
}

export default App;
