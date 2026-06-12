import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { tokenStore } from "./api";

window.Pusher = Pusher;

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

let echoInstance = null;

/**
 * Lazily create a single Laravel Echo client wired to Reverb. Private channels
 * authorize through the API's /broadcasting/auth using the JWT bearer token.
 */
export function getEcho() {
  if (echoInstance) return echoInstance;

  echoInstance = new Echo({
    broadcaster: "reverb",
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST ?? "localhost",
    wsPort: Number(import.meta.env.VITE_REVERB_PORT ?? 8080),
    wssPort: Number(import.meta.env.VITE_REVERB_PORT ?? 8080),
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? "http") === "https",
    enabledTransports: ["ws", "wss"],
    authEndpoint: `${API_URL.replace(/\/api$/, "")}/broadcasting/auth`,
    auth: {
      headers: { Authorization: `Bearer ${tokenStore.get() ?? ""}` },
    },
  });

  return echoInstance;
}

export function disconnectEcho() {
  if (echoInstance) {
    echoInstance.disconnect();
    echoInstance = null;
  }
}
