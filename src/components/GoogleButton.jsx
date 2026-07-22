import { useEffect, useRef, useState } from "react";

// Renders Google's official "Sign in with Google" button.
// Shows nothing if VITE_GOOGLE_CLIENT_ID isn't set, so the app works without it.
// On success it hands the Google ID token ("credential") back via onCredential.
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const SCRIPT_SRC = "https://accounts.google.com/gsi/client";

function loadGis() {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) return resolve();
    let s = document.querySelector(`script[src="${SCRIPT_SRC}"]`);
    if (s) { s.addEventListener("load", () => resolve()); s.addEventListener("error", reject); return; }
    s = document.createElement("script");
    s.src = SCRIPT_SRC; s.async = true; s.defer = true;
    s.onload = () => resolve(); s.onerror = reject;
    document.head.appendChild(s);
  });
}

export default function GoogleButton({ onCredential, onError }) {
  const ref = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!CLIENT_ID) return;
    let alive = true;
    loadGis().then(() => {
      if (!alive || !ref.current) return;
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: (resp) => resp?.credential ? onCredential(resp.credential) : onError?.("No credential from Google"),
      });
      window.google.accounts.id.renderButton(ref.current, { theme: "outline", size: "large", width: 300, text: "continue_with", shape: "pill" });
      setReady(true);
    }).catch(() => onError?.("Couldn't load Google sign-in"));
    return () => { alive = false; };
  }, [onCredential, onError]);

  if (!CLIENT_ID) return null;
  return (
    <div className="gbtn-wrap">
      <div className="gbtn-divider"><span>or</span></div>
      <div ref={ref} style={{ display: "flex", justifyContent: "center", minHeight: ready ? "auto" : 44 }} />
    </div>
  );
}
