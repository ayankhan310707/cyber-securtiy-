/**
 * Incident Response Guide Data
 * Safe, step-by-step guidance for the 4 most critical student and consumer cyber emergencies.
 */
const INCIDENT_GUIDE_DATA = [
  {
    id: "incident-phishing-link",
    title: "I Clicked a Phishing Link",
    icon: "link_off",
    severity: "HIGH",
    urgencyText: "Act within 5 minutes to prevent credential theft and payload execution",
    phases: [
      {
        phase: "Phase 1: Immediate Triage (0 - 5 Minutes)",
        steps: [
          {
            title: "Immediately Close the Tab and Do NOT Enter Any Credentials",
            desc: "If you just opened the page, close it immediately. If the page prompted for your password, email, or OTP, do not type anything.",
            actionType: "vital"
          },
          {
            title: "Disconnect from the Internet (Wi-Fi & Cellular Data)",
            desc: "Turn on Airplane Mode or disconnect your Wi-Fi immediately. This halts any background payload downloads, session token exfiltration, or active reverse shells.",
            actionType: "vital"
          },
          {
            title: "Check Downloaded Files",
            desc: "Inspect your browser's Downloads folder. If any file (.exe, .dmg, .apk, .zip, .vbs, .iso) downloaded automatically, DO NOT OPEN OR EXTRACT IT. Delete it permanently immediately.",
            actionType: "standard"
          }
        ]
      },
      {
        phase: "Phase 2: Containment & Remediation (5 - 60 Minutes)",
        steps: [
          {
            title: "Change Account Passwords from a SEPARATE Known-Clean Device",
            desc: "If you entered credentials on the fake page, use another clean device (e.g. a family member's phone or secondary laptop) to change the password for that account immediately.",
            actionType: "vital"
          },
          {
            title: "Terminate Active Login Sessions",
            desc: "In account security settings (Google, Microsoft, Instagram, etc.), choose 'Sign out of all other devices' or 'Revoke active sessions' to kick attackers off active tokens.",
            actionType: "standard"
          },
          {
            title: "Run a Full Malware & Antivirus Scan",
            desc: "Reconnect to internet and run an offline/deep scan using Windows Defender (offline scan mode), Malwarebytes, or your device's built-in security utility.",
            actionType: "standard"
          },
          {
            title: "Clear Browser Cache and Cookies",
            desc: "Clear cookies and site data for the last 24 hours to purge any tracking tokens or malicious service workers stored in your browser.",
            actionType: "standard"
          }
        ]
      },
      {
        phase: "Phase 3: Reporting & Monitoring (Day 1 - 7)",
        steps: [
          {
            title: "Report the Phishing URL to Google Safe Browsing and Microsoft SmartScreen",
            desc: "Submit the defanged URL to safebrowsing.google.com/safebrowsing/report_phish/ so browsers worldwide block other victims from accessing it.",
            actionType: "standard"
          },
          {
            title: "Monitor Bank & Account Activity for 7 Days",
            desc: "Check your account login logs and linked payment methods for any unauthorized attempts.",
            actionType: "standard"
          }
        ]
      }
    ]
  },
  {
    id: "incident-shared-otp",
    title: "I Accidentally Shared an OTP / 2FA Code",
    icon: "phonelink_lock",
    severity: "CRITICAL",
    urgencyText: "EMERGENCY: Attackers are likely logging in or executing unauthorized transfers RIGHT NOW",
    phases: [
      {
        phase: "Phase 1: Immediate Triage (0 - 5 Minutes)",
        steps: [
          {
            title: "Identify Which Service Sent the OTP",
            desc: "Look closely at the SMS sender header and text (e.g. Bank NetBanking, UPI App, WhatsApp, Instagram, Telegram, Google, Amazon).",
            actionType: "vital"
          },
          {
            title: "Freeze Bank Account / Block Cards Immediately (If Financial)",
            desc: "If it was a banking or card OTP, open your mobile banking app immediately and tap 'Instant Debit Card Freeze / Lock Account' or call your bank's 24x7 emergency helpline.",
            actionType: "vital"
          },
          {
            title: "Force-Logout the Hijacked Account",
            desc: "If it was for WhatsApp/Telegram/Social, attempt to log in immediately on your own device. Entering your number and requesting a new SMS will kick out external sessions on WhatsApp.",
            actionType: "vital"
          }
        ]
      },
      {
        phase: "Phase 2: Containment & Remediation (5 - 60 Minutes)",
        steps: [
          {
            title: "Change Master Password & Revoke Session Tokens",
            desc: "Change the account password immediately, choose 'Log out of all devices', and activate a secondary 2FA method like an Authenticator App.",
            actionType: "vital"
          },
          {
            title: "Alert Your Personal Contacts & Friends",
            desc: "If your WhatsApp or Instagram was compromised, quickly post or message close contacts via SMS/calls warning them: 'My account was hacked. Do not send money or OTPs if you receive a message from me.'",
            actionType: "standard"
          },
          {
            title: "Verify Recovery Email and Phone Number",
            desc: "Attackers often change recovery details to maintain persistence. Ensure your personal recovery email and phone number are intact.",
            actionType: "vital"
          }
        ]
      },
      {
        phase: "Phase 3: Official Reporting & Recovery",
        steps: [
          {
            title: "Report to National Cyber Crime Helpline (1930 / cybercrime.gov.in)",
            desc: "In India, immediately dial 1930 or file a report at cybercrime.gov.in. In the US, report to ic3.gov / identitytheft.gov.",
            actionType: "vital"
          },
          {
            title: "File an Account Recovery Ticket with Official Support",
            desc: "Submit identity verification documents through the platform's official compromised account restoration channel.",
            actionType: "standard"
          }
        ]
      }
    ]
  },
  {
    id: "incident-account-compromise",
    title: "My Account Is Compromised / Hacked",
    icon: "account_circle_off",
    severity: "CRITICAL",
    urgencyText: "Regain ownership, kick out the intruder, and audit linked services",
    phases: [
      {
        phase: "Phase 1: Immediate Triage (0 - 5 Minutes)",
        steps: [
          {
            title: "Attempt Password Reset Via 'Forgot Password'",
            desc: "If you still have access to the linked recovery email or phone number, trigger a password reset immediately before the attacker changes recovery settings.",
            actionType: "vital"
          },
          {
            title: "Check Email Forwarding & Filter Rules",
            desc: "Intruders who access your email often create hidden forwarding rules (e.g. forward all emails with 'security', 'bank', 'code' to their inbox and delete original). Check 'Settings > Filters and Blocked Addresses'.",
            actionType: "vital"
          },
          {
            title: "Terminate All Other Active Sessions",
            desc: "Navigate to Security settings and click 'Sign out of all sessions' to instantly invalidate the attacker's authorization tokens.",
            actionType: "standard"
          }
        ]
      },
      {
        phase: "Phase 2: Hardening & Persistence Removal (5 - 60 Minutes)",
        steps: [
          {
            title: "Revoke Third-Party Connected Apps",
            desc: "Remove any unauthorized third-party apps, OAuth extensions, or API keys the attacker might have connected to retain ongoing access.",
            actionType: "vital"
          },
          {
            title: "Generate New 2FA Backup Codes",
            desc: "Print or store new 2FA recovery backup codes in a secure offline location, invalidating old ones.",
            actionType: "standard"
          },
          {
            title: "Rotate Passwords on Linked Financial & Primary Accounts",
            desc: "If you reused the hacked password elsewhere, immediately update it on all other services using a password manager.",
            actionType: "vital"
          }
        ]
      },
      {
        phase: "Phase 3: Formal Verification & Audit",
        steps: [
          {
            title: "Inspect Payment Methods & Order History",
            desc: "Review saved credit cards, UPI IDs, or subscription purchases on Amazon, Apple, or Google Play, disputing unauthorized transactions.",
            actionType: "standard"
          },
          {
            title: "Document Evidence (Timestamps & IP Logs)",
            desc: "Save screenshots of 'Recent Security Activity' showing the attacker's IP address and login timestamps for police reports.",
            actionType: "standard"
          }
        ]
      }
    ]
  },
  {
    id: "incident-payment-fraud",
    title: "I Lost Money to a UPI / Payment Scam",
    icon: "savings_off",
    severity: "CRITICAL",
    urgencyText: "CRITICAL GOLDEN HOUR: Act within 2 hours to freeze funds in transit across the banking network",
    phases: [
      {
        phase: "Phase 1: The 'Golden Hour' Response (0 - 30 Minutes)",
        steps: [
          {
            title: "Immediately Call the National Cyber Crime Helpline (1930)",
            desc: "In India, dial 1930 right away. The Citizen Financial Cyber Fraud Reporting System operates a real-time banking API to freeze money in the beneficiary account before the scammer withdraws it from an ATM.",
            actionType: "vital"
          },
          {
            title: "Contact Your Bank's Fraud Prevention Cell",
            desc: "Call your bank's dedicated emergency fraud number (usually on back of card or banking app). State clearly: 'I am reporting an unauthorized fraudulent transaction; please freeze the transaction reference and lock my UPI/NetBanking.'",
            actionType: "vital"
          },
          {
            title: "Capture the UPI Reference ID (UTR Number)",
            desc: "Open your payment app receipt and copy the 12-digit UTR (Unique Transaction Reference) number, transaction date, exact time, and recipient UPI ID. You MUST provide this to 1930.",
            actionType: "vital"
          }
        ]
      },
      {
        phase: "Phase 2: Formal Filing & Documentation (1 - 24 Hours)",
        steps: [
          {
            title: "File an Official Complaint on cybercrime.gov.in",
            desc: "Register a financial fraud complaint at cybercrime.gov.in. Upload transaction screenshots, chat logs, call recordings, and the UTR number. Note your Acknowledgement Number.",
            actionType: "vital"
          },
          {
            title: "Submit Written Notice to Your Bank Branch",
            desc: "Submit a formal written dispute letter to your home branch manager within 72 hours, quoting the Cyber Crime Acknowledgement Number and UTR. Under RBI guidelines (Charter of Customer Rights), prompt reporting establishes zero customer liability in many unauthorized electronic transfers.",
            actionType: "vital"
          },
          {
            title: "Report Scammer Profile in UPI & Social Apps",
            desc: "Report the fraudster's UPI ID inside Google Pay, PhonePe, or Paytm, and report their phone number on Truecaller / WhatsApp to prevent them victimizing others.",
            actionType: "standard"
          }
        ]
      },
      {
        phase: "Phase 3: Follow-Up & Account Reset",
        steps: [
          {
            title: "Change Your UPI PIN & Reset NetBanking Credentials",
            desc: "Reset your 4-digit or 6-digit UPI PIN from the payment app settings using your debit card credentials.",
            actionType: "vital"
          },
          {
            title: "Track Grievance with Banking Ombudsman",
            desc: "If your bank fails to resolve the unauthorized transfer dispute within 30 days, escalate to the RBI Banking Ombudsman (cms.rbi.org.in).",
            actionType: "standard"
          }
        ]
      }
    ]
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { INCIDENT_GUIDE_DATA };
}
