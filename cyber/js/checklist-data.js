/**
 * Privacy & Account Hardening Checklist Data
 * 12 practical, high-impact security and privacy hygiene tasks.
 */
const PRIVACY_CHECKLIST_DATA = [
  {
    id: "chk-mfa-authenticator",
    category: "Authentication",
    title: "Switch to Authenticator Apps (TOTP) for 2FA",
    desc: "Migrate 2-Factor Authentication from SMS text messages to Google Authenticator, Microsoft Authenticator, or Bitwarden on primary email and banking.",
    why: "SMS messages are vulnerable to SIM-swapping and cellular interception. Authenticator apps generate local cryptographic tokens that cannot be intercepted via telecommunications.",
    difficulty: "Easy • 5 mins"
  },
  {
    id: "chk-pwd-manager",
    category: "Authentication",
    title: "Adopt a Dedicated Password Manager & Unique Passwords",
    desc: "Stop reusing passwords. Store strong, unique 16+ character passwords or passphrases in a reputable password manager (Bitwarden, 1Password, or Proton Pass).",
    why: "Credential stuffing bots exploit reused passwords across thousands of services when any single website leaks a database.",
    difficulty: "Medium • 15 mins"
  },
  {
    id: "chk-oauth-audit",
    category: "Identity & Accounts",
    title: "Audit & Revoke Third-Party OAuth App Permissions",
    desc: "Inspect 'Sign in with Google' and 'Connected Apps' under your Google, Apple, and Microsoft accounts, revoking old games, quizzes, and unused websites.",
    why: "Third-party apps often retain perpetual token access to your email, drive files, or contacts even years after you stopped using them.",
    difficulty: "Easy • 5 mins"
  },
  {
    id: "chk-pwned-check",
    category: "Identity & Accounts",
    title: "Check Breach Exposure on HaveIBeenPwned",
    desc: "Search your student and personal email addresses on haveibeenpwned.com to discover which corporate breaches leaked your credentials.",
    why: "Knowing exactly which past platforms leaked your email allows you to proactively rotate passwords before attackers weaponize the data.",
    difficulty: "Easy • 2 mins"
  },
  {
    id: "chk-social-privacy",
    category: "Privacy & Social",
    title: "Lock Down Social Media Visibility & Tagging",
    desc: "Set personal Instagram, LinkedIn, and Facebook profiles to private or restrict follower visibility, hide phone numbers from public searches, and disable automated photo tagging.",
    why: "Scammers scrape public follower lists, hometowns, and family connections to orchestrate targeted sextortion, blackmail, and impersonation scams.",
    difficulty: "Medium • 10 mins"
  },
  {
    id: "chk-lockscreen-previews",
    category: "Device Hardening",
    title: "Hide Sensitive Notification Previews on Lock Screen",
    desc: "Configure Android/iOS settings to 'Hide Sensitive Notification Content' or 'Don't show notification content' when device is locked.",
    why: "If someone catches sight of your locked phone, exposed notification previews can display confidential 6-digit OTPs and bank transaction alerts.",
    difficulty: "Easy • 2 mins"
  },
  {
    id: "chk-app-permissions",
    category: "Device Hardening",
    title: "Audit Mobile App Permissions (Microphone / Location / Contacts)",
    desc: "Open your smartphone's Permission Manager. Revoke background location, microphone, and full contacts access from utilities, calculators, and casual games.",
    why: "Unused utility apps frequently monetize by silently collecting background telemetry and transmitting tracking data to advertising brokers.",
    difficulty: "Medium • 8 mins"
  },
  {
    id: "chk-public-wifi-disable",
    category: "Network & Browsing",
    title: "Disable Wi-Fi & Bluetooth Auto-Connect",
    desc: "Turn off 'Connect to open networks automatically' in Wi-Fi settings, and toggle off Bluetooth when in transit through public transit hubs and airports.",
    why: "Phones broadcast probe requests seeking familiar networks. Malicious 'Pineapple' routers exploit auto-connect to silently intercept your traffic.",
    difficulty: "Easy • 3 mins"
  },
  {
    id: "chk-encrypted-dns",
    category: "Network & Browsing",
    title: "Enable Secure DNS-over-HTTPS (DoH) / Private DNS",
    desc: "Turn on Encrypted DNS in your browser or phone using Cloudflare (1.1.1.1), Quad9 (9.9.9.9), or NextDNS.",
    why: "Standard DNS requests are sent in plain text, allowing local Wi-Fi providers and ISPs to monitor every domain you visit.",
    difficulty: "Medium • 4 mins"
  },
  {
    id: "chk-disk-encryption",
    category: "Device Hardening",
    title: "Verify Full-Disk Encryption & Biometric Screen Lock",
    desc: "Ensure BitLocker (Windows), FileVault (macOS), or device encryption is turned on, paired with a 6+ digit PIN or fingerprint/biometrics.",
    why: "If your laptop or phone is physically lost or stolen in a library or train, unencrypted disks allow anyone to extract your files with a bootable USB drive.",
    difficulty: "Medium • 5 mins"
  },
  {
    id: "chk-sim-pin",
    category: "Authentication",
    title: "Enable SIM Card PIN Lock",
    desc: "Set a 4-to-6 digit SIM PIN via your phone's cellular settings to prevent your physical SIM card from working if inserted into another device.",
    why: "In phone theft, thieves eject the physical SIM and put it into a burner phone to receive banking OTPs. A SIM PIN stops the card from registering on networks without the PIN.",
    difficulty: "Easy • 3 mins"
  },
  {
    id: "chk-bank-limits",
    category: "Financial & Payments",
    title: "Configure Daily Transaction Limits & Instant Alerts on Banking & UPI",
    desc: "Log into your banking app and set strict daily online transaction limits, disable international card transactions if not traveling, and enable instant SMS/email alerts.",
    why: "Limits enforce circuit-breakers that contain damage in case of unauthorized card compromise or account takeover.",
    difficulty: "Medium • 7 mins"
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PRIVACY_CHECKLIST_DATA };
}
