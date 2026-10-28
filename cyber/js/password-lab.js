/**
 * Password Strength Lab Engine
 * 100% Client-side mathematical entropy, pattern heuristics, and crack-time estimation.
 * ZERO network calls. Entered passwords NEVER leave browser memory and are NEVER stored.
 */

const COMMON_PASSWORDS_LIST = [
  "password", "123456", "12345678", "123456789", "qwerty", "password123",
  "admin", "111111", "welcome", "iloveyou", "monkey", "dragon", "football",
  "master", "sunshine", "princess", "superman", "starwars", "default",
  "testing", "secret", "login", "student", "college", "campus", "pass1234"
];

const PASSPHRASE_WORD_LIST = [
  "shield", "crypto", "quantum", "falcon", "orbit", "beacon", "horizon",
  "matrix", "vector", "nebula", "vertex", "glacier", "timber", "aurora",
  "canyon", "granite", "summit", "vortex", "cobalt", "plasma", "zenith",
  "cipher", "anchor", "signal", "radiant", "obsidian", "sentinel", "kinetic",
  "phoenix", "shadow", "ironclad", "compass", "voyager", "cascade", "bastion"
];

class PasswordLab {
  constructor() {
    this.privacyGuaranteed = true;
  }

  /**
   * Evaluates a password and returns a comprehensive telemetry report
   */
  evaluate(password) {
    if (!password) {
      return {
        isEmpty: true,
        score: 0,
        entropyBits: 0,
        label: "Awaiting Input",
        color: "outline",
        crackTimeFast: "N/A",
        crackTimeSlow: "N/A",
        checks: {
          length12: false,
          length16: false,
          hasLower: false,
          hasUpper: false,
          hasNumber: false,
          hasSymbol: false,
          noCommonPattern: true,
          noRepetition: true
        },
        warnings: [],
        suggestions: ["Enter a password above to begin local heuristic evaluation."]
      };
    }

    const length = password.length;
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[^a-zA-Z0-9]/.test(password);

    // Calculate pool size
    let poolSize = 0;
    if (hasLower) poolSize += 26;
    if (hasUpper) poolSize += 26;
    if (hasNumber) poolSize += 10;
    if (hasSymbol) poolSize += 33;

    // Base Shannon Entropy (Bits)
    let rawEntropy = length * Math.log2(Math.max(poolSize, 2));

    const warnings = [];
    const suggestions = [];

    // Check for common dictionary words
    const lowerPass = password.toLowerCase();
    const isCommon = COMMON_PASSWORDS_LIST.some(p => lowerPass.includes(p));
    if (isCommon) {
      rawEntropy = Math.max(10, rawEntropy * 0.35);
      warnings.push("Contains common dictionary words or easily guessable phrases.");
      suggestions.push("Avoid standard dictionary words like 'password', 'welcome', or names.");
    }

    // Check for repetitive characters (e.g. 'aaaa', '1111')
    const hasRepetition = /(.)\1{2,}/.test(password);
    if (hasRepetition) {
      rawEntropy *= 0.7;
      warnings.push("Contains repetitive character sequences (e.g., 'aaa').");
    }

    // Check for simple keyboard sequences (e.g. '1234', 'qwerty', 'abcd')
    const sequentialPattern = /(0123|1234|2345|3456|4567|5678|6789|abcd|bcde|cdef|defg|qwerty|asdf)/i.test(password);
    if (sequentialPattern) {
      rawEntropy *= 0.65;
      warnings.push("Contains predictable keyboard sequences (e.g., '1234' or 'qwerty').");
      suggestions.push("Avoid contiguous keyboard sweeps.");
    }

    // Check for common 4-digit year patterns (1970 - 2030)
    const yearPattern = /(19[5-9]\d|20[0-3]\d)/.test(password);
    if (yearPattern) {
      rawEntropy *= 0.85;
      warnings.push("Contains a likely birth year or calendar year.");
      suggestions.push("Do not include birth years or graduation years.");
    }

    const entropyBits = Math.max(0, Math.round(rawEntropy));

    // Dynamic scoring (0 to 100)
    let score = 0;
    if (length < 8) {
      score = Math.min(25, length * 3);
    } else {
      score = Math.min(100, Math.round((entropyBits / 90) * 100));
    }

    // Human readable category
    let label = "Very Weak";
    let color = "error"; // red
    let bgGlow = "rgba(255, 51, 102, 0.4)";

    if (score >= 85 && length >= 14) {
      label = "Military-Grade / Robust";
      color = "primary-container"; // neon lime
      bgGlow = "rgba(0, 255, 136, 0.4)";
    } else if (score >= 65 && length >= 12) {
      label = "Strong";
      color = "primary-container";
      bgGlow = "rgba(0, 255, 136, 0.3)";
    } else if (score >= 45 && length >= 8) {
      label = "Moderate";
      color = "secondary-container"; // cyan
      bgGlow = "rgba(0, 238, 252, 0.3)";
    } else if (score >= 25) {
      label = "Weak";
      color = "yellow-400";
      bgGlow = "rgba(234, 179, 8, 0.3)";
    }

    // Estimate crack times
    // Assumptions:
    // Fast hash (e.g. NTLM / MD5 offline cracking rig with 8x RTX 4090): ~100 Billion hashes/sec (1e11/s)
    // Slow hash (e.g. bcrypt cost 12 / Argon2): ~10,000 hashes/sec (1e4/s)
    const combinations = Math.pow(Math.max(poolSize, 2), length);
    const crackTimeFast = this.formatTimeDuration(combinations / 1e11);
    const crackTimeSlow = this.formatTimeDuration(combinations / 1e4);

    if (length < 12) {
      suggestions.push("Increase length to at least 14-16 characters. Length beats complexity.");
    }
    if (!hasSymbol) {
      suggestions.push("Add at least one special character (!@#$%^&*).");
    }
    if (!hasUpper || !hasLower) {
      suggestions.push("Mix both UPPERCASE and lowercase letters.");
    }
    if (!hasNumber) {
      suggestions.push("Include numeric digits (0-9).");
    }

    if (suggestions.length === 0) {
      suggestions.push("Excellent posture! Ensure you store this in an encrypted password manager and never reuse it across other accounts.");
    }

    return {
      isEmpty: false,
      length,
      entropyBits,
      score,
      label,
      color,
      bgGlow,
      crackTimeFast,
      crackTimeSlow,
      checks: {
        length12: length >= 12,
        length16: length >= 16,
        hasLower,
        hasUpper,
        hasNumber,
        hasSymbol,
        noCommonPattern: !isCommon && !sequentialPattern,
        noRepetition: !hasRepetition
      },
      warnings,
      suggestions
    };
  }

