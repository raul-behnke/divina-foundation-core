// Meta (Facebook) Pixel helper
// Loads the base script once and exposes typed track helpers.

export const META_PIXEL_ID = "1384162403076631";

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & { callMethod?: unknown; queue?: unknown[] };
    _fbq?: unknown;
  }
}

let initialized = false;

export function initMetaPixel() {
  if (typeof window === "undefined") return;
  if (initialized || window.fbq) {
    initialized = true;
    return;
  }
  // Standard Meta Pixel bootstrap snippet
  /* eslint-disable */
  (function (f: any, b: Document, e: string, v: string) {
    if (f.fbq) return;
    const n: any = (f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    });
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];
    const t = b.createElement(e) as HTMLScriptElement;
    t.async = true;
    t.src = v;
    const s = b.getElementsByTagName(e)[0];
    s.parentNode?.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
  /* eslint-enable */
  (window.fbq as any)?.("init", META_PIXEL_ID);
  initialized = true;
}

export function fbqTrack(event: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  try {
    (window.fbq as any)?.("track", event, params);
  } catch (e) {
    console.warn("Meta Pixel track failed", e);
  }
}

export function trackPageView() {
  fbqTrack("PageView");
}
