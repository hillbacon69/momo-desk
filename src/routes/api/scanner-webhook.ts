import { createFileRoute } from "@tanstack/react-router";
import { sendScannerSignal } from "@/lib/market/scanner-webhook.server";

/** POST /api/scanner-webhook — the browser reports an edge, the server forwards
 *  it with the secret header. The secret never reaches the client.
 */
export const Route = createFileRoute("/api/scanner-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let payload: unknown;
        try {
          payload = await request.json();
        } catch {
          return Response.json({ sent: false, reason: "invalid" }, { status: 400 });
        }
        const result = await sendScannerSignal(payload as Record<string, never>);
        return Response.json(result);
      },
    },
  },
});
