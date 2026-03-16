/**
 * Generate a lightweight browser fingerprint from canvas hash,
 * timezone, screen size, and user agent. Returns a hex string.
 */
export function generateFingerprint(): string {
  const components: string[] = [];

  // Canvas fingerprint
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 200;
    canvas.height = 50;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.textBaseline = "top";
      ctx.font = "14px Arial";
      ctx.fillStyle = "#f60";
      ctx.fillRect(0, 0, 100, 50);
      ctx.fillStyle = "#069";
      ctx.fillText("oculus:fp", 2, 15);
      ctx.fillStyle = "rgba(102,204,0,0.7)";
      ctx.fillText("oculus:fp", 4, 17);
      components.push(canvas.toDataURL());
    }
  } catch {
    components.push("canvas-unavailable");
  }

  // Timezone
  try {
    components.push(Intl.DateTimeFormat().resolvedOptions().timeZone);
  } catch {
    components.push("tz-unknown");
  }

  // Screen
  components.push(`${screen.width}x${screen.height}x${screen.colorDepth}`);

  // User agent
  components.push(navigator.userAgent);

  // Hash using simple FNV-1a
  const raw = components.join("|");
  let hash = 0x811c9dc5;
  for (let i = 0; i < raw.length; i++) {
    hash ^= raw.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }

  // Convert to unsigned 32-bit hex
  return (hash >>> 0).toString(16).padStart(8, "0");
}
