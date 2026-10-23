import { Badge } from "./page-header";

export const STATUS_LABELS = {
  NEW: "Nuovo",
  READ: "Letto",
  REPLIED: "Risposto",
  ARCHIVED: "Archiviato",
  SPAM: "Spam",
} as const;

const TONES = {
  NEW: "accent",
  READ: "neutral",
  REPLIED: "success",
  ARCHIVED: "neutral",
  SPAM: "danger",
} as const;

export function MessageStatusBadge({ status }: { status: keyof typeof STATUS_LABELS }) {
  return <Badge tone={TONES[status]}>{STATUS_LABELS[status]}</Badge>;
}
