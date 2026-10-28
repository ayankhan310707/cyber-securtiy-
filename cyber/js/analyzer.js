/**
 * Phishing Message Analyzer Engine
 * Performs 100% client-side transparent heuristic inspection of text messages, emails, and alerts.
 * Identifies urgency triggers, credential/OTP requests, deceptive links, and fraudulent reward lures.
 * Defangs all links for safe review and never connects to external servers.
 */

const PHISHING_ANALYZER_SAMPLES = [
  {
    id: "bank-kyc",
    name: "Urgent Bank KYC Suspension (High Risk)",
    tag: "Banking Phishing",
    text: "URGENT ALERT: Dear Customer, Your SBI Bank NetBanking account will be PERMANENTLY BLOCKED within 24 hours due to pending KYC verification. Please click here immediately to update your Aadhaar and enter your 6-digit OTP to avoid account suspension: http://sbi-kyc-portal-update.xyz/login. Do not ignore!"
  },
  {
    id: "telegram-job",
    name: "Telegram Part-Time Job Scam (High Risk)",
    tag: "Internship Scam",
    text: "Hello dear! We reviewed your profile and you are selected for our part-time remote YouTube Reviewer internship! Earn ₹3,000 to ₹8,000 daily working 1 hour on your phone. To activate your employee portal, please pay a 100% refundable registration fee of ₹1,200 via UPI. Hurry, only 3 slots remaining today! Contact HR on Telegram: https://t.me/quick_cash_hr_bot"
  },
  {
    id: "exam-admit",
    name: "College Hall Ticket Phishing (High Risk)",
    tag: "Campus Phishing",
    text: "CAMPUS NOTIFICATION: Your Semester End Exam Admit Card has been temporarily withheld due to administrative fee discrepancy. Re-verify your master student portal login and password before 5:00 PM today to prevent examination disqualification: http://194.26.29.11/univ-portal-login.php"
  },
  {
    id: "lottery-prize",
    name: "Unsolicited Prize / iPhone Lure (High Risk)",
    tag: "Reward Scam",
    text: "CONGRATULATIONS! Your mobile number was selected as the 1st prize winner of an Apple iPhone 15 Pro Max and ₹50,000 cash in the annual Mega Diwali Lucky Draw! Claim your gift within 12 hours before it expires: http://bit.ly/claim-free-iphone-2026. Nominal courier insurance charges of ₹499 apply."
  },
  {
    id: "safe-seminar",
    name: "University Guest Lecture Invitation (Low Risk)",
    tag: "Legitimate Campus Event",
    text: "Dear Students, The Department of Computer Science cordially invites you to a guest lecture on 'Modern Cryptography and Cyber Defense' by Dr. Aditi Sharma on Friday, November 14th at 2:00 PM in the Main Auditorium. Registration is free. For the schedule and reading material, visit our official department portal at https://cs.university.edu/events/fall2026. Best regards, Academic Events Committee."
  }
];

