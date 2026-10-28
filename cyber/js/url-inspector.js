/**
 * Suspicious URL Inspector Engine
 * Performs 100% client-side structural, syntactic, and heuristic security evaluation.
 * Never executes, fetches, or visits submitted URLs.
 * Automatically defangs links for safe educational review.
 */

const URL_INSPECTOR_SAMPLES = [
  {
    id: "sample-lookalike",
    name: "Lookalike Brand Subdomain (High Risk)",
    tag: "Credential Harvester",
    url: "http://paypal.com.account-verification-portal.xyz/secure/login.php?user=verify"
  },
  {
    id: "sample-ip-port",
    name: "Bare IP with Custom Port (Critical Risk)",
    tag: "Malware Drop / APK",
    url: "http://194.26.29.11:8080/campus-exam-admit-card.pdf.exe"
  },
  {
    id: "sample-shortener",
    name: "Obfuscated URL Shortener (Suspicious)",
    tag: "Hidden Destination",
    url: "https://bit.ly/student-cashback-voucher-2026"
  },
  {
    id: "sample-homograph",
    name: "Punycode Homograph Domain (High Risk)",
    tag: "IDN Spoofing",
    url: "https://xn--gogle-qta.com/account/security-update"
  },
  {
    id: "sample-embedded-creds",
    name: "Embedded Auth in URL (High Risk)",
    tag: "Credential Leak",
    url: "https://admin:pass1234@secure-student-portal.site/dashboard"
  },
  {
    id: "sample-legit",
    name: "Official University HTTPS Portal (Low Risk)",
    tag: "Legitimate Campus",
    url: "https://cs.university.edu/admissions/fall2026?program=cybersecurity"
  }
];

class UrlInspector {
  constructor() {
    this.knownShorteners = [
      "bit.ly", "tinyurl.com", "is.gd", "t.co", "cutt.ly", "ow.ly",
      "rb.gy", "rebrand.ly", "bl.ink", "shorturl.at", "soo.gd", "tny.im"
    ];

    this.highRiskTlds = [
      ".xyz", ".top", ".tk", ".ml", ".ga", ".cf", ".gq", ".buzz",
      ".cfd", ".fit", ".icu", ".pw", ".rest", ".fun", ".live", ".cc",
      ".work", ".monster", ".bar", ".sbs", ".cam", ".click", ".link"
    ];

    this.brandKeywords = [
      "paypal", "google", "microsoft", "apple", "netflix", "amazon",
      "sbi", "hdfc", "icici", "chase", "wellsfargo", "bank", "paytm",
      "phonepe", "telegram", "whatsapp", "instagram", "facebook"
    ];

    this.dangerousExtensions = [
      ".exe", ".apk", ".bat", ".cmd", ".scr", ".vbs", ".msi",
      ".iso", ".dmg", ".ps1", ".jar", ".pdf.exe", ".doc.exe"
    ];
  }

