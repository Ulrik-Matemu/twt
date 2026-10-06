import type { EmailLogStatus } from "@/lib/resend-email";

const STYLES: Record<EmailLogStatus, string> = {
  sent: "bg-blue-50 text-blue-700",
  delivered: "bg-green-50 text-green-700",
  delayed: "bg-amber-50 text-amber-700",
  bounced: "bg-red-50 text-red-700",
  complained: "bg-red-50 text-red-700",
  failed: "bg-red-50 text-red-700",
};

const LABELS: Record<EmailLogStatus, string> = {
  sent: "Sent",
  delivered: "Delivered",
  delayed: "Delayed",
  bounced: "Bounced",
  complained: "Spam complaint",
  failed: "Failed",
};

export default function EmailStatusBadge({ status }: { status: EmailLogStatus }) {
  return (
    <span className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${STYLES[status]}`}>
      {LABELS[status]}
    </span>
  );
}