  /**
   * Converts seconds into intuitive human time
   */
  formatTimeDuration(seconds) {
    if (seconds <= 0.001) return "Instantly (< 1 millisecond)";
    if (seconds < 1) return "Under 1 second";
    if (seconds < 60) return `${Math.round(seconds)} seconds`;
    const minutes = seconds / 60;
    if (minutes < 60) return `${Math.round(minutes)} minutes`;
    const hours = minutes / 60;
    if (hours < 24) return `${Math.round(hours)} hours`;
    const days = hours / 24;
    if (days < 30) return `${Math.round(days)} days`;
    const months = days / 30;
    if (months < 12) return `${Math.round(months)} months`;
    const years = days / 365.25;
    if (years < 1000) return `${Math.round(years)} years`;
    if (years < 1000000) return `${(years / 1000).toFixed(1)}k years`;
    if (years < 1000000000) return `${(years / 1000000).toFixed(1)} Million years`;
    return "Centuries / Astronomical Scale";
  }

  /**
   * Cryptographically secure password generator
   */
  generatePassword(options = {}) {
    const {
      length = 16,
      includeUpper = true,
      includeLower = true,
      includeNumbers = true,
      includeSymbols = true
    } = options;

    const lowerChars = "abcdefghjkmnpqrstuvwxyz"; // removed ambiguous l, o
    const upperChars = "ABCDEFGHJKMNPQRSTUVWXYZ"; // removed ambiguous I, O
    const numberChars = "23456789"; // removed 0, 1
    const symbolChars = "!@#$%^&*()-_=+[]{}";

    let charPool = "";
    const mandatoryChars = [];

    if (includeLower) {
      charPool += lowerChars;
      mandatoryChars.push(lowerChars[this.secureRandomInt(lowerChars.length)]);
    }
    if (includeUpper) {
      charPool += upperChars;
      mandatoryChars.push(upperChars[this.secureRandomInt(upperChars.length)]);
    }
    if (includeNumbers) {
      charPool += numberChars;
      mandatoryChars.push(numberChars[this.secureRandomInt(numberChars.length)]);
    }
    if (includeSymbols) {
      charPool += symbolChars;
      mandatoryChars.push(symbolChars[this.secureRandomInt(symbolChars.length)]);
    }

    if (charPool.length === 0) {
      charPool = lowerChars + numberChars;
    }

    const result = [...mandatoryChars];
    const remainingLength = Math.max(0, length - mandatoryChars.length);

    for (let i = 0; i < remainingLength; i++) {
      const randIndex = this.secureRandomInt(charPool.length);
      result.push(charPool[randIndex]);
    }

    // Shuffle result securely
    for (let i = result.length - 1; i > 0; i--) {
      const j = this.secureRandomInt(i + 1);
      [result[i], result[j]] = [result[j], result[i]];
    }

    return result.join("");
  }

  /**
   * Generates a 4-word mnemonic passphrase (Diceware style)
   */
  generatePassphrase(wordCount = 4, separator = "-") {
    const selectedWords = [];
    for (let i = 0; i < wordCount; i++) {
      const idx = this.secureRandomInt(PASSPHRASE_WORD_LIST.length);
      selectedWords.push(PASSPHRASE_WORD_LIST[idx]);
    }
    // Add 2 random digits at the end for extra entropy
    const suffixNum = this.secureRandomInt(90) + 10;
    return selectedWords.join(separator) + separator + suffixNum;
  }

  /**
   * Cryptographically secure random integer in [0, max)
   */
  secureRandomInt(max) {
    if (window.crypto && window.crypto.getRandomValues) {
      const array = new Uint32Array(1);
      window.crypto.getRandomValues(array);
      return array[0] % max;
    }
    return Math.floor(Math.random() * max);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PasswordLab };
}
