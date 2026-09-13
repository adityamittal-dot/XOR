import { useEffect, useRef } from "react";

type CredentialResponse = { credential: string };

type GoogleAccountsId = {
  initialize: (config: {
    client_id: string;
    callback: (response: CredentialResponse) => void;
  }) => void;
  renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void;
};

declare global {
  interface Window {
    google?: { accounts: { id: GoogleAccountsId } };
  }
}

type GoogleSignInButtonProps = {
  onCredential: (credential: string) => void;
};

/**
 * Renders nothing when VITE_GOOGLE_CLIENT_ID is unset, matching this app's
 * pattern of optional features that are off by default (see GEMINI_API_KEY).
 */
export function GoogleSignInButton({ onCredential }: GoogleSignInButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!clientId || !containerRef.current) return;

    let cancelled = false;

    // The GIS script loads with async/defer, so it may not be ready yet.
    const tryRender = () => {
      if (cancelled) return;
      const google = window.google;
      if (!google || !containerRef.current) {
        setTimeout(tryRender, 100);
        return;
      }

      google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => onCredential(response.credential),
      });
      google.accounts.id.renderButton(containerRef.current, {
        theme: "outline",
        size: "large",
        width: 320,
      });
    };

    tryRender();

    return () => {
      cancelled = true;
    };
  }, [clientId, onCredential]);

  if (!clientId) return null;

  return <div ref={containerRef} className="flex justify-center" />;
}
