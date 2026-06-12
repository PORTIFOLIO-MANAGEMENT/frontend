import { useEffect, useState } from "react";

/**
 * Run an async fetcher tied to a dependency list and expose its lifecycle as
 * { status, data, error }. Centralizes the fetch-in-effect pattern (and the
 * one legitimate synchronous loading reset) so pages stay declarative.
 *
 * status: "loading" | "ready" | "error" | "notfound"
 */
export function useAsync(fetcher, deps = []) {
  const [state, setState] = useState({ status: "loading", data: null, error: null });

  useEffect(() => {
    let active = true;
    // Reset to loading on (re)fetch — syncing UI with an external system.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState((s) => (s.status === "loading" ? s : { ...s, status: "loading" }));

    Promise.resolve(fetcher())
      .then((data) => {
        if (active) setState({ status: "ready", data, error: null });
      })
      .catch((error) => {
        if (!active) return;
        const status = error?.response?.status === 404 ? "notfound" : "error";
        setState({ status, data: null, error });
      });

    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