class PhishingAnalyzer {
  constructor() {
    // Heuristic signature dictionaries with assigned threat weights
    this.rules = [
      {
        id: "urgency",
        category: "Urgency & Coercion",
        severity: "HIGH",
        weight: 22,
        patterns: [
          /\b(urgent|immediately|immediate action|within \d+\s*(hours|hrs|minutes|mins)|last chance|deadline|final notice|permanently (blocked|suspended|closed|terminated)|act now|hurry|expir(es|ed|ing) today|threat of|arrest|legal notice|police warrant|court summons|without delay)\b/i
        ],
        explanation: "Uses synthetic urgency and coercive deadlines to induce panic and force decisions before you can verify facts."
      },
      {
        id: "credentials_otp",
        category: "Credentials & OTP Solicitation",
        severity: "CRITICAL",
        weight: 30,
        patterns: [
          /\b(otp|one-time password|pin|upi pin|cvv|password|passcode|enter your credentials|netbanking password|atm pin|secret code|security code|verify your password|aadhaar number|pan card details|card number|social security|bank credentials)\b/i
        ],
        explanation: "Asks for sensitive authentication keys, PINs, or credentials. Legitimate institutions and banks NEVER solicit OTPs or passwords via messages."
      },
      {
        id: "fake_rewards",
        category: "Unrealistic Gains & Prize Lures",
        severity: "HIGH",
        weight: 20,
        patterns: [
          /\b(congratulations|you won|lottery|lucky draw|winner|cashback of|free iphone|guaranteed return|100% bonus|earn \d+ daily|work from home earn|unclaimed inheritance|exclusive prize|free gift|millionaire|jackpot)\b/i
        ],
        explanation: "Promises extravagant rewards or guaranteed effortless earnings to trigger emotional excitement and greed."
      },
      {
        id: "upfront_fee",
        category: "Advance Fee & Deposit Demands",
        severity: "CRITICAL",
        weight: 25,
        patterns: [
          /\b(registration fee|refundable (deposit|fee)|processing (charge|fee)|stamp duty|verification (fee|deposit)|clearance charge|security deposit|nominal courier|pay upfront|courier insurance)\b/i
        ],
        explanation: "Demands upfront payment or 'refundable fees' before receiving a job, prize, or loan. Genuine organizations never charge candidates to work."
      },
      {
        id: "impersonal_greeting",
        category: "Generic Greeting & Impersonation",
        severity: "MEDIUM",
        weight: 10,
        patterns: [
          /\b(dear customer|dear user|valuable customer|attention user|dear beneficiary|dear sir\/madam|hello dear)\b/i
        ],
        explanation: "Employs impersonal, mass-blasted greetings because the sender does not actually possess your account relationship details."
      },
      {
        id: "suspicious_links",
        category: "Deceptive or Obfuscated Links",
        severity: "CRITICAL",
        weight: 25,
        patterns: [
          /https?:\/\/[^\s]+/i,
          /www\.[^\s]+/i,
          /[a-zA-Z0-9-]+\.(xyz|top|tk|ml|ga|cf|gq|buzz|cfd|fit|online|site|fun|live|icu|pw|rest)\b/i,
          /\b(bit\.ly|tinyurl\.com|is\.gd|t\.co|cutt\.ly|ow\.ly|rb\.gy)\b/i,
          /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/
        ],
        explanation: "Contains shortened URLs, suspicious non-standard top-level domains (.xyz, .top), bare IP addresses, or deceptive hyperlinks."
      },
      {
        id: "emotional_formatting",
        category: "Aggressive Formatting Anomalies",
        severity: "LOW",
        weight: 8,
        patterns: [
          /!{2,}/,
          /\b[A-Z]{4,}\s+[A-Z]{4,}\b/,
          /(🚨|⚠️|❗|‼️|🎉|🎁|💰|💵)/
        ],
        explanation: "Contains alarmist typography (excessive exclamation marks, erratic ALL-CAPS words, urgency warning emojis) typical of unsolicited social engineering blasts."
      }
    ];
  }