  /**
   * Defang URL to prevent accidental browser navigation
   */
  defangUrl(url) {
    if (!url) return "";
    return url
      .replace(/^https:\/\//i, "hxxps://")
      .replace(/^http:\/\//i, "hxxp://")
      .replace(/\./g, "[.]")
      .replace(/@/g, "[@]")
      .replace(/:(\d+)/g, "[:$1]");
  }

  /**
   * Main inspection routine
   */
  inspect(rawUrl) {
    if (!rawUrl || rawUrl.trim().length === 0) {
      return { error: "Please enter a URL to inspect." };
    }

    let input = rawUrl.trim();

    // Auto-prefix http if user omitted protocol for parsing
    let hasExplicitProtocol = /^https?:\/\//i.test(input);
    let parseCandidate = hasExplicitProtocol ? input : "http://" + input;

    let parsed = null;
    try {
      parsed = new URL(parseCandidate);
    } catch (e) {
      return {
        error: "Malformed URL syntax. Could not parse domain or hostname.",
        rawInput: input
      };
    }

    const checks = [];
    let riskScore = 0;

    const protocol = parsed.protocol.toLowerCase();
    const hostname = parsed.hostname.toLowerCase();
    const pathname = parsed.pathname.toLowerCase();
    const search = parsed.search.toLowerCase();
    const port = parsed.port;
    const username = parsed.username;
    const password = parsed.password;

    // 1. Protocol & HTTPS Encryption
    if (protocol === "https:") {
      checks.push({
        id: "protocol_https",
        title: "Transport Encryption (HTTPS)",
        status: "PASS",
        severity: "INFO",
        detail: "URL utilizes TLS/SSL encrypted communication (HTTPS)."
      });
    } else if (protocol === "http:") {
      riskScore += 20;
      checks.push({
        id: "protocol_http",
        title: "Unencrypted Plaintext HTTP",
        status: "WARNING",
        severity: "MEDIUM",
        detail: "Standard HTTP transmits data in cleartext, vulnerable to network interception (MITM)."
      });
    } else {
      riskScore += 35;
      checks.push({
        id: "protocol_suspicious",
        title: "Non-standard Protocol Scheme",
        status: "FAIL",
        severity: "HIGH",
        detail: `Unusual protocol scheme detected (${protocol}). Legitimate websites use https://.`
      });
    }

    // 2. IP Address as Hostname Check
    const isIpv4 = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname);
    const isIpv6 = hostname.startsWith("[") || /^[0-9a-f:]+$/i.test(hostname);
    if (isIpv4 || isIpv6) {
      riskScore += 35;
      checks.push({
        id: "bare_ip_host",
        title: "Direct IP Address Hostname",
        status: "FAIL",
        severity: "CRITICAL",
        detail: "Domain name is bypassed using a direct numeric IP address. Common in phishing and malware command nodes."
      });
    } else {
      checks.push({
        id: "domain_name_present",
        title: "Domain Name Structure",
        status: "PASS",
        severity: "INFO",
        detail: `Host uses a registered domain name (${hostname}).`
      });
    }

    // 3. URL Shortener Detection
    const isShortener = this.knownShorteners.some(s => hostname === s || hostname.endsWith("." + s));
    if (isShortener) {
      riskScore += 22;
      checks.push({
        id: "url_shortener",
        title: "URL Shortening Service",
        status: "WARNING",
        severity: "HIGH",
        detail: `The URL is masked through a redirect service (${hostname}). The true destination is concealed.`
      });
    }

    // 4. High-Risk / Abused TLDs
    const matchedTld = this.highRiskTlds.find(tld => hostname.endsWith(tld));
    if (matchedTld) {
      riskScore += 25;
      checks.push({
        id: "risky_tld",
        title: "High-Risk Top-Level Domain",
        status: "WARNING",
        severity: "HIGH",
        detail: `Uses top-level domain ${matchedTld}, frequently favored by threat actors due to low-cost or anonymous registration.`
      });
    }

    // 5. Lookalike / Brand Subdomain Masquerading
    const domainParts = hostname.split(".");
    let hasBrandInSubdomain = false;
    let matchedBrand = null;

    if (domainParts.length >= 3 && !isIpv4) {
      // Look at subdomains (all parts before root domain and tld)
      const subdomains = domainParts.slice(0, -2).join(".");
      for (const brand of this.brandKeywords) {
        if (subdomains.includes(brand)) {
          hasBrandInSubdomain = true;
          matchedBrand = brand;
          break;
        }
      }
    }

    if (hasBrandInSubdomain) {
      riskScore += 35;
      checks.push({
        id: "subdomain_spoofing",
        title: "Brand Name in Subdomain",
        status: "FAIL",
        severity: "CRITICAL",
        detail: `Contains brand keyword '${matchedBrand}' inside a subdomain, but the actual root domain is '${domainParts.slice(-2).join(".')}'. Classic phishing deception.`
      });
    }

    // 6. Excessive Subdomain Depth
    if (domainParts.length > 4 && !isIpv4) {
      riskScore += 15;
      checks.push({
        id: "excessive_subdomains",
        title: "Excessive Subdomain Nesting",
        status: "WARNING",
        severity: "MEDIUM",
        detail: `Hostname contains ${domainParts.length} subdomains. Multi-nested hierarchies are used to push real root domains off mobile address bars.`
      });
    }

    // 7. Punycode / Homograph Attacks
    if (hostname.includes("xn--")) {
      riskScore += 30;
      checks.push({
        id: "punycode_homograph",
        title: "Punycode (IDN) Internationalized Domain",
        status: "WARNING",
        severity: "HIGH",
        detail: "Contains Punycode (xn--). Often used in homograph attacks to substitute visually indistinguishable Cyrillic/Greek characters for Latin letters."
      });
    }

    // 8. Embedded Credentials in URL
    if (username || password) {
      riskScore += 30;
      checks.push({
        id: "embedded_auth",
        title: "Embedded Authentication Credentials",
        status: "FAIL",
        severity: "CRITICAL",
        detail: `URL contains embedded user credentials (${username ? username + '@' : ''}). This syntax can confuse browser parsing and harvest credentials.`
      });
    }

    // 9. Non-Standard Ports
    if (port && port !== "80" && port !== "443") {
      riskScore += 20;
      checks.push({
        id: "custom_port",
        title: "Non-Standard Port Number",
        status: "WARNING",
        severity: "MEDIUM",
        detail: `URL routes to port :${port} instead of standard web ports 80/443. Often associated with illicit servers or unmanaged testing hosts.`
      });
    }

    // 10. Dangerous Executable Extensions in Path
    const matchedExt = this.dangerousExtensions.find(ext => pathname.endsWith(ext));
    if (matchedExt) {
      riskScore += 35;
      checks.push({
        id: "executable_extension",
        title: "Executable / Dangerous Payload Extension",
        status: "FAIL",
        severity: "CRITICAL",
        detail: `URL ends in an executable file extension (${matchedExt}). Downloading or executing this file could deploy malware or trojans.`
      });
    }

    // 11. Encoding Anomalies
    if (input.includes("%00") || (input.match(/%/g) || []).length > 6) {
      riskScore += 18;
      checks.push({
        id: "encoding_anomalies",
        title: "Excessive URL Hex Encoding",
        status: "WARNING",
        severity: "MEDIUM",
        detail: "Unusual density of percent-encoded characters detected. Often utilized to evade gateway keyword filters."
      });
    }

    // Clamp score between 0 and 100
    riskScore = Math.min(100, Math.max(0, riskScore));

    // Determine category
    let severity = "LOW";
    let severityColor = "emerald";
    let verdictTitle = "Clean Heuristic Indicators";
    let verdictSummary = "The URL syntax and hostname adhere to standard web structures with no overt deception markers detected.";

    if (riskScore >= 75) {
      severity = "CRITICAL";
      severityColor = "red";
      verdictTitle = "Dangerous / High-Risk Phishing Markers Identified";
      verdictSummary = "Multiple critical red flags identified (e.g. bare IP, brand spoofing, or executable extension). Do NOT visit this link.";
    } else if (riskScore >= 50) {
      severity = "HIGH";
      severityColor = "red";
      verdictTitle = "High Suspicion Level";
      verdictSummary = "Elevated risk characteristics detected. Unsafe to visit without sandboxed network isolation.";
    } else if (riskScore >= 25) {
      severity = "SUSPICIOUS";
      severityColor = "amber";
      verdictTitle = "Caution Recommended";
      verdictSummary = "URL contains potential risk factors (e.g. unencrypted HTTP, shortened link, or generic TLD). Exercise caution.";
    }

    // Practical Safety Recommendations
    const recommendations = [];
    if (isShortener) {
      recommendations.push("Expand the shortened URL with an offline unshortener before clicking to inspect the final destination.");
    }
    if (protocol === "http:") {
      recommendations.push("Never enter passwords, OTPs, or payment details on unencrypted HTTP pages.");
    }
    if (hasBrandInSubdomain) {
      recommendations.push(`Navigate directly to the official portal (${matchedBrand}.com) rather than trusting subdomains.`);
    }
    if (isIpv4 || isIpv6) {
      recommendations.push("Avoid visiting websites hosted on raw IP addresses. Reputable enterprises always use verified domain names.");
    }
    if (matchedExt) {
      recommendations.push("Do not allow your browser to save or run any executable downloads from this URL.");
    }
    if (recommendations.length === 0) {
      recommendations.push("Always verify that the SSL certificate lock matches the organization you expect.");
      recommendations.push("Bookmark frequently visited banking and university portals to avoid mistyping URLs.");
    }

    return {
      rawInput: input,
      defangedUrl: this.defangUrl(input),
      parsed: {
        protocol: parsed.protocol,
        hostname: parsed.hostname,
        pathname: parsed.pathname,
        port: parsed.port || (protocol === "https:" ? "443" : "80")
      },
      riskScore,
      severity,
      severityColor,
      verdictTitle,
      verdictSummary,
      checks,
      recommendations,
      timestamp: new Date().toISOString()
    };
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { UrlInspector, URL_INSPECTOR_SAMPLES };
}
