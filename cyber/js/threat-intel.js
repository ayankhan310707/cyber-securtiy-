/**
 * Threat Intelligence Dashboard Data & Controller
 * Educational simulated threat activity stream illustrating global telemetry patterns.
 * Explicitly labeled as simulation mode: does not claim real-time live network intrusion counts.
 */

const THREAT_INTEL_SIMULATED_FEED = [
  {
    id: "TI-9941",
    timeAgo: "2m ago",
    timestamp: "14:22:10 UTC",
    category: "Phishing",
    severity: "CRITICAL",
    targetSector: "Higher Education / Students",
    indicator: "hxxps://univ-portal-exam-admit[.]top/verify",
    summary: "Mass SMS phishing campaign spoofing university ERP examination admit card downloads.",
    technique: "T1566.002 (Spearphishing Link)",
    mitigation: "Enforce Multi-Factor Authentication (MFA) and block newly registered lookalike domains.",
    globeCoords: { lat: 37.77, lon: -122.41, city: "US-West Hub" }
  },
  {
    id: "TI-9940",
    timeAgo: "8m ago",
    timestamp: "14:16:45 UTC",
    category: "Payments",
    severity: "CRITICAL",
    targetSector: "Campus Classifieds / UPI Users",
    indicator: "collect-req@fraud-merchant-upi",
    summary: "Reverse UPI QR code scam claiming to 'credit' funds for second-hand textbooks upon PIN entry.",
    technique: "T1566 (Reverse Payment Social Engineering)",
    mitigation: "Educate users: Receiving UPI transfers never requires entering a secret 4/6-digit UPI PIN.",
    globeCoords: { lat: 18.52, lon: 73.85, city: "India / APAC Hub" }
  },
  {
    id: "TI-9939",
    timeAgo: "15m ago",
    timestamp: "14:09:12 UTC",
    category: "Quishing",
    severity: "HIGH",
    targetSector: "Retail / Food Courts",
    indicator: "hxxp://cashback-student-reward[.]xyz/claim",
    summary: "Physical QR code overlay stickers placed over legitimate restaurant payment placards offering fake 50% cashbacks.",
    technique: "T1204.001 (Malicious QR Code Redirection)",
    mitigation: "Physical inspection of payment stands for overlay stickers; verify payee account name on screen.",
    globeCoords: { lat: 51.50, lon: -0.12, city: "Europe Hub" }
  },
  {
    id: "TI-9938",
    timeAgo: "24m ago",
    timestamp: "14:00:28 UTC",
    category: "Internship",
    severity: "HIGH",
    targetSector: "Job Seekers / Graduates",
    indicator: "hxxps://t[.]me/quick_cash_hr_bot",
    summary: "Telegram recruitment fraud demanding ₹1,500 'refundable kit and registration fees' for remote video-rating tasks.",
    technique: "T1566.003 (Spearphishing via Service)",
    mitigation: "Zero-fee rule: Genuine employers never charge candidates money or security deposits to start working.",
    globeCoords: { lat: 1.35, lon: 103.81, city: "SE Asia Hub" }
  },
  {
    id: "TI-9937",
    timeAgo: "39m ago",
    timestamp: "13:45:00 UTC",
    category: "Malware",
    severity: "CRITICAL",
    targetSector: "Student Portals / Academic Cells",
    indicator: "hxxp://194.26.29[.]11:8080/Exam_Grades.pdf.exe",
    summary: "Disguised executable (.pdf.exe) payload delivered via spoofed campus email disguised as grade revision document.",
    technique: "T1036.007 (Double File Extension)",
    mitigation: "Uncheck 'Hide extensions for known file types' in Windows Explorer; block executable email attachments.",
    globeCoords: { lat: -33.86, lon: 151.20, city: "Oceania Hub" }
  },
  {
    id: "TI-9936",
    timeAgo: "1h ago",
    timestamp: "13:24:19 UTC",
    category: "Credentials",
    severity: "ELEVATED",
    targetSector: "Cloud Storage / Drive Accounts",
    indicator: "hxxps://storage-quota-update[.]site/login",
    summary: "Lookalike cloud storage deactivation warning threatening data deletion within 2 hours.",
    technique: "T1566 (Urgency Phishing)",
    mitigation: "Verify quota status directly in official storage console, not via incoming alert emails.",
    globeCoords: { lat: 40.71, lon: -74.00, city: "US-East Hub" }
  }
];

class ThreatIntelligenceDashboard {
  constructor() {
    this.events = [...THREAT_INTEL_SIMULATED_FEED];
    this.currentCategory = "ALL";
    this.currentSeverity = "ALL";
    this.searchQuery = "";
    this.lastRefreshed = new Date();
  }