  /**
   * Safely defangs an URL to prevent accidental clicks
   * e.g. http://malicious.com -> hxxp://malicious[.]com
   */
  defangUrl(url) {
    if (!url) return "";
    return url
      .replace(/^https:\/\//i, "hxxps://")
      .replace(/^http:\/\//i, "hxxp://")
      .replace(/\./g, "[.]")
      .replace(/@/g, "[@]");
  }

  /**
   * Extract all URLs found in the text
   */
  extractUrls(text) {
    const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.(xyz|top|tk|ml|ga|cf|gq|buzz|cfd|fit|online|site|fun|live|icu|pw|rest)[^\s]*)/gi;
    const matches = text.match(urlRegex) || [];
    return matches.map(u => ({
      original: u,
      defanged: this.defangUrl(u),
      isIp: /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(u.replace(/^https?:\/\//i, "")),
      isShortener: /(bit\.ly|tinyurl\.com|is\.gd|t\.co|cutt\.ly|ow\.ly|rb\.gy)/i.test(u),
      isSuspiciousTld: /\.(xyz|top|tk|ml|ga|cf|gq|buzz|cfd|fit|online|site|fun|live|icu|pw|rest)\b/i.test(u)
    }));
  }

  /**
   * Analyze input message text and return structured report
   */
  analyze(text) {
    if (!text || text.trim().length === 0) {
      return {
        error: "Empty message text provided. Please paste or type a suspicious message to analyze."
      };
    }

    const trimmed = text.trim();
    const findings = [];
    let rawScore = 0;

    // Check each rule against the text
    for (const rule of this.rules) {
      let matched = false;
      const matchedSnippets = [];

      for (const pattern of rule.patterns) {
        const matches = trimmed.match(pattern);
        if (matches) {
          matched = true;
          // Capture up to 2 unique matched snippets
          matches.forEach(m => {
            if (m && !matchedSnippets.includes(m)) {
              matchedSnippets.push(m);
            }
          });
        }
      }

      if (matched) {
        findings.push({
          id: rule.id,
          category: rule.category,
          severity: rule.severity,
          weight: rule.weight,
          snippets: matchedSnippets.slice(0, 3),
          explanation: rule.explanation
        });
        rawScore += rule.weight;
      }
    }

    // Extract and evaluate URLs
    const detectedUrls = this.extractUrls(trimmed);
    let linkRiskMultiplier = 1;

    detectedUrls.forEach(link => {
      if (link.isIp) rawScore += 15;
      if (link.isSuspiciousTld) rawScore += 12;
      if (link.isShortener) rawScore += 8;
    });

    // Calculate final composite risk score (clamped between 0 and 100)
    let score = Math.min(100, Math.round(rawScore));

    // Determine risk level category
    let riskLevel = "LOW RISK";
    let riskColor = "emerald"; // green
    let verdictTitle = "Low Threat Indicators Detected";
    let verdictSummary = "The submitted text does not contain typical overt phishing coercion, urgent credential requests, or known high-risk TLD patterns.";

    if (score >= 60) {
      riskLevel = "CRITICAL RISK";
      riskColor = "red";
      verdictTitle = "Strong Hallmarks of a Deceptive Phishing Attack";
      verdictSummary = "This message demonstrates aggressive social engineering vectors: high artificial urgency, credential/OTP solicitation, or dubious link structures. Do NOT share OTPs, click links, or send funds.";
    } else if (score >= 28) {
      riskLevel = "SUSPICIOUS";
      riskColor = "amber";
      verdictTitle = "Elevated Caution Recommended";
      verdictSummary = "Several suspicious markers were identified (e.g. unsolicited links, reward incentives, or generic greetings). Verify the sender independently before taking any action.";
    }

    // Actionable defense checklist for this message
    const recommendations = [];
    if (findings.some(f => f.id === "credentials_otp")) {
      recommendations.push("NEVER share 6-digit OTPs or UPI PINs. No legitimate bank or college authority will ever ask for them.");
    }
    if (findings.some(f => f.id === "urgency")) {
      recommendations.push("Step back from the artificial deadline. Scammers manufacture 2-hour or 24-hour limits to prevent verification.");
    }
    if (detectedUrls.length > 0) {
      recommendations.push("Do not click links inside unverified messages. Inspect the defanged URL and manually navigate to official sites via bookmark.");
    }
    if (findings.some(f => f.id === "upfront_fee")) {
      recommendations.push("Refuse any upfront payment or 'refundable deposit' requests. Genuine employers pay you, never the reverse.");
    }
    if (recommendations.length === 0) {
      recommendations.push("Always verify unfamiliar links by checking the root domain and ensuring HTTPS is active.");
      recommendations.push("When in doubt, contact the organization directly through their verified public website.");
    }

    return {
      textLength: trimmed.length,
      wordCount: trimmed.split(/\s+/).length,
      score,
      riskLevel,
      riskColor,
      verdictTitle,
      verdictSummary,
      findings,
      detectedUrls,
      recommendations,
      timestamp: new Date().toISOString()
    };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PhishingAnalyzer, PHISHING_ANALYZER_SAMPLES };
}
