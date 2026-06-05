import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type ErrorCardProps = {
  message: string;
  resetAt?: string;
  onRetry: () => void;
};

export function ErrorCard({ message, resetAt, onRetry }: ErrorCardProps) {
  const resetLabel = resetAt
    ? new Date(Number(resetAt) * 1000).toLocaleString()
    : undefined;

  return (
    <Card variant="elevated" className="p-stack-lg">
      <Badge variant="error" className="mb-4">
        Error
      </Badge>
      <p className="text-body-md text-on-surface mb-2">{message}</p>
      {resetLabel && (
        <p className="text-body-sm text-on-surface-variant mb-4">
          Quota resets: {resetLabel}
        </p>
      )}
      <Button onClick={onRetry}>Retry</Button>
    </Card>
  );
}
