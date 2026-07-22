import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <main className="flex flex-1 items-center justify-center p-4">
      <Spinner className="size-6 text-muted-foreground" />
    </main>
  );
}
