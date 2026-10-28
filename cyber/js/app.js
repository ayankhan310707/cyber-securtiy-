/**
 * Cyber Defense Sentinel - Master Application Controller
 * Manages all interactive tools, 3D threat globe sync, URL inspector,
 * phishing analyzer, password lab, security event console, threat intel stream,
 * quiz state, privacy checklist, scam radar, incident guide, and user session.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Initialize Tool Instances
  const phishingAnalyzer = new PhishingAnalyzer();
  const passwordLab = new PasswordLab();
  const urlInspector = new UrlInspector();

  // Initialize Security Event Console
  if (window.sentinelConsole) {
    window.sentinelConsole.init();
  }

  // Master State Manager
  const State = {
    // Quiz State
    quiz: {
      currentQuestionIndex: 0,
      selectedAnswers: new Array(CYBER_QUIZ_DATA.length).fill(null),
      score: 0,
      isFinished: false,
      reviewMode: false
    },
    // Checklist State
    checklist: {
      completedIds: JSON.parse(localStorage.getItem("cyber_sentinel_checklist") || "[]"),
      currentFilter: "all"
    },
    // Scam Radar State
    scamRadar: {
      currentFilter: "all",
      searchQuery: "",
      activeScamModalId: null
    },
    // Incident Response State
    incidentGuide: {
      activeIncidentId: "incident-phishing-link",
      checkedSteps: JSON.parse(localStorage.getItem("cyber_sentinel_incident_steps") || "{}")
    },
    // Analytics & Metrics (Local Only)
    metrics: {
      quizAttempts: parseInt(localStorage.getItem("cyber_sentinel_quiz_attempts") || "0", 10),
      quizBestScore: parseInt(localStorage.getItem("cyber_sentinel_quiz_best_score") || "0", 10),
      quizLastScore: parseInt(localStorage.getItem("cyber_sentinel_quiz_last_score") || "0", 10),
      phishingScansCount: parseInt(localStorage.getItem("cyber_sentinel_phishing_scans") || "0", 10),
      urlInspectionsCount: parseInt(localStorage.getItem("cyber_sentinel_url_inspections") || "0", 10),
      passwordChecksCount: parseInt(localStorage.getItem("cyber_sentinel_pwd_checks") || "0", 10)
    }
  };

  /* ==========================================================================
     1. NOTIFICATION TOAST UTILITY
     ========================================================================== */
  function showToast(message, type = "success") {
    let toastContainer = document.getElementById("toast-container");
    if (!toastContainer) {
      toastContainer = document.createElement("div");
      toastContainer.id = "toast-container";
      toastContainer.className = "fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none";
      document.body.appendChild(toastContainer);
    }

    const toast = document.createElement("div");
    const isSuccess = type === "success";
    toast.className = `pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-lg border shadow-xl backdrop-blur-md transition-all duration-300 transform translate-y-4 opacity-0 ${
      isSuccess
        ? "bg-surface-container border-primary-container/40 text-primary-container"
        : "bg-surface-container border-error/40 text-error"
    }`;
    toast.innerHTML = `
      <span class="material-symbols-outlined text-lg">${isSuccess ? "check_circle" : "error"}</span>
      <span class="font-mono text-xs sm:text-sm font-medium text-on-surface">${message}</span>
    `;

    toastContainer.appendChild(toast);
    requestAnimationFrame(() => {
      toast.classList.remove("translate-y-4", "opacity-0");
      toast.classList.add("translate-y-0", "opacity-100");
    });

    setTimeout(() => {
      toast.classList.add("opacity-0", "translate-y-2");
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  /* ==========================================================================
     2. NAVIGATION & HERO ACTION CONTROLS
     ========================================================================== */
  function initNavigation() {
    // 1. Analyze a Message Button
    const btnHeroAnalyzeMsg = document.getElementById("btn-hero-analyze-msg");
    if (btnHeroAnalyzeMsg) {
      btnHeroAnalyzeMsg.addEventListener("click", () => {
        const target = document.getElementById("phishing-analyzer");
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
          const textarea = document.getElementById("analyzer-input-text");
          if (textarea) textarea.focus();
        }
      });
    }

    // 2. Inspect a URL Button
    const btnHeroInspectUrl = document.getElementById("btn-hero-inspect-url");
    if (btnHeroInspectUrl) {
      btnHeroInspectUrl.addEventListener("click", () => {
        const target = document.getElementById("url-inspector");
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
          const urlInput = document.getElementById("url-inspector-input");
          if (urlInput) urlInput.focus();
        }
      });
    }

    // 3. Explore Security Tools Button
    const btnHeroExploreTools = document.getElementById("btn-hero-explore-tools");
    if (btnHeroExploreTools) {
      btnHeroExploreTools.addEventListener("click", () => {
        const toolsSection = document.getElementById("security-tools");
        if (toolsSection) {
          toolsSection.scrollIntoView({ behavior: "smooth" });
        }
      });
    }

    // Start Security Test / Quiz Button
    const btnStartTest = document.getElementById("btn-hero-start-test");
    if (btnStartTest) {
      btnStartTest.addEventListener("click", () => {
        const quizSection = document.getElementById("cyber-quiz");
        if (quizSection) {
          quizSection.scrollIntoView({ behavior: "smooth" });
        }
      });
    }

    // Mobile Navigation Toggle
    const mobileMenuBtn = document.getElementById("mobile-menu-toggle");
    const mobileMenu = document.getElementById("mobile-menu-drawer");
    if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener("click", () => {
        mobileMenu.classList.toggle("hidden");
      });
      mobileMenu.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
          mobileMenu.classList.add("hidden");
        });
      });
    }

    // Active Navigation Highlighting on Scroll
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll("header nav a");

    window.addEventListener("scroll", () => {
      let currentSectionId = "";
      const scrollPos = window.scrollY + 130;

      sections.forEach(sec => {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          currentSectionId = sec.getAttribute("id");
        }
      });

      navLinks.forEach(link => {
        const href = link.getAttribute("href");
        if (href === `#${currentSectionId}`) {
          link.classList.add("text-primary-container", "border-b-2", "border-primary-container");
          link.classList.remove("text-on-surface-variant");
        } else {
          link.classList.remove("text-primary-container", "border-b-2", "border-primary-container");
          link.classList.add("text-on-surface-variant");
        }
      });
    });
  }

  /* ==========================================================================
     3. PHISHING MESSAGE ANALYZER (MAIN FEATURE)
     ========================================================================== */
  function initPhishingAnalyzer() {
    const textarea = document.getElementById("analyzer-input-text");
    const charCountEl = document.getElementById("analyzer-char-count");
    const btnAnalyze = document.getElementById("btn-run-analyzer");
    const btnClear = document.getElementById("btn-clear-analyzer");
    const samplesContainer = document.getElementById("analyzer-preset-samples");
    const resultsContainer = document.getElementById("analyzer-results-wrapper");
    const emptyState = document.getElementById("analyzer-empty-state");
    const loadingState = document.getElementById("analyzer-loading-state");

    if (!textarea || !btnAnalyze) return;

    // Render Preset Samples
    if (samplesContainer) {
      samplesContainer.innerHTML = PHISHING_ANALYZER_SAMPLES.map(sample => `
        <button type="button" data-sample-id="${sample.id}" class="btn-sample-preset px-3 py-1.5 rounded-lg bg-surface-container border border-outline-variant hover:border-primary-container/60 hover:text-primary transition-all text-xs font-mono text-left flex items-center gap-1.5 text-on-surface-variant">
          <span class="w-1.5 h-1.5 rounded-full ${sample.id === 'safe-seminar' ? 'bg-primary-container' : 'bg-error'}"></span>
          <span>${sample.name}</span>
        </button>
      `).join("");

      samplesContainer.addEventListener("click", e => {
        const btn = e.target.closest(".btn-sample-preset");
        if (!btn) return;
        const sampleId = btn.getAttribute("data-sample-id");
        const sample = PHISHING_ANALYZER_SAMPLES.find(s => s.id === sampleId);
        if (sample) {
          textarea.value = sample.text;
          updateCounters();
          runAnalysis();
        }
      });
    }

    function updateCounters() {
      const len = textarea.value.length;
      if (charCountEl) {
        charCountEl.textContent = `${len} characters`;
      }
    }

    textarea.addEventListener("input", updateCounters);

    function runAnalysis() {
      const text = textarea.value.trim();
      if (!text) {
        showToast("Please enter or paste a message to analyze.", "error");
        textarea.focus();
        return;
      }

      if (emptyState) emptyState.classList.add("hidden");
      if (resultsContainer) resultsContainer.classList.add("hidden");
      if (loadingState) loadingState.classList.remove("hidden");

      setTimeout(() => {
        const report = phishingAnalyzer.analyze(text);
        if (loadingState) loadingState.classList.add("hidden");

        if (report.error) {
          showToast(report.error, "error");
          if (emptyState) emptyState.classList.remove("hidden");
          return;
        }

        renderAnalyzerResults(report);

        // Update local metrics
        State.metrics.phishingScansCount += 1;
        localStorage.setItem("cyber_sentinel_phishing_scans", State.metrics.phishingScansCount.toString());
        updateDashboard();

        // Log to Security Event Console
        if (window.sentinelConsole) {
          const logType = report.score >= 60 ? "ALERT" : (report.score >= 28 ? "WARN" : "SUCCESS");
          window.sentinelConsole.log({
            category: "ANALYZER",
            type: logType,
            message: `Message analyzed (${report.wordCount} words). Risk: ${report.riskLevel} (${report.score}/100). Flags: ${report.findings.length} detected.`
          });
        }
      }, 550);
    }

    btnAnalyze.addEventListener("click", runAnalysis);

    if (btnClear) {
      btnClear.addEventListener("click", () => {
        textarea.value = "";
        updateCounters();
        if (resultsContainer) resultsContainer.classList.add("hidden");
        if (loadingState) loadingState.classList.add("hidden");
        if (emptyState) emptyState.classList.remove("hidden");
        showToast("Message analyzer cleared", "success");
      });
    }

    function renderAnalyzerResults(report) {
      if (!resultsContainer) return;
      resultsContainer.classList.remove("hidden");

      let badgeBg = "bg-primary-container/10 border-primary-container/30 text-primary-container";
      let meterBg = "bg-primary-container";
      if (report.score >= 60) {
        badgeBg = "bg-error/15 border-error/40 text-error";
        meterBg = "bg-error shadow-[0_0_12px_rgba(255,51,102,0.4)]";
      } else if (report.score >= 28) {
        badgeBg = "bg-yellow-400/15 border-yellow-400/40 text-yellow-400";
        meterBg = "bg-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.4)]";
      }

      resultsContainer.innerHTML = `
        <div class="space-y-6 animate-fadeIn">
          <!-- Verdict Header Banner -->
          <div class="p-5 rounded-xl bg-surface-container border border-outline-variant flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div class="flex items-center gap-2 mb-2">
                <span class="font-mono text-xs font-bold px-2.5 py-1 rounded-full border ${badgeBg}">
                  ${report.riskLevel} (${report.score}/100)
                </span>
                <span class="font-mono text-xs text-outline">• Heuristic Analysis Complete</span>
              </div>
              <h4 class="font-display-xl text-lg font-bold text-primary">${report.verdictTitle}</h4>
              <p class="font-body-md text-sm text-on-surface-variant mt-1 max-w-2xl">${report.verdictSummary}</p>
            </div>
            <!-- Meter Gauge -->
            <div class="w-full md:w-56 p-3 rounded-lg bg-surface-container-lowest border border-outline-variant flex flex-col justify-center">
              <div class="flex justify-between font-mono text-xs mb-1">
                <span class="text-outline">Risk Level</span>
                <span class="font-bold text-on-surface">${report.score} / 100</span>
              </div>
              <div class="w-full h-2.5 bg-surface-container-highest rounded-full overflow-hidden">
                <div class="h-full rounded-full transition-all duration-700 ${meterBg}" style="width: ${report.score}%"></div>
              </div>
              <div class="flex justify-between font-mono text-[10px] text-outline mt-1">
                <span>0 Low</span>
                <span>50 Medium</span>
                <span>100 Critical</span>
              </div>
            </div>
          </div>

          <!-- Identified Warning Flags Breakdown -->
          <div>
            <h5 class="font-mono text-xs font-bold uppercase tracking-wider text-outline mb-3 flex items-center gap-1.5">
              <span class="material-symbols-outlined text-sm text-primary-container">warning</span>
              Detected Warning Signs &amp; Behavioral Flags (${report.findings.length})
            </h5>
            ${
              report.findings.length === 0
                ? `<div class="p-4 rounded-lg bg-surface-container/60 border border-outline-variant/60 text-sm text-on-surface-variant">
                    No overt phishing coercion, urgent credential requests, or bad TLD patterns detected in this input.
                   </div>`
                : `<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    ${report.findings.map(f => `
                      <div class="p-3.5 rounded-lg bg-surface-container-lowest border border-outline-variant hover:border-outline transition-colors">
                        <div class="flex items-center justify-between mb-1.5">
                          <span class="font-mono text-xs font-bold text-primary">${f.category}</span>
                          <span class="font-mono text-[10px] uppercase px-1.5 py-0.5 rounded ${
                            f.severity === 'CRITICAL'
                              ? 'bg-error/20 text-error border border-error/40'
                              : f.severity === 'HIGH'
                              ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/40'
                              : 'bg-primary-container/20 text-primary-container border border-primary-container/40'
                          }">+${f.weight} PTS</span>
                        </div>
                        <p class="font-body-md text-xs text-on-surface-variant mb-2">${f.explanation}</p>
                        ${
                          f.snippets.length > 0
                            ? `<div class="flex flex-wrap gap-1 font-mono text-[11px]">
                                <span class="text-outline">Trigger:</span>
                                ${f.snippets.map(s => `<span class="px-1.5 py-0.5 rounded bg-surface-container text-secondary-container font-mono border border-secondary-container/20">${escapeHtml(s)}</span>`).join("")}
                               </div>`
                            : ""
                        }
                      </div>
                    `).join("")}
                   </div>`
            }
          </div>

          <!-- Defanged URLs Section -->
          ${
            report.detectedUrls.length > 0
              ? `<div>
                  <h5 class="font-mono text-xs font-bold uppercase tracking-wider text-outline mb-2 flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-sm text-secondary-container">link_off</span>
                    Extracted &amp; Defanged URLs (Safe for Inspection)
                  </h5>
                  <div class="space-y-2">
                    ${report.detectedUrls.map(u => `
                      <div class="p-3 rounded-lg bg-surface-container-lowest border border-outline-variant flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-xs">
                        <div class="flex items-center gap-2 overflow-hidden">
                          <span class="material-symbols-outlined text-error text-sm">security_update_warning</span>
                          <code class="text-error font-bold truncate select-all">${escapeHtml(u.defanged)}</code>
                        </div>
                        <div class="flex items-center gap-2 text-[11px] text-outline">
                          ${u.isIp ? '<span class="px-1.5 py-0.5 rounded bg-error/20 text-error border border-error/30">Bare IP Host</span>' : ''}
                          ${u.isSuspiciousTld ? '<span class="px-1.5 py-0.5 rounded bg-yellow-400/20 text-yellow-400 border border-yellow-400/30">Risky TLD</span>' : ''}
                          ${u.isShortener ? '<span class="px-1.5 py-0.5 rounded bg-secondary-container/20 text-secondary-container border border-secondary-container/30">Shortened URL</span>' : ''}
                          <span class="text-outline">Defanged</span>
                        </div>
                      </div>
                    `).join("")}
                  </div>
                </div>`
              : ""
          }

          <!-- Actionable Recommendations & Preliminary Screening Disclaimer -->
          <div class="p-4 rounded-lg bg-surface-container/60 border border-outline-variant space-y-2">
            <h5 class="font-mono text-xs font-bold text-primary flex items-center gap-1.5">
              <span class="material-symbols-outlined text-sm text-primary-container">shield</span>
              Recommended Defensive Steps:
            </h5>
            <ul class="space-y-1.5 list-disc list-inside font-body-md text-xs text-on-surface-variant">
              ${report.recommendations.map(r => `<li>${r}</li>`).join("")}
            </ul>
            <div class="pt-2 border-t border-outline-variant/40 font-mono text-[11px] text-outline leading-relaxed">
              ⚠️ <strong>Notice:</strong> This analyzer provides preliminary heuristic screening for educational awareness and does not guarantee that any message is 100% safe. Always verify senders independently through established official channels.
            </div>
          </div>
        </div>
      `;
    }
  }

  /* ==========================================================================
     4. SUSPICIOUS URL INSPECTOR (NEW DEDICATED TOOL)
     ========================================================================== */
  function initUrlInspector() {
    const input = document.getElementById("url-inspector-input");
    const btnInspect = document.getElementById("btn-run-url-inspector");
    const btnClear = document.getElementById("btn-clear-url-inspector");
    const samplesContainer = document.getElementById("url-preset-samples");
    const resultsContainer = document.getElementById("url-results-wrapper");
    const emptyState = document.getElementById("url-empty-state");
    const loadingState = document.getElementById("url-loading-state");

    if (!input || !btnInspect) return;

    // Render Preset Samples
    if (samplesContainer) {
      samplesContainer.innerHTML = URL_INSPECTOR_SAMPLES.map(sample => `
        <button type="button" data-sample-url="${encodeURIComponent(sample.url)}" class="btn-sample-url px-3 py-1.5 rounded-lg bg-surface-container border border-outline-variant hover:border-secondary-container/60 hover:text-secondary-fixed transition-all text-xs font-mono text-left flex items-center gap-1.5 text-on-surface-variant">
          <span class="w-1.5 h-1.5 rounded-full ${sample.id === 'sample-legit' ? 'bg-primary-container' : 'bg-error'}"></span>
          <span>${sample.name}</span>
        </button>
      `).join("");

      samplesContainer.addEventListener("click", e => {
        const btn = e.target.closest(".btn-sample-url");
        if (!btn) return;
        const raw = decodeURIComponent(btn.getAttribute("data-sample-url"));
        input.value = raw;
        runUrlInspection();
      });
    }

    function runUrlInspection() {
      const urlText = input.value.trim();
      if (!urlText) {
        showToast("Please enter a URL to inspect.", "error");
        input.focus();
        return;
      }

      if (emptyState) emptyState.classList.add("hidden");
      if (resultsContainer) resultsContainer.classList.add("hidden");
      if (loadingState) loadingState.classList.remove("hidden");

      setTimeout(() => {
        const report = urlInspector.inspect(urlText);
        if (loadingState) loadingState.classList.add("hidden");

        if (report.error) {
          showToast(report.error, "error");
          if (emptyState) emptyState.classList.remove("hidden");
          return;
        }

        renderUrlResults(report);

        // Update local metrics
        State.metrics.urlInspectionsCount += 1;
        localStorage.setItem("cyber_sentinel_url_inspections", State.metrics.urlInspectionsCount.toString());
        updateDashboard();

        // Log to Security Event Console
        if (window.sentinelConsole) {
          const logType = report.riskScore >= 50 ? "ALERT" : (report.riskScore >= 25 ? "WARN" : "PASS");
          window.sentinelConsole.log({
            category: "URL_INSPECT",
            type: logType,
            message: `URL inspect: ${report.defangedUrl} | Host: ${report.parsed.hostname} | Severity: ${report.severity} (${report.riskScore}/100)`
          });
        }
      }, 500);
    }

    btnInspect.addEventListener("click", runUrlInspection);

    if (btnClear) {
      btnClear.addEventListener("click", () => {
        input.value = "";
        if (resultsContainer) resultsContainer.classList.add("hidden");
        if (loadingState) loadingState.classList.add("hidden");
        if (emptyState) emptyState.classList.remove("hidden");
        showToast("URL inspector cleared", "success");
      });
    }

    function renderUrlResults(report) {
      if (!resultsContainer) return;
      resultsContainer.classList.remove("hidden");

      let badgeBg = "bg-primary-container/10 border-primary-container/30 text-primary-container";
      let meterBg = "bg-primary-container";
      if (report.riskScore >= 75) {
        badgeBg = "bg-error/20 border-error/40 text-error";
        meterBg = "bg-error shadow-[0_0_12px_rgba(255,51,102,0.4)]";
      } else if (report.riskScore >= 50) {
        badgeBg = "bg-error/15 border-error/40 text-error";
        meterBg = "bg-error";
      } else if (report.riskScore >= 25) {
        badgeBg = "bg-yellow-400/15 border-yellow-400/40 text-yellow-400";
        meterBg = "bg-yellow-400";
      }

      resultsContainer.innerHTML = `
        <div class="space-y-6 animate-fadeIn">
          
          <!-- Summary Header Banner -->
          <div class="p-5 rounded-xl bg-surface-container border border-outline-variant flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div class="flex items-center gap-2 mb-2">
                <span class="font-mono text-xs font-bold px-2.5 py-1 rounded-full border ${badgeBg}">
                  ${report.severity} RISK (${report.riskScore}/100)
                </span>
                <span class="font-mono text-xs text-outline">• Structural Audit Complete</span>
              </div>
              <h4 class="font-display-xl text-lg font-bold text-primary">${report.verdictTitle}</h4>
              <p class="font-body-md text-sm text-on-surface-variant mt-1 max-w-2xl">${report.verdictSummary}</p>
            </div>
            
            <div class="w-full md:w-56 p-3 rounded-lg bg-surface-container-lowest border border-outline-variant flex flex-col justify-center">
              <div class="flex justify-between font-mono text-xs mb-1">
                <span class="text-outline">Risk Vector</span>
                <span class="font-bold text-on-surface">${report.riskScore} / 100</span>
              </div>
              <div class="w-full h-2.5 bg-surface-container-highest rounded-full overflow-hidden">
                <div class="h-full rounded-full transition-all duration-700 ${meterBg}" style="width: ${report.riskScore}%"></div>
              </div>
              <div class="flex justify-between font-mono text-[10px] text-outline mt-1">
                <span>0 Clean</span>
                <span>50 Suspicious</span>
                <span>100 Critical</span>
              </div>
            </div>
          </div>

          <!-- Defanged URL Safe View -->
          <div class="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant space-y-2">
            <span class="font-mono text-xs text-outline font-bold block uppercase tracking-wider">
              Defanged Inspected Address (Safe to copy):
            </span>
            <div class="flex items-center justify-between gap-2 flex-wrap font-mono text-xs">
              <code class="text-secondary-container font-bold text-sm truncate select-all">
                ${escapeHtml(report.defangedUrl)}
              </code>
              <span class="text-[11px] text-outline px-2 py-0.5 rounded bg-surface-container border border-outline-variant/60">
                Port: ${report.parsed.port} | Protocol: ${report.parsed.protocol}
              </span>
            </div>
          </div>

          <!-- Detailed Check Cards Grid -->
          <div>
            <h5 class="font-mono text-xs font-bold uppercase tracking-wider text-outline mb-3 flex items-center gap-1.5">
              <span class="material-symbols-outlined text-sm text-primary-container">fact_check</span>
              Structural &amp; Syntactic Security Checks (${report.checks.length})
            </h5>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              ${report.checks.map(c => {
                let statusBadge = "bg-primary-container/20 text-primary-container border-primary-container/40";
                let statusIcon = "check_circle";
                if (c.status === "FAIL") {
                  statusBadge = "bg-error/20 text-error border-error/40";
                  statusIcon = "cancel";
                } else if (c.status === "WARNING") {
                  statusBadge = "bg-yellow-400/20 text-yellow-400 border-yellow-400/40";
                  statusIcon = "warning";
                }

                return `
                  <div class="p-3.5 rounded-lg bg-surface-container-lowest border border-outline-variant">
                    <div class="flex items-center justify-between mb-1.5">
                      <span class="font-mono text-xs font-bold text-primary flex items-center gap-1.5">
                        <span class="material-symbols-outlined text-sm">${statusIcon}</span>
                        ${c.title}
                      </span>
                      <span class="font-mono text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border ${statusBadge}">
                        ${c.status}
                      </span>
                    </div>
                    <p class="font-body-md text-xs text-on-surface-variant leading-relaxed">${c.detail}</p>
                  </div>
                `;
              }).join("")}
            </div>
          </div>

          <!-- Recommendations & Technical Disclaimer -->
          <div class="p-4 rounded-lg bg-surface-container/60 border border-outline-variant space-y-2">
            <h5 class="font-mono text-xs font-bold text-primary flex items-center gap-1.5">
              <span class="material-symbols-outlined text-sm text-primary-container">shield</span>
              Safety Recommendations:
            </h5>
            <ul class="space-y-1.5 list-disc list-inside font-body-md text-xs text-on-surface-variant">
              ${report.recommendations.map(r => `<li>${r}</li>`).join("")}
            </ul>
            <div class="pt-2 border-t border-outline-variant/40 font-mono text-[11px] text-outline leading-relaxed">
              🔒 <strong>Safe Sandbox Guarantee:</strong> This URL was evaluated entirely client-side using structural syntax heuristics. No HTTP request was dispatched to the destination host, and no external code was executed. External reputation intelligence APIs (e.g., VirusTotal, Google Safe Browsing) have not been checked.
            </div>
          </div>
        </div>
      `;
    }
  }

  /* ==========================================================================
     5. THREAT INTELLIGENCE DASHBOARD (SIMULATION TELEMETRY)
     ========================================================================== */
  function initThreatIntel() {
    const filterTabsContainer = document.getElementById("threat-filter-tabs");
    const searchInput = document.getElementById("threat-search-input");
    const btnRefresh = document.getElementById("btn-refresh-threat-intel");

    if (window.threatIntelDashboard) {
      window.threatIntelDashboard.init();
    }

    if (filterTabsContainer) {
      filterTabsContainer.querySelectorAll("button").forEach(btn => {
        btn.addEventListener("click", () => {
          filterTabsContainer.querySelectorAll("button").forEach(b => {
            b.classList.remove("bg-primary-container", "text-on-primary-container", "font-bold");
            b.classList.add("bg-surface-container", "text-on-surface-variant");
          });
          btn.classList.add("bg-primary-container", "text-on-primary-container", "font-bold");
          btn.classList.remove("bg-surface-container", "text-on-surface-variant");

          const cat = btn.getAttribute("data-category") || "ALL";
          if (window.threatIntelDashboard) {
            window.threatIntelDashboard.currentCategory = cat.toUpperCase();
            window.threatIntelDashboard.render();
          }
        });
      });
    }

    if (searchInput) {
      searchInput.addEventListener("input", e => {
        if (window.threatIntelDashboard) {
          window.threatIntelDashboard.searchQuery = e.target.value;
          window.threatIntelDashboard.render();
        }
      });
    }

    if (btnRefresh) {
      btnRefresh.addEventListener("click", () => {
        btnRefresh.classList.add("opacity-50", "pointer-events-none");
        const icon = btnRefresh.querySelector(".material-symbols-outlined");
        if (icon) icon.classList.add("animate-spin");

        window.threatIntelDashboard.refresh(() => {
          window.threatIntelDashboard.render();
          btnRefresh.classList.remove("opacity-50", "pointer-events-none");
          if (icon) icon.classList.remove("animate-spin");
          showToast("Threat telemetry feed updated", "success");
        });
      });
    }
  }

  /* ==========================================================================
     6. SECURITY EVENT CONSOLE (LIVE AUDIT TERMINAL)
     ========================================================================== */
  function initEventConsole() {
    const filterTabs = document.getElementById("terminal-filter-tabs");
    const btnClear = document.getElementById("btn-clear-terminal");
    const btnExport = document.getElementById("btn-export-terminal");

    if (filterTabs) {
      filterTabs.querySelectorAll("button").forEach(btn => {
        btn.addEventListener("click", () => {
          filterTabs.querySelectorAll("button").forEach(b => {
            b.classList.remove("bg-primary-container", "text-on-primary-container", "font-bold");
            b.classList.add("bg-surface-container-high", "text-outline");
          });
          btn.classList.add("bg-primary-container", "text-on-primary-container", "font-bold");
          btn.classList.remove("bg-surface-container-high", "text-outline");

          const filter = btn.getAttribute("data-filter") || "ALL";
          if (window.sentinelConsole) {
            window.sentinelConsole.setFilter(filter);
          }
        });
      });
    }

    if (btnClear) {
      btnClear.addEventListener("click", () => {
        if (window.sentinelConsole) {
          window.sentinelConsole.clear();
          showToast("Terminal stream cleared", "success");
        }
      });
    }

    if (btnExport) {
      btnExport.addEventListener("click", () => {
        if (window.sentinelConsole) {
          window.sentinelConsole.exportLog();
          showToast("Security audit log exported as .log file", "success");
        }
      });
    }
  }

  /* ==========================================================================
     7. CYBER SAFETY QUIZ (10 QUESTIONS)
     ========================================================================== */
  function initCyberQuiz() {
    const questionCard = document.getElementById("quiz-question-card");
    const resultsCard = document.getElementById("quiz-results-card");
    const progressText = document.getElementById("quiz-progress-text");
    const progressBar = document.getElementById("quiz-progress-bar");
    const scoreLiveText = document.getElementById("quiz-score-live");
    const navPillsContainer = document.getElementById("quiz-nav-pills");
    const btnNext = document.getElementById("btn-quiz-next");
    const btnPrev = document.getElementById("btn-quiz-prev");
    const btnRetake = document.getElementById("btn-quiz-retake");

    if (!questionCard) return;

    function renderNavPills() {
      if (!navPillsContainer) return;
      navPillsContainer.innerHTML = CYBER_QUIZ_DATA.map((q, idx) => {
        const isAnswered = State.quiz.selectedAnswers[idx] !== null;
        const isCurrent = idx === State.quiz.currentQuestionIndex;
        let pillColor = "border-outline-variant bg-surface-container text-outline";

        if (isCurrent) {
          pillColor = "border-primary-container bg-primary-container text-on-primary-container font-bold shadow-[0_0_8px_rgba(0,255,136,0.3)]";
        } else if (isAnswered) {
          const selected = State.quiz.selectedAnswers[idx];
          const isCorrect = q.options[selected].correct;
          pillColor = isCorrect
            ? "border-primary-container/40 bg-surface-container text-primary-container"
            : "border-error/40 bg-surface-container text-error";
        }

        return `
          <button type="button" data-question-index="${idx}" class="w-8 h-8 rounded-lg border text-xs font-mono transition-all flex items-center justify-center ${pillColor}">
            ${idx + 1}
          </button>
        `;
      }).join("");

      navPillsContainer.querySelectorAll("button").forEach(btn => {
        btn.addEventListener("click", () => {
          const idx = parseInt(btn.getAttribute("data-question-index"), 10);
          State.quiz.currentQuestionIndex = idx;
          renderCurrentQuestion();
        });
      });
    }

    function renderCurrentQuestion() {
      const qIndex = State.quiz.currentQuestionIndex;
      const question = CYBER_QUIZ_DATA[qIndex];
      const selectedOptionIndex = State.quiz.selectedAnswers[qIndex];
      const isAnswered = selectedOptionIndex !== null;

      if (progressText) progressText.textContent = `QUESTION ${qIndex + 1} OF ${CYBER_QUIZ_DATA.length}`;
      if (progressBar) {
        const percent = ((qIndex + 1) / CYBER_QUIZ_DATA.length) * 100;
        progressBar.style.width = `${percent}%`;
      }
      if (scoreLiveText) scoreLiveText.textContent = `SCORE: ${State.quiz.score} / ${CYBER_QUIZ_DATA.length}`;

      renderNavPills();

      questionCard.innerHTML = `
        <div class="space-y-5 animate-fadeIn">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <span class="font-mono text-xs px-2.5 py-1 rounded bg-surface-container text-secondary-container border border-secondary-container/30">
              CATEGORY: ${question.category}
            </span>
            <span class="font-mono text-xs text-outline">
              Scenario ID: #SCN-0${qIndex + 1}
            </span>
          </div>

          <h3 class="font-display-xl text-lg sm:text-xl font-bold text-primary leading-snug">
            ${question.question}
          </h3>

          <div class="space-y-3 pt-2">
            ${question.options.map((opt, optIdx) => {
              let optStyle = "border-outline-variant bg-surface-container-lowest text-on-surface hover:border-primary-container/50 hover:bg-surface-container";
              let iconSymbol = "radio_button_unchecked";
              let badgeState = "";

              if (isAnswered) {
                if (optIdx === selectedOptionIndex) {
                  if (opt.correct) {
                    optStyle = "border-primary-container bg-primary-container/15 text-primary shadow-[0_0_12px_rgba(0,255,136,0.15)]";
                    iconSymbol = "check_circle";
                    badgeState = `<span class="font-mono text-[10px] px-2 py-0.5 rounded bg-primary-container text-on-primary-container font-bold">YOUR CHOICE (CORRECT)</span>`;
                  } else {
                    optStyle = "border-error bg-error/15 text-error shadow-[0_0_12px_rgba(255,51,102,0.15)]";
                    iconSymbol = "cancel";
                    badgeState = `<span class="font-mono text-[10px] px-2 py-0.5 rounded bg-error text-white font-bold">YOUR CHOICE (INCORRECT)</span>`;
                  }
                } else if (opt.correct) {
                  optStyle = "border-primary-container/70 bg-primary-container/10 text-primary";
                  iconSymbol = "check_circle";
                  badgeState = `<span class="font-mono text-[10px] px-2 py-0.5 rounded bg-primary-container/20 text-primary-container font-bold">CORRECT ANSWER</span>`;
                } else {
                  optStyle = "border-outline-variant/40 bg-surface-container-lowest/40 opacity-50 text-outline";
                }
              }

              return `
                <button type="button" data-option-index="${optIdx}" ${isAnswered ? "disabled" : ""} class="btn-quiz-option w-full p-4 rounded-xl border text-left flex items-start gap-3.5 transition-all ${optStyle}">
                  <span class="material-symbols-outlined text-lg mt-0.5 shrink-0 ${opt.correct && isAnswered ? 'text-primary-container' : (optIdx === selectedOptionIndex && !opt.correct ? 'text-error' : 'text-outline')}">${iconSymbol}</span>
                  <div class="flex-grow">
                    <div class="flex items-center justify-between gap-2 flex-wrap mb-1">
                      <span class="font-body-md text-sm sm:text-base font-medium">${escapeHtml(opt.text)}</span>
                      ${badgeState}
                    </div>
                  </div>
                </button>
              `;
            }).join("")}
          </div>

          ${
            isAnswered
              ? `
                <div class="mt-4 p-4 rounded-xl border ${
                  question.options[selectedOptionIndex].correct
                    ? 'bg-primary-container/10 border-primary-container/40 text-primary'
                    : 'bg-surface-container border-error/40 text-on-surface'
                } animate-fadeIn">
                  <div class="flex items-center gap-2 mb-2 font-mono text-xs font-bold ${
                    question.options[selectedOptionIndex].correct ? 'text-primary-container' : 'text-error'
                  }">
                    <span class="material-symbols-outlined text-base">${question.options[selectedOptionIndex].correct ? 'verified' : 'info'}</span>
                    <span>${question.options[selectedOptionIndex].correct ? 'EXCELLENT DEFENSIVE DECISION!' : 'SECURITY RISK IDENTIFIED'}</span>
                  </div>
                  <p class="font-body-md text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                    ${question.options[selectedOptionIndex].reason}
                  </p>
                  <div class="mt-3 pt-2.5 border-t border-outline-variant/30 flex items-center justify-between font-mono text-[11px] text-outline">
                    <span>💡 Pro-tip: ${question.hint}</span>
                  </div>
                </div>
              `
              : ""
          }
        </div>
      `;

      if (!isAnswered) {
        questionCard.querySelectorAll(".btn-quiz-option").forEach(btn => {
          btn.addEventListener("click", () => {
            const optIdx = parseInt(btn.getAttribute("data-option-index"), 10);
            selectAnswer(qIndex, optIdx);
          });
        });
      }

      if (btnPrev) btnPrev.disabled = qIndex === 0;
      if (btnNext) {
        if (qIndex === CYBER_QUIZ_DATA.length - 1) {
          btnNext.innerHTML = `<span>Finish Quiz &amp; View Results</span> <span class="material-symbols-outlined text-sm">military_tech</span>`;
        } else {
          btnNext.innerHTML = `<span>Next Scenario</span> <span class="material-symbols-outlined text-sm">arrow_forward</span>`;
        }
      }
    }

    function selectAnswer(qIndex, optIdx) {
      State.quiz.selectedAnswers[qIndex] = optIdx;
      const question = CYBER_QUIZ_DATA[qIndex];
      const isCorrect = question.options[optIdx].correct;
      if (isCorrect) {
        State.quiz.score += 1;
      }
      renderCurrentQuestion();

      // Log to Security Event Console
      if (window.sentinelConsole) {
        window.sentinelConsole.log({
          category: "QUIZ",
          type: isCorrect ? "PASS" : "WARN",
          message: `Scenario #${qIndex + 1} [${question.category}]: ${isCorrect ? "PASSED" : "FAILED (Lure Selected)"}`
        });
      }
    }

    if (btnPrev) {
      btnPrev.addEventListener("click", () => {
        if (State.quiz.currentQuestionIndex > 0) {
          State.quiz.currentQuestionIndex -= 1;
          renderCurrentQuestion();
        }
      });
    }

    if (btnNext) {
      btnNext.addEventListener("click", () => {
        if (State.quiz.currentQuestionIndex < CYBER_QUIZ_DATA.length - 1) {
          State.quiz.currentQuestionIndex += 1;
          renderCurrentQuestion();
        } else {
          finishQuiz();
        }
      });
    }

    function finishQuiz() {
      State.quiz.isFinished = true;
      if (questionCard) questionCard.classList.add("hidden");
      if (resultsCard) resultsCard.classList.remove("hidden");

      const score = State.quiz.score;
      const total = CYBER_QUIZ_DATA.length;
      const percent = Math.round((score / total) * 100);

      State.metrics.quizAttempts += 1;
      State.metrics.quizLastScore = score;
      if (score > State.metrics.quizBestScore) {
        State.metrics.quizBestScore = score;
      }
      localStorage.setItem("cyber_sentinel_quiz_attempts", State.metrics.quizAttempts.toString());
      localStorage.setItem("cyber_sentinel_quiz_last_score", State.metrics.quizLastScore.toString());
      localStorage.setItem("cyber_sentinel_quiz_best_score", State.metrics.quizBestScore.toString());

      updateDashboard();

      if (window.sentinelConsole) {
        window.sentinelConsole.log({
          category: "QUIZ",
          type: score >= 8 ? "SUCCESS" : (score >= 5 ? "INFO" : "WARN"),
          message: `Cyber Safety Quiz completed. Final score: ${score}/${total} (${percent}%).`
        });
      }

      let rankTitle = "Cyber Sentinel (Elite Posture)";
      let rankBadge = "bg-primary-container text-on-primary-container";
      let rankDesc = "Outstanding security awareness! You identified critical attack vectors across phishing, credentials, and financial fraud.";
      if (score < 5) {
        rankTitle = "Recruit (Needs Hardening)";
        rankBadge = "bg-error text-white";
        rankDesc = "You encountered several social engineering traps. Review the missed questions below to sharpen your defense instincts.";
      } else if (score < 8) {
        rankTitle = "Security Conscious Defender";
        rankBadge = "bg-yellow-400 text-black";
        rankDesc = "Solid foundation! You avoided major phishing lures but have a few areas to strengthen regarding OTPs and network security.";
      }

      const scoreValueEl = document.getElementById("quiz-final-score-val");
      const scoreTotalEl = document.getElementById("quiz-final-score-total");
      const scorePercentEl = document.getElementById("quiz-final-score-percent");
      const rankBadgeEl = document.getElementById("quiz-final-rank-badge");
      const rankDescEl = document.getElementById("quiz-final-rank-desc");
      const reviewContainer = document.getElementById("quiz-review-container");

      if (scoreValueEl) scoreValueEl.textContent = score.toString();
      if (scoreTotalEl) scoreTotalEl.textContent = `/ ${total}`;
      if (scorePercentEl) scorePercentEl.textContent = `${percent}% DEFENSE SCORE`;
      if (rankBadgeEl) {
        rankBadgeEl.className = `font-mono text-xs uppercase px-3 py-1 rounded-full font-bold ${rankBadge}`;
        rankBadgeEl.textContent = rankTitle;
      }
      if (rankDescEl) rankDescEl.textContent = rankDesc;

      if (reviewContainer) {
        reviewContainer.innerHTML = CYBER_QUIZ_DATA.map((q, idx) => {
          const userChoice = State.quiz.selectedAnswers[idx];
          const isCorrect = userChoice !== null && q.options[userChoice].correct;

          return `
            <div class="p-4 rounded-xl border ${isCorrect ? 'border-primary-container/30 bg-surface-container' : 'border-error/30 bg-surface-container'} space-y-2">
              <div class="flex items-center justify-between text-xs font-mono">
                <span class="${isCorrect ? 'text-primary-container font-bold' : 'text-error font-bold'} flex items-center gap-1">
                  <span class="material-symbols-outlined text-sm">${isCorrect ? 'check_circle' : 'cancel'}</span>
                  Question ${idx + 1}: ${isCorrect ? 'PASSED' : 'MISSED'}
                </span>
                <span class="text-outline">${q.category}</span>
              </div>
              <p class="font-body-md text-sm font-semibold text-primary">${q.question}</p>
              <div class="text-xs font-body-md text-on-surface-variant">
                ${
                  userChoice !== null
                    ? `<span class="text-outline">Your response:</span> ${escapeHtml(q.options[userChoice].text)}`
                    : `<span class="text-outline">No answer selected</span>`
                }
              </div>
              ${
                !isCorrect
                  ? `<div class="p-2.5 rounded bg-surface-container-lowest border border-outline-variant font-body-md text-xs text-primary-container">
                      <span class="font-bold">Correct defense:</span> ${escapeHtml(q.options.find(o => o.correct).text)}
                     </div>`
                  : ""
              }
              <div class="font-mono text-[11px] text-outline pt-1">
                ${q.options[q.options.findIndex(o => o.correct)].reason}
              </div>
            </div>
          `;
        }).join("");
      }
    }

    if (btnRetake) {
      btnRetake.addEventListener("click", () => {
        State.quiz.currentQuestionIndex = 0;
        State.quiz.selectedAnswers = new Array(CYBER_QUIZ_DATA.length).fill(null);
        State.quiz.score = 0;
        State.quiz.isFinished = false;

        if (resultsCard) resultsCard.classList.add("hidden");
        if (questionCard) questionCard.classList.remove("hidden");
        renderCurrentQuestion();
        showToast("Quiz reset! Good luck on your security test.", "success");
      });
    }

    renderCurrentQuestion();
  }

  /* ==========================================================================
     8. PASSWORD SECURITY LAB
     ========================================================================== */
  function initPasswordLab() {
    const input = document.getElementById("pwd-lab-input");
    const btnToggleVis = document.getElementById("btn-toggle-pwd-vis");
    const meterBar = document.getElementById("pwd-meter-bar");
    const meterLabel = document.getElementById("pwd-meter-label");
    const entropyVal = document.getElementById("pwd-entropy-val");
    const crackFastVal = document.getElementById("pwd-crack-fast");
    const crackSlowVal = document.getElementById("pwd-crack-slow");
    const checklistContainer = document.getElementById("pwd-checklist-indicators");
    const suggestionsContainer = document.getElementById("pwd-suggestions-list");

    const genLengthSlider = document.getElementById("gen-length-slider");
    const genLengthDisplay = document.getElementById("gen-length-display");
    const genUpperChk = document.getElementById("gen-chk-upper");
    const genLowerChk = document.getElementById("gen-chk-lower");
    const genNumChk = document.getElementById("gen-chk-numbers");
    const genSymChk = document.getElementById("gen-chk-symbols");
    const btnGenRandom = document.getElementById("btn-gen-random-pwd");
    const btnGenPassphrase = document.getElementById("btn-gen-passphrase");
    const genOutput = document.getElementById("gen-output-display");
    const btnCopyGen = document.getElementById("btn-copy-gen-pwd");
    const btnTestInLab = document.getElementById("btn-test-gen-pwd");

    if (!input) return;

    if (btnToggleVis) {
      btnToggleVis.addEventListener("click", () => {
        const isPassword = input.getAttribute("type") === "password";
        input.setAttribute("type", isPassword ? "text" : "password");
        const icon = btnToggleVis.querySelector(".material-symbols-outlined");
        if (icon) {
          icon.textContent = isPassword ? "visibility_off" : "visibility";
        }
      });
    }

    input.addEventListener("input", () => {
      const val = input.value;
      const res = passwordLab.evaluate(val);
      renderPasswordMetrics(res);

      if (val.length >= 8) {
        State.metrics.passwordChecksCount += 1;
        localStorage.setItem("cyber_sentinel_pwd_checks", State.metrics.passwordChecksCount.toString());
        updateDashboard();

        if (window.sentinelConsole) {
          window.sentinelConsole.log({
            category: "PASSWORD_LAB",
            type: "INFO",
            message: `Password evaluated. Length: ${res.length} | Entropy: ${res.entropyBits} bits | Rating: ${res.label}`
          });
        }
      }
    });

    function renderPasswordMetrics(res) {
      if (!meterBar || !meterLabel) return;

      if (res.isEmpty) {
        meterBar.style.width = "0%";
        meterBar.className = "h-full rounded-full transition-all duration-300 bg-outline-variant";
        meterLabel.textContent = "Awaiting Input";
        meterLabel.className = "font-mono text-xs text-outline font-bold";
        if (entropyVal) entropyVal.textContent = "0.0 Bits";
        if (crackFastVal) crackFastVal.textContent = "N/A";
        if (crackSlowVal) crackSlowVal.textContent = "N/A";
        renderChecklist(res.checks);
        return;
      }

      let barClass = "h-full rounded-full transition-all duration-500 ";
      let labelClass = "font-mono text-xs font-bold ";

      if (res.score >= 80) {
        barClass += "bg-primary-container shadow-[0_0_12px_rgba(0,255,136,0.4)]";
        labelClass += "text-primary-container";
      } else if (res.score >= 60) {
        barClass += "bg-secondary-container shadow-[0_0_10px_rgba(0,238,252,0.3)]";
        labelClass += "text-secondary-container";
      } else if (res.score >= 40) {
        barClass += "bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.3)]";
        labelClass += "text-yellow-400";
      } else {
        barClass += "bg-error shadow-[0_0_8px_rgba(255,51,102,0.3)]";
        labelClass += "text-error";
      }

      meterBar.className = barClass;
      meterBar.style.width = `${res.score}%`;
      meterLabel.className = labelClass;
      meterLabel.textContent = `${res.label} (${res.score}/100)`;

      if (entropyVal) entropyVal.textContent = `${res.entropyBits} Bits`;
      if (crackFastVal) crackFastVal.textContent = res.crackTimeFast;
      if (crackSlowVal) crackSlowVal.textContent = res.crackTimeSlow;

      renderChecklist(res.checks);

      if (suggestionsContainer) {
        suggestionsContainer.innerHTML = res.suggestions.map(s => `
          <li class="flex items-start gap-1.5 text-xs text-on-surface-variant font-body-md">
            <span class="material-symbols-outlined text-sm text-secondary-container shrink-0 mt-0.5">lightbulb</span>
            <span>${s}</span>
          </li>
        `).join("");
      }
    }

    function renderChecklist(checks) {
      if (!checklistContainer) return;
      const items = [
        { label: "12+ Characters Length", passed: checks.length12 },
        { label: "16+ Ideal Length", passed: checks.length16 },
        { label: "Lowercase & Uppercase Mix", passed: checks.hasLower && checks.hasUpper },
        { label: "Numeric Digits (0-9)", passed: checks.hasNumber },
        { label: "Special Symbols (!@#$)", passed: checks.hasSymbol },
        { label: "Free of Dictionary Words", passed: checks.noCommonPattern }
      ];

      checklistContainer.innerHTML = items.map(item => `
        <div class="flex items-center gap-2 font-mono text-xs p-2 rounded bg-surface-container-lowest border ${item.passed ? 'border-primary-container/40 text-primary-container' : 'border-outline-variant/40 text-outline'}">
          <span class="material-symbols-outlined text-sm">${item.passed ? 'check_circle' : 'radio_button_unchecked'}</span>
          <span>${item.label}</span>
        </div>
      `).join("");
    }

    if (genLengthSlider && genLengthDisplay) {
      genLengthSlider.addEventListener("input", () => {
        genLengthDisplay.textContent = `${genLengthSlider.value} chars`;
      });
    }

    function generateNewPassword() {
      const len = parseInt(genLengthSlider ? genLengthSlider.value : "16", 10);
      const upper = genUpperChk ? genUpperChk.checked : true;
      const lower = genLowerChk ? genLowerChk.checked : true;
      const numbers = genNumChk ? genNumChk.checked : true;
      const symbols = genSymChk ? genSymChk.checked : true;

      const pwd = passwordLab.generatePassword({
        length: len,
        includeUpper: upper,
        includeLower: lower,
        includeNumbers: numbers,
        includeSymbols: symbols
      });

      if (genOutput) genOutput.value = pwd;

      if (window.sentinelConsole) {
        window.sentinelConsole.log({
          category: "PASSWORD_LAB",
          type: "SUCCESS",
          message: `Generated cryptographically secure random password (${len} characters).`
        });
      }
    }

    if (btnGenRandom) {
      btnGenRandom.addEventListener("click", generateNewPassword);
    }

    if (btnGenPassphrase) {
      btnGenPassphrase.addEventListener("click", () => {
        const passphrase = passwordLab.generatePassphrase(4, "-");
        if (genOutput) genOutput.value = passphrase;

        if (window.sentinelConsole) {
          window.sentinelConsole.log({
            category: "PASSWORD_LAB",
            type: "SUCCESS",
            message: "Generated 4-word Diceware-style memorable passphrase."
          });
        }
      });
    }

    if (btnCopyGen && genOutput) {
      btnCopyGen.addEventListener("click", async () => {
        if (!genOutput.value) return;
        try {
          await navigator.clipboard.writeText(genOutput.value);
          showToast("Generated credential copied to clipboard!", "success");
        } catch (err) {
          genOutput.select();
          document.execCommand("copy");
          showToast("Password copied to clipboard!", "success");
        }
      });
    }

    if (btnTestInLab && genOutput) {
      btnTestInLab.addEventListener("click", () => {
        if (!genOutput.value) return;
        input.value = genOutput.value;
        input.dispatchEvent(new Event("input"));
        input.scrollIntoView({ behavior: "smooth" });
        showToast("Transferred to strength meter for local inspection", "success");
      });
    }

    generateNewPassword();
  }

  /* ==========================================================================
     9. PRIVACY & HARDENING CHECKLIST
     ========================================================================== */
  function initPrivacyChecklist() {
    const listContainer = document.getElementById("checklist-tasks-container");
    const progressBar = document.getElementById("checklist-progress-bar");
    const progressPercentText = document.getElementById("checklist-percent-text");
    const progressCountText = document.getElementById("checklist-count-text");
    const filterTabsContainer = document.getElementById("checklist-filter-tabs");
    const btnReset = document.getElementById("btn-reset-checklist");

    if (!listContainer) return;

    function renderChecklistItems() {
      const filtered = PRIVACY_CHECKLIST_DATA.filter(item => {
        if (State.checklist.currentFilter === "all") return true;
        return item.category.toLowerCase().includes(State.checklist.currentFilter.toLowerCase());
      });

      listContainer.innerHTML = filtered.map(item => {
        const isDone = State.checklist.completedIds.includes(item.id);

        return `
          <label class="group flex items-start gap-3.5 p-4 rounded-xl border cursor-pointer transition-all ${
            isDone
              ? 'bg-surface-container/60 border-primary-container/40 shadow-[0_0_12px_rgba(0,255,136,0.06)]'
              : 'bg-surface-container-lowest border-outline-variant hover:border-outline hover:bg-surface-container/40'
          }">
            <input type="checkbox" data-task-id="${item.id}" ${isDone ? "checked" : ""} class="task-checkbox mt-1 w-4 h-4 rounded bg-surface-container border-outline-variant text-primary-container focus:ring-primary-container cursor-pointer"/>
            <div class="flex-grow">
              <div class="flex items-center justify-between gap-2 flex-wrap mb-1">
                <span class="font-display-xl text-sm sm:text-base font-bold ${isDone ? 'text-primary' : 'text-on-surface'} group-hover:text-primary transition-colors">
                  ${item.title}
                </span>
                <span class="font-mono text-[10px] px-2 py-0.5 rounded bg-surface-container text-secondary-container border border-secondary-container/20">
                  ${item.difficulty}
                </span>
              </div>
              <p class="font-body-md text-xs text-on-surface-variant mb-1.5 leading-relaxed">${item.desc}</p>
              <div class="font-mono text-[11px] text-outline flex items-center gap-1.5">
                <span class="material-symbols-outlined text-xs text-primary-container">info</span>
                <span>Why: ${item.why}</span>
              </div>
            </div>
          </label>
        `;
      }).join("");

      listContainer.querySelectorAll(".task-checkbox").forEach(box => {
        box.addEventListener("change", e => {
          const id = e.target.getAttribute("data-task-id");
          const task = PRIVACY_CHECKLIST_DATA.find(t => t.id === id);
          if (e.target.checked) {
            if (!State.checklist.completedIds.includes(id)) {
              State.checklist.completedIds.push(id);
              showToast("Security hygiene control marked complete!", "success");
              if (window.sentinelConsole && task) {
                window.sentinelConsole.log({
                  category: "CHECKLIST",
                  type: "PASS",
                  message: `Hygiene control verified: "${task.title}"`
                });
              }
            }
          } else {
            State.checklist.completedIds = State.checklist.completedIds.filter(x => x !== id);
          }
          localStorage.setItem("cyber_sentinel_checklist", JSON.stringify(State.checklist.completedIds));
          updateChecklistProgress();
          renderChecklistItems();
          updateDashboard();
        });
      });
    }

    function updateChecklistProgress() {
      const completed = State.checklist.completedIds.length;
      const total = PRIVACY_CHECKLIST_DATA.length;
      const percent = Math.round((completed / total) * 100);

      if (progressBar) progressBar.style.width = `${percent}%`;
      if (progressPercentText) progressPercentText.textContent = `${percent}% HARDENED`;
      if (progressCountText) progressCountText.textContent = `${completed} of ${total} security hygiene controls implemented`;
    }

    if (filterTabsContainer) {
      filterTabsContainer.querySelectorAll("button").forEach(btn => {
        btn.addEventListener("click", () => {
          filterTabsContainer.querySelectorAll("button").forEach(b => {
            b.classList.remove("bg-primary-container", "text-on-primary-container", "font-bold");
            b.classList.add("bg-surface-container", "text-on-surface-variant");
          });
          btn.classList.add("bg-primary-container", "text-on-primary-container", "font-bold");
          btn.classList.remove("bg-surface-container", "text-on-surface-variant");

          State.checklist.currentFilter = btn.getAttribute("data-filter") || "all";
          renderChecklistItems();
        });
      });
    }

    if (btnReset) {
      btnReset.addEventListener("click", () => {
        if (confirm("Reset your privacy checklist progress back to zero?")) {
          State.checklist.completedIds = [];
          localStorage.setItem("cyber_sentinel_checklist", JSON.stringify([]));
          updateChecklistProgress();
          renderChecklistItems();
          updateDashboard();
          showToast("Checklist reset successfully", "success");

          if (window.sentinelConsole) {
            window.sentinelConsole.log({
              category: "CHECKLIST",
              type: "WARN",
              message: "User reset Privacy Hardening Checklist progress."
            });
          }
        }
      });
    }

    renderChecklistItems();
    updateChecklistProgress();
  }

  /* ==========================================================================
     10. STUDENT SCAM RADAR & INCIDENT RESPONSE
     ========================================================================== */
  function initScamRadar() {
    const gridContainer = document.getElementById("scam-radar-cards-grid");
    const filterContainer = document.getElementById("scam-filter-tabs");
    const searchInput = document.getElementById("scam-search-input");
    const modalEl = document.getElementById("scam-inspect-modal");
    const modalContent = document.getElementById("scam-modal-body");
    const btnCloseModal = document.getElementById("btn-close-scam-modal");

    if (!gridContainer) return;

    function renderScamCards() {
      const query = State.scamRadar.searchQuery.toLowerCase().trim();
      const filtered = SCAM_RADAR_DATA.filter(scam => {
        const matchesCategory = State.scamRadar.currentFilter === "all" ||
          scam.category.toLowerCase().includes(State.scamRadar.currentFilter.toLowerCase());
        const matchesSearch = !query ||
          scam.title.toLowerCase().includes(query) ||
          scam.summary.toLowerCase().includes(query) ||
          scam.category.toLowerCase().includes(query);
        return matchesCategory && matchesSearch;
      });

      if (filtered.length === 0) {
        gridContainer.innerHTML = `
          <div class="col-span-full p-8 rounded-xl bg-surface-container border border-outline-variant text-center font-mono text-sm text-outline">
            No student threat advisories found matching "${escapeHtml(State.scamRadar.searchQuery)}".
          </div>
        `;
        return;
      }

      gridContainer.innerHTML = filtered.map(scam => `
        <article class="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 hover:border-primary-container/60 transition-all flex flex-col justify-between group">
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="font-mono text-[10px] uppercase px-2.5 py-0.5 rounded font-bold ${
                scam.severity === 'CRITICAL'
                  ? 'bg-error/20 text-error border border-error/40'
                  : 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/40'
              }">
                ${scam.severity}
              </span>
              <span class="font-mono text-xs text-outline">${scam.category}</span>
            </div>
            <h4 class="font-display-xl text-base sm:text-lg font-bold text-primary group-hover:text-primary-container transition-colors mb-2">
              ${scam.title}
            </h4>
            <p class="font-body-md text-xs sm:text-sm text-on-surface-variant line-clamp-3 mb-4 leading-relaxed">
              ${scam.summary}
            </p>
          </div>
          <div class="pt-4 border-t border-outline-variant/40 flex items-center justify-between">
            <span class="font-mono text-xs text-outline flex items-center gap-1">
              <span class="material-symbols-outlined text-sm text-secondary-container">policy</span>
              ${scam.redFlags.length} Key Red Flags
            </span>
            <button type="button" data-scam-id="${scam.id}" class="btn-inspect-scam font-mono text-xs font-bold text-primary-container flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Inspect Scam</span>
              <span class="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </article>
      `).join("");

      gridContainer.querySelectorAll(".btn-inspect-scam").forEach(btn => {
        btn.addEventListener("click", () => {
          const id = btn.getAttribute("data-scam-id");
          openScamModal(id);
        });
      });
    }

    function openScamModal(scamId) {
      const scam = SCAM_RADAR_DATA.find(s => s.id === scamId);
      if (!scam || !modalEl || !modalContent) return;

      modalContent.innerHTML = `
        <div class="space-y-6">
          <div class="flex items-center justify-between pb-3 border-b border-outline-variant/60">
            <div>
              <span class="font-mono text-xs px-2.5 py-1 rounded bg-surface-container-high text-secondary-container border border-secondary-container/30">
                ${scam.category}
              </span>
              <h3 class="font-display-xl text-xl font-bold text-primary mt-2">${scam.title}</h3>
            </div>
          </div>

          <div>
            <h5 class="font-mono text-xs font-bold uppercase tracking-wider text-outline mb-2 flex items-center gap-1.5">
              <span class="material-symbols-outlined text-sm text-error">chat</span>
              Realistic Attack Scenario Mockup (${scam.mockup.channel})
            </h5>
            <div class="rounded-xl border border-outline-variant bg-surface-container-lowest p-4 font-mono text-xs text-on-surface space-y-2">
              <div class="flex items-center justify-between text-outline text-[11px] pb-2 border-b border-outline-variant/30">
                <span>Sender: <strong class="text-on-surface">${scam.mockup.sender}</strong></span>
                <span>${scam.mockup.timestamp}</span>
              </div>
              <div class="whitespace-pre-line text-xs sm:text-sm text-on-surface-variant font-mono leading-relaxed pt-1">
                ${escapeHtml(scam.mockup.text)}
              </div>
            </div>
          </div>

          <div>
            <h5 class="font-mono text-xs font-bold uppercase tracking-wider text-outline mb-2.5 flex items-center gap-1.5">
              <span class="material-symbols-outlined text-sm text-yellow-400">warning</span>
              Critical Warning Flags to Identify
            </h5>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              ${scam.redFlags.map(rf => `
                <div class="p-3 rounded-lg bg-surface-container border border-outline-variant">
                  <span class="font-mono text-xs font-bold text-primary block mb-1">⚠️ ${rf.tag}</span>
                  <p class="font-body-md text-xs text-on-surface-variant">${rf.desc}</p>
                </div>
              `).join("")}
            </div>
          </div>

          <div class="p-3.5 rounded-lg bg-surface-container-high border border-outline-variant/60 text-xs">
            <span class="font-mono text-xs font-bold text-secondary-container block mb-1">Attacker Psychology &amp; Vector:</span>
            <p class="font-body-md text-on-surface-variant">${scam.psychology}</p>
          </div>

          <div class="p-4 rounded-xl bg-primary-container/10 border border-primary-container/40 space-y-2">
            <h5 class="font-mono text-xs font-bold text-primary flex items-center gap-1.5">
              <span class="material-symbols-outlined text-sm text-primary-container">verified_user</span>
              3 Golden Rules to Defend Yourself:
            </h5>
            <ul class="space-y-1.5 list-disc list-inside font-body-md text-xs text-primary">
              ${scam.defenseRules.map(r => `<li>${r}</li>`).join("")}
            </ul>
          </div>
        </div>
      `;

      modalEl.classList.remove("hidden");

      if (window.sentinelConsole) {
        window.sentinelConsole.log({
          category: "SYSTEM",
          type: "INFO",
          message: `Inspected Student Scam Advisory: "${scam.title}" [${scam.category}]`
        });
      }
    }

    if (btnCloseModal && modalEl) {
      btnCloseModal.addEventListener("click", () => modalEl.classList.add("hidden"));
      modalEl.addEventListener("click", e => {
        if (e.target === modalEl) modalEl.classList.add("hidden");
      });
    }

    if (filterContainer) {
      filterContainer.querySelectorAll("button").forEach(btn => {
        btn.addEventListener("click", () => {
          filterContainer.querySelectorAll("button").forEach(b => {
            b.classList.remove("bg-primary-container", "text-on-primary-container", "font-bold");
            b.classList.add("bg-surface-container", "text-on-surface-variant");
          });
          btn.classList.add("bg-primary-container", "text-on-primary-container", "font-bold");
          btn.classList.remove("bg-surface-container", "text-on-surface-variant");

          State.scamRadar.currentFilter = btn.getAttribute("data-category") || "all";
          renderScamCards();
        });
      });
    }

    if (searchInput) {
      searchInput.addEventListener("input", e => {
        State.scamRadar.searchQuery = e.target.value;
        renderScamCards();
      });
    }

    renderScamCards();
  }

  function initIncidentGuide() {
    const tabsContainer = document.getElementById("incident-guide-tabs");
    const contentContainer = document.getElementById("incident-guide-content");
    const btnPrint = document.getElementById("btn-print-incident-plan");

    if (!tabsContainer || !contentContainer) return;

    function renderIncidentTabs() {
      tabsContainer.innerHTML = INCIDENT_GUIDE_DATA.map(inc => {
        const isActive = inc.id === State.incidentGuide.activeIncidentId;
        return `
          <button type="button" data-incident-id="${inc.id}" class="w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between gap-2 ${
            isActive
              ? 'bg-surface-container border-primary-container/80 text-primary-container shadow-[0_0_12px_rgba(0,255,136,0.1)]'
              : 'bg-surface-container-lowest border-outline-variant text-on-surface-variant hover:border-outline hover:text-on-surface'
          }">
            <div class="flex items-center gap-2.5">
              <span class="material-symbols-outlined text-lg ${isActive ? 'text-primary-container' : 'text-outline'}">${inc.icon}</span>
              <span class="font-mono text-xs sm:text-sm font-bold">${inc.title}</span>
            </div>
            <span class="material-symbols-outlined text-sm ${isActive ? 'text-primary-container' : 'text-outline'}">arrow_forward</span>
          </button>
        `;
      }).join("");

      tabsContainer.querySelectorAll("button").forEach(btn => {
        btn.addEventListener("click", () => {
          State.incidentGuide.activeIncidentId = btn.getAttribute("data-incident-id");
          renderIncidentTabs();
          renderIncidentContent();
        });
      });
    }

    function renderIncidentContent() {
      const active = INCIDENT_GUIDE_DATA.find(i => i.id === State.incidentGuide.activeIncidentId) || INCIDENT_GUIDE_DATA[0];

      contentContainer.innerHTML = `
        <div class="space-y-6 animate-fadeIn">
          <div class="p-4 rounded-xl bg-error/10 border border-error/40 flex items-start gap-3">
            <span class="material-symbols-outlined text-error text-xl shrink-0 mt-0.5">warning</span>
            <div>
              <span class="font-mono text-xs font-bold text-error uppercase">${active.severity} INCIDENT TRIAGE</span>
              <h4 class="font-display-xl text-lg font-bold text-primary mt-0.5">${active.title}</h4>
              <p class="font-body-md text-xs text-on-surface-variant mt-1">${active.urgencyText}</p>
            </div>
          </div>

          <div class="space-y-6">
            ${active.phases.map((phaseObj, phaseIdx) => `
              <div class="space-y-3">
                <h5 class="font-mono text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                  <span class="w-5 h-5 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-[10px] font-bold">
                    ${phaseIdx + 1}
                  </span>
                  ${phaseObj.phase}
                </h5>
                <div class="space-y-2.5">
                  ${phaseObj.steps.map((st, stepIdx) => {
                    const stepKey = `${active.id}_p${phaseIdx}_s${stepIdx}`;
                    const isChecked = !!State.incidentGuide.checkedSteps[stepKey];

                    return `
                      <label class="flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-colors ${
                        isChecked
                          ? 'bg-surface-container/60 border-primary-container/40'
                          : 'bg-surface-container-lowest border-outline-variant hover:border-outline'
                      }">
                        <input type="checkbox" data-step-key="${stepKey}" ${isChecked ? "checked" : ""} class="incident-step-chk mt-1 w-4 h-4 rounded bg-surface-container border-outline-variant text-primary-container focus:ring-primary-container"/>
                        <div>
                          <span class="font-display-xl text-xs sm:text-sm font-bold ${isChecked ? 'line-through text-outline' : 'text-primary'} block">
                            ${st.title}
                          </span>
                          <span class="font-body-md text-xs text-on-surface-variant block mt-0.5">
                            ${st.desc}
                          </span>
                        </div>
                      </label>
                    `;
                  }).join("")}
                </div>
              </div>
            `).join("")}
          </div>

          <div class="p-4 rounded-xl bg-surface-container border border-outline-variant space-y-3">
            <h5 class="font-mono text-xs font-bold uppercase tracking-wider text-secondary-container flex items-center gap-1.5">
              <span class="material-symbols-outlined text-sm">support_agent</span>
              Emergency Cyber Crime Helplines
            </h5>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
              <div class="p-2.5 rounded bg-surface-container-lowest border border-outline-variant">
                <span class="text-outline block text-[10px]">National Cybercrime Helpline (India)</span>
                <strong class="text-primary-container text-sm">Dial 1930</strong>
                <span class="text-on-surface-variant block text-[11px] mt-0.5">Immediate financial fraud freeze</span>
              </div>
              <div class="p-2.5 rounded bg-surface-container-lowest border border-outline-variant">
                <span class="text-outline block text-[10px]">Official Web Portal</span>
                <strong class="text-secondary-container text-sm">cybercrime.gov.in</strong>
                <span class="text-on-surface-variant block text-[11px] mt-0.5">Submit complaint with UTR</span>
              </div>
            </div>
          </div>
        </div>
      `;

      contentContainer.querySelectorAll(".incident-step-chk").forEach(chk => {
        chk.addEventListener("change", e => {
          const key = e.target.getAttribute("data-step-key");
          State.incidentGuide.checkedSteps[key] = e.target.checked;
          localStorage.setItem("cyber_sentinel_incident_steps", JSON.stringify(State.incidentGuide.checkedSteps));
          renderIncidentContent();
        });
      });
    }

    if (btnPrint) {
      btnPrint.addEventListener("click", () => {
        window.print();
      });
    }

    renderIncidentTabs();
    renderIncidentContent();
  }

  /* ==========================================================================
     11. USER AUTHENTICATION & DASHBOARD PROFILE INTEGRATION
     ========================================================================== */
  function initUserAuth() {
    const navAuthBtn = document.getElementById("nav-auth-btn");
    const navUserChip = document.getElementById("nav-user-chip");
    const navUserName = document.getElementById("nav-user-name");
    const navDropdownName = document.getElementById("nav-dropdown-name");
    const navDropdownEmail = document.getElementById("nav-dropdown-email");
    const navDropdownPhone = document.getElementById("nav-dropdown-phone");
    const btnSignout = document.getElementById("btn-user-signout");
    const mobileAuthSection = document.getElementById("mobile-auth-section");

    const dashUserName = document.getElementById("dash-user-name");
    const dashUserStatusPill = document.getElementById("dash-user-status-pill");
    const dashUserContact = document.getElementById("dash-user-contact");
    const dashAuthActionBtn = document.getElementById("dash-auth-action-btn");
    const dashAuthBtnLabel = document.getElementById("dash-auth-btn-label");

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("auth") === "success") {
      showToast("Identity verified! Welcome to Cyber Defense Sentinel.", "success");
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    function renderUserSession() {
      const userJson = localStorage.getItem("cyber_sentinel_user");
      let user = null;
      if (userJson) {
        try {
          user = JSON.parse(userJson);
        } catch (e) {}
      }

      if (user && user.verified) {
        if (navAuthBtn) navAuthBtn.classList.add("hidden");
        if (navUserChip) navUserChip.classList.remove("hidden");
        if (navUserName) navUserName.textContent = user.name;
        if (navDropdownName) navDropdownName.textContent = user.name;
        if (navDropdownEmail) navDropdownEmail.textContent = user.email;
        if (navDropdownPhone) navDropdownPhone.textContent = user.phone;

        if (mobileAuthSection) {
          mobileAuthSection.innerHTML = `
            <div class="py-1">
              <span class="text-primary-container font-bold block">${escapeHtml(user.name)}</span>
              <span class="text-outline text-[11px] block">${escapeHtml(user.email)}</span>
              <button id="btn-mobile-signout" type="button" class="text-error text-xs hover:underline mt-1 flex items-center gap-1">
                <span class="material-symbols-outlined text-xs">logout</span>
                <span>Sign Out</span>
              </button>
            </div>
          `;
          const mobileSignoutBtn = document.getElementById("btn-mobile-signout");
          if (mobileSignoutBtn) {
            mobileSignoutBtn.addEventListener("click", signOutUser);
          }
        }

        if (dashUserName) dashUserName.textContent = user.name;
        if (dashUserStatusPill) {
          dashUserStatusPill.className = "font-mono text-[10px] px-2 py-0.5 rounded bg-primary-container/20 border border-primary-container/40 text-primary-container font-bold";
          dashUserStatusPill.textContent = "VERIFIED STUDENT (2FA/OTP)";
        }
        if (dashUserContact) {
          dashUserContact.innerHTML = `Linked ID: <strong class="text-primary">${escapeHtml(user.email)}</strong> • Contact: <strong class="text-secondary-container">${escapeHtml(user.phone)}</strong>`;
        }
        if (dashAuthActionBtn) {
          dashAuthActionBtn.href = "login.html";
        }
        if (dashAuthBtnLabel) {
          dashAuthBtnLabel.textContent = "Switch Profile";
        }
      } else {
        if (navAuthBtn) navAuthBtn.classList.remove("hidden");
        if (navUserChip) navUserChip.classList.add("hidden");

        if (dashUserName) dashUserName.textContent = "Guest Student";
        if (dashUserStatusPill) {
          dashUserStatusPill.className = "font-mono text-[10px] px-2 py-0.5 rounded bg-surface-container-high border border-outline-variant text-outline";
          dashUserStatusPill.textContent = "UNAUTHENTICATED";
        }
        if (dashUserContact) {
          dashUserContact.textContent = "Authenticate your profile to link your quiz score & privacy credentials.";
        }
        if (dashAuthBtnLabel) {
          dashAuthBtnLabel.textContent = "Login with OTP";
        }
      }
    }

    function signOutUser() {
      localStorage.removeItem("cyber_sentinel_user");
      renderUserSession();
      showToast("Signed out successfully. Switched to guest mode.", "success");
      if (window.sentinelConsole) {
        window.sentinelConsole.log({
          category: "AUTH",
          type: "INFO",
          message: "User signed out. Profile switched to anonymous guest session."
        });
      }
    }

    if (btnSignout) {
      btnSignout.addEventListener("click", signOutUser);
    }

    renderUserSession();
  }

  /* ==========================================================================
     12. LEARNING DASHBOARD & LOCAL METRICS
     ========================================================================== */
  function updateDashboard() {
    const quizBestEl = document.getElementById("dash-quiz-best");
    const quizAttemptsEl = document.getElementById("dash-quiz-attempts");
    const checklistProgressEl = document.getElementById("dash-checklist-progress");
    const checklistBarEl = document.getElementById("dash-checklist-bar");
    const toolsUsedEl = document.getElementById("dash-tools-used");
    const readinessBadgeEl = document.getElementById("dash-readiness-badge");
    const readinessDescEl = document.getElementById("dash-readiness-desc");
    const suggestionsListEl = document.getElementById("dash-suggested-topics");
    const btnResetAll = document.getElementById("btn-reset-all-data");

    const quizBest = State.metrics.quizBestScore;
    const checklistDone = State.checklist.completedIds.length;
    const checklistTotal = PRIVACY_CHECKLIST_DATA.length;
    const checklistPercent = Math.round((checklistDone / checklistTotal) * 100);
    const toolsUsedCount = (State.metrics.phishingScansCount > 0 ? 1 : 0) +
      (State.metrics.urlInspectionsCount > 0 ? 1 : 0) +
      (State.metrics.passwordChecksCount > 0 ? 1 : 0) +
      (State.metrics.quizAttempts > 0 ? 1 : 0) +
      (checklistDone > 0 ? 1 : 0);

    if (quizBestEl) quizBestEl.textContent = `${quizBest} / 10`;
    if (quizAttemptsEl) quizAttemptsEl.textContent = `${State.metrics.quizAttempts} Total Attempts`;
    if (checklistProgressEl) checklistProgressEl.textContent = `${checklistDone} / ${checklistTotal} (${checklistPercent}%)`;
    if (checklistBarEl) checklistBarEl.style.width = `${checklistPercent}%`;
    if (toolsUsedEl) toolsUsedEl.textContent = `${toolsUsedCount} / 5 Tools`;

    let levelTitle = "Level 1: Recruit";
    let levelColor = "bg-error/20 text-error border-error/40";
    let levelDesc = "Complete the Cyber Safety Quiz and check off privacy items to harden your profile.";

    const totalReadinessScore = (quizBest * 5) + (checklistPercent * 0.3) + (State.metrics.phishingScansCount > 0 ? 10 : 0) + (State.metrics.urlInspectionsCount > 0 ? 10 : 0);

    if (totalReadinessScore >= 85) {
      levelTitle = "Level 4: Sentinel Guardian";
      levelColor = "bg-primary-container text-on-primary-container shadow-[0_0_12px_rgba(0,255,136,0.4)]";
      levelDesc = "Exceptional defense posture! You maintain high quiz readiness, robust password hygiene, and verified device encryption.";
    } else if (totalReadinessScore >= 60) {
      levelTitle = "Level 3: Cyber Defender";
      levelColor = "bg-secondary-container/20 text-secondary-container border-secondary-container/40";
      levelDesc = "Solid security awareness. Complete remaining controls to achieve Sentinel status.";
    } else if (totalReadinessScore >= 30) {
      levelTitle = "Level 2: Security Conscious";
      levelColor = "bg-yellow-400/20 text-yellow-400 border-yellow-400/40";
      levelDesc = "Good start! Test suspicious messages in the Phishing Analyzer and review URL syntax.";
    }

    if (readinessBadgeEl) {
      readinessBadgeEl.className = `font-mono text-xs uppercase px-3 py-1 rounded-full font-bold border ${levelColor}`;
      readinessBadgeEl.textContent = levelTitle;
    }
    if (readinessDescEl) readinessDescEl.textContent = levelDesc;

    if (suggestionsListEl) {
      const suggestions = [];

      if (State.metrics.phishingScansCount === 0) {
        suggestions.push({
          title: "Run Phishing Message Screening",
          desc: "Paste suspicious chat or SMS lures into the heuristic analyzer to detect coercion indicators.",
          target: "#phishing-analyzer",
          btnText: "Open Analyzer"
        });
      }

      if (State.metrics.urlInspectionsCount === 0) {
        suggestions.push({
          title: "Inspect a Suspicious URL",
          desc: "Audit domains for lookalike subdomains, bare IP hostnames, and deceptive redirectors.",
          target: "#url-inspector",
          btnText: "Inspect URL"
        });
      }

      if (quizBest < 8) {
        suggestions.push({
          title: "Master Threat Detection in the Quiz",
          desc: "Take the 10-scenario drill to practice identifying Quishing, MITM Wi-Fi, and OTP traps.",
          target: "#cyber-quiz",
          btnText: "Take Quiz"
        });
      }

      if (!State.checklist.completedIds.includes("chk-mfa-authenticator")) {
        suggestions.push({
          title: "Migrate from SMS OTPs to Authenticator Apps",
          desc: "Protect your accounts against SIM-swapping by setting up cryptographic TOTP apps.",
          target: "#privacy-checklist",
          btnText: "View Checklist"
        });
      }

      if (suggestions.length === 0) {
        suggestions.push({
          title: "Review Incident Response Protocols",
          desc: "Keep the 4 emergency triage workflows fresh in memory in case an account is breached.",
          target: "#incident-response",
          btnText: "Review Guide"
        });
      }

      suggestionsListEl.innerHTML = suggestions.slice(0, 3).map(s => `
        <div class="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant hover:border-primary-container/40 transition-colors flex flex-col justify-between">
          <div>
            <h5 class="font-display-xl text-sm font-bold text-primary mb-1">${s.title}</h5>
            <p class="font-body-md text-xs text-on-surface-variant mb-3">${s.desc}</p>
          </div>
          <a href="${s.target}" class="font-mono text-xs font-bold text-primary-container flex items-center gap-1 hover:underline">
            <span>${s.btnText}</span>
            <span class="material-symbols-outlined text-sm">arrow_forward</span>
          </a>
        </div>
      `).join("");
    }

    if (btnResetAll) {
      btnResetAll.onclick = () => {
        if (confirm("Reset ALL saved cyber progress, quiz scores, and checklist items?")) {
          localStorage.clear();
          State.checklist.completedIds = [];
          State.metrics = {
            quizAttempts: 0,
            quizBestScore: 0,
            quizLastScore: 0,
            phishingScansCount: 0,
            urlInspectionsCount: 0,
            passwordChecksCount: 0
          };
          updateDashboard();
          showToast("All local security metrics have been reset", "success");
          location.reload();
        }
      };
    }
  }

  function escapeHtml(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Initialize All Systems
  initNavigation();
  initUserAuth();
  initPhishingAnalyzer();
  initUrlInspector();
  initThreatIntel();
  initEventConsole();
  initCyberQuiz();
  initPasswordLab();
  initPrivacyChecklist();
  initScamRadar();
  initIncidentGuide();
  updateDashboard();
});
