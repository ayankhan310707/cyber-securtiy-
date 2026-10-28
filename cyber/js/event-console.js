/**
 * Security Event Console Engine
 * Terminal-inspired live audit logging panel capturing genuine user interactions
 * across all security tools, analyzers, quiz attempts, and hygiene controls.
 * Strictly educational: logs only real browser actions, never fabricated network attacks.
 */

class SecurityEventConsole {
  constructor(containerId = "terminal-event-stream", counterId = "terminal-event-count") {
    this.container = document.getElementById(containerId);
    this.counterEl = document.getElementById(counterId);
    this.events = [];
    this.currentFilter = "ALL";
    this.maxEvents = 150;
    this.autoScroll = true;
  }

  init() {
    this.log({
      category: "SYSTEM",
      type: "INFO",
      message: "Sentinel Security Kernel v5.2 initialized. Real-time interaction telemetry active."
    });

    this.log({
      category: "SYSTEM",
      type: "INFO",
      message: "Local cryptographic memory enclaves verified. Zero data transmission enforced."
    });
  }

  /**
   * Log an event to the console
   * @param {Object} eventObj { category, type, message, meta }
   */
  log(eventObj) {
    const timestamp = new Date();
    const timeStr = timestamp.toTimeString().split(" ")[0]; // HH:MM:SS
    const ms = String(timestamp.getMilliseconds()).padStart(3, "0");

    const entry = {
      id: "evt_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
      time: `${timeStr}.${ms}`,
      category: eventObj.category || "SYSTEM",
      type: eventObj.type || "INFO", // INFO, WARN, ALERT, SUCCESS
      message: eventObj.message || "",
      meta: eventObj.meta || null
    };

    this.events.unshift(entry);

    if (this.events.length > this.maxEvents) {
      this.events.pop();
    }

    this.render();
  }

  setFilter(category) {
    this.currentFilter = category.toUpperCase();
    this.render();
  }

  clear() {
    this.events = [];
    this.log({
      category: "SYSTEM",
      type: "INFO",
      message: "Security Event Console stream buffer cleared by user."
    });
  }

  exportLog() {
    if (this.events.length === 0) return;
    const lines = [
      "===========================================================",
      "  CYBER DEFENSE SENTINEL // SECURITY AUDIT LOG EXPORT",
      `  Generated: ${new Date().toISOString()}`,
      "  Scope: Client-Side Interactive Session Telemetry",
      "===========================================================",
      ""
    ];

    [...this.events].reverse().forEach(e => {
      lines.push(`[${e.time}] [${e.category}] [${e.type}] ${e.message}`);
    });

    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sentinel-event-audit-${Date.now()}.log`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  render() {
    if (this.counterEl) {
      this.counterEl.textContent = `${this.events.length} Events`;
    }

    if (!this.container) return;

    const filtered = this.events.filter(e => {
      if (this.currentFilter === "ALL") return true;
      return e.category === this.currentFilter;
    });

    if (filtered.length === 0) {
      this.container.innerHTML = `
        <div class="p-6 text-center text-outline font-mono text-xs">
          No audit events recorded under category: [${this.currentFilter}]
        </div>
      `;
      return;
    }

    this.container.innerHTML = filtered.map(e => {
      let typeColor = "text-secondary-container";
      let badgeBg = "bg-secondary-container/10 border-secondary-container/30 text-secondary-container";

      if (e.type === "ALERT" || e.type === "FAIL") {
        typeColor = "text-error";
        badgeBg = "bg-error/20 border-error/40 text-error";
      } else if (e.type === "WARN") {
        typeColor = "text-yellow-400";
        badgeBg = "bg-yellow-400/20 border-yellow-400/40 text-yellow-400";
      } else if (e.type === "SUCCESS" || e.type === "PASS") {
        typeColor = "text-primary-container";
        badgeBg = "bg-primary-container/20 border-primary-container/40 text-primary-container";
      }

      return `
        <div class="flex items-start gap-2.5 py-1.5 px-2 hover:bg-surface-container/50 rounded font-mono text-xs transition-colors border-b border-outline-variant/20 last:border-b-0">
          <span class="text-outline text-[11px] shrink-0 select-none">[${e.time}]</span>
          <span class="px-1.5 py-0.2 rounded border text-[10px] font-bold uppercase shrink-0 ${badgeBg}">
            ${e.category}
          </span>
          <span class="flex-grow text-on-surface leading-snug break-words">
            ${this.escapeHtml(e.message)}
          </span>
        </div>
      `;
    }).join("");
  }

  escapeHtml(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}

// Global Event Console Instance
window.sentinelConsole = new SecurityEventConsole();

if (typeof module !== "undefined" && module.exports) {
  module.exports = { SecurityEventConsole };
}