  init() {
    this.render();
  }

  filterEvents() {
    const q = this.searchQuery.toLowerCase().trim();
    return this.events.filter(e => {
      const matchCat = this.currentCategory === "ALL" || e.category.toUpperCase() === this.currentCategory;
      const matchSev = this.currentSeverity === "ALL" || e.severity.toUpperCase() === this.currentSeverity;
      const matchQuery = !q ||
        e.summary.toLowerCase().includes(q) ||
        e.indicator.toLowerCase().includes(q) ||
        e.targetSector.toLowerCase().includes(q) ||
        e.technique.toLowerCase().includes(q);
      return matchCat && matchSev && matchQuery;
    });
  }

  refresh(callback) {
    this.lastRefreshed = new Date();
    // Simulate brief network latency
    setTimeout(() => {
      if (window.sentinelConsole) {
        window.sentinelConsole.log({
          category: "THREAT_INTEL",
          type: "INFO",
          message: `Threat Intelligence telemetry feed refreshed. Active simulated vectors: ${this.events.length}`
        });
      }
      if (callback) callback();
    }, 450);
  }

  render() {
    const timelineContainer = document.getElementById("threat-timeline-stream");
    const countBadge = document.getElementById("threat-intel-count");
    const lastRefreshEl = document.getElementById("threat-intel-last-updated");

    if (lastRefreshEl) {
      lastRefreshEl.textContent = `Updated: ${this.lastRefreshed.toTimeString().split(" ")[0]} UTC`;
    }

    const filtered = this.filterEvents();

    if (countBadge) {
      countBadge.textContent = `${filtered.length} Vectors`;
    }

    if (!timelineContainer) return;

    if (filtered.length === 0) {
      timelineContainer.innerHTML = `
        <div class="p-8 text-center text-outline font-mono text-xs bg-surface-container/40 rounded-xl border border-outline-variant">
          No threat intelligence vectors found matching current filters.
        </div>
      `;
      return;
    }

    timelineContainer.innerHTML = filtered.map(item => {
      let sevBg = "bg-primary-container/20 border-primary-container/40 text-primary-container";
      if (item.severity === "CRITICAL") {
        sevBg = "bg-error/20 border-error/40 text-error";
      } else if (item.severity === "HIGH") {
        sevBg = "bg-yellow-400/20 border-yellow-400/40 text-yellow-400";
      } else if (item.severity === "ELEVATED") {
        sevBg = "bg-secondary-container/20 border-secondary-container/40 text-secondary-container";
      }

      return `
        <div class="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant hover:border-primary-container/50 transition-all flex flex-col justify-between group space-y-2.5">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <div class="flex items-center gap-2 font-mono text-xs">
              <span class="px-2 py-0.5 rounded font-bold uppercase text-[10px] border ${sevBg}">
                ${item.severity}
              </span>
              <span class="text-primary font-bold">${item.id}</span>
              <span class="text-outline">•</span>
              <span class="text-secondary-container">${item.category}</span>
            </div>
            <div class="flex items-center gap-2 font-mono text-[11px] text-outline">
              <span>${item.globeCoords.city}</span>
              <span>•</span>
              <span class="text-primary-container">${item.timeAgo}</span>
            </div>
          </div>

          <div>
            <h5 class="font-display-xl text-sm font-bold text-primary group-hover:text-primary-container transition-colors">
              ${this.escapeHtml(item.summary)}
            </h5>
            <div class="mt-1 flex items-center gap-2 font-mono text-xs overflow-hidden">
              <span class="text-outline text-[11px] shrink-0">Indicator:</span>
              <code class="text-error bg-surface-container px-2 py-0.5 rounded text-[11px] truncate select-all border border-outline-variant/60">
                ${this.escapeHtml(item.indicator)}
              </code>
            </div>
          </div>

          <div class="pt-2 border-t border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-[11px]">
            <div class="text-outline flex items-center gap-1">
              <span class="text-secondary-container">MITRE ATT&amp;CK:</span>
              <span>${item.technique}</span>
            </div>
            <div class="text-on-surface-variant">
              <strong class="text-primary-container">Mitigation:</strong> ${this.escapeHtml(item.mitigation)}
            </div>
          </div>
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

window.threatIntelDashboard = new ThreatIntelligenceDashboard();

if (typeof module !== "undefined" && module.exports) {
  module.exports = { ThreatIntelligenceDashboard, THREAT_INTEL_SIMULATED_FEED };
}
