/**
 * Cyber Safety Quiz Data
 * 10 authentic, educational multiple-choice scenarios designed for students and everyday users.
 */
const CYBER_QUIZ_DATA = [
  {
    id: 1,
    category: "Phishing & Email Security",
    question: "You receive an email from 'IT-Support-Team@your-univ-security-portal.xyz' with the subject: 'URGENT: Your student cloud storage account will be terminated in 2 hours unless you confirm your password here.' What is the safest immediate action?",
    options: [
      {
        text: "Click the link immediately to verify your credentials before storage is deleted.",
        correct: false,
        reason: "Clicking links from unknown domains directly hands your login credentials to attackers."
      },
      {
        text: "Forward the email to your classmates so they can also verify their storage accounts.",
        correct: false,
        reason: "Forwarding malicious emails amplifies the phishing campaign across campus."
      },
      {
        text: "Do not click. Inspect the sender domain (.xyz is not your university), verify via official university IT channels, and report phishing.",
        correct: true,
        reason: "Phishing attacks rely on artificial urgency (2-hour deadline) and deceptive domains. Authentic IT departments never demand passwords via external domains."
      },
      {
        text: "Reply to the email asking the sender to prove they work for the university.",
        correct: false,
        reason: "Replying confirms your email address is active, prompting more targeted attacks."
      }
    ],
    hint: "Notice the domain suffix (.xyz vs official university .edu/.ac.in) and the high-pressure time limit."
  },
  {
    id: 2,
    category: "Public Wi-Fi Hygiene",
    question: "You are studying at a coffee shop and connect to an open network named 'Free_Campus_Cafe_WiFi' with no password. You need to make an urgent semester exam fee payment. What should you do?",
    options: [
      {
        text: "Proceed immediately since the coffee shop has an active cashier desk.",
        correct: false,
        reason: "Physical staff presence does not protect open unencrypted radio waves from digital interception."
      },
      {
        text: "Avoid making payments on unencrypted public Wi-Fi without a trusted VPN; switch to cellular mobile data instead.",
        correct: true,
        reason: "Open Wi-Fi networks allow attackers to execute Man-In-The-Middle (MITM) attacks or set up rogue Evil Twin access points. Cellular data or a reputable VPN encrypts your traffic."
      },
      {
        text: "Only proceed if you use Private / Incognito browsing mode.",
        correct: false,
        reason: "Incognito mode only conceals local browser history—it provides zero encryption over Wi-Fi networks."
      },
      {
        text: "Ask another student if their payment worked without issues.",
        correct: false,
        reason: "Other users cannot know if passive packet sniffing is currently occurring on the network."
      }
    ],
    hint: "Incognito mode does NOT encrypt network traffic. Cellular data is significantly safer than open public Wi-Fi."
  },
  {
    id: 3,
    category: "Authentication & OTP Security",
    question: "You receive an SMS with a 6-digit verification OTP for your social media account. Seconds later, a college acquaintance messages you: 'Hey! I accidentally entered your phone number while registering for an event, could you please tell me the 6 digits you just received?'",
    options: [
      {
        text: "Share the code since they are a familiar acquaintance and apologized politely.",
        correct: false,
        reason: "Their account may have been hijacked, or the attacker is impersonating them to steal your credentials."
      },
      {
        text: "Read only the first 3 digits so they can't misuse the full code.",
        correct: false,
        reason: "Partial codes still assist brute-force attempts and confirm active cooperation."
      },
      {
        text: "Never share the OTP under any circumstance; an attacker is actively attempting to take over your account.",
        correct: true,
        reason: "An OTP is your personal authentication secret. Account takeover scams frequently invent 'accidental number' stories to trick victims into handing over 2FA codes."
      },
      {
        text: "Send a random fake 6-digit number to see how they react.",
        correct: false,
        reason: "Engaging with scammers is risky. The safest action is ignoring, reporting, and securing your account."
      }
    ],
    hint: "No legitimate service or friend will ever need a verification code sent directly to your phone."
  },
  {
    id: 4,
    category: "Password Management & Credential Stuffing",
    question: "Why is using the same strong, complex password (e.g. 'Tr0ub4dor&3#Secure!') across your university portal, email, gaming account, and online shopping sites a dangerous security practice?",
    options: [
      {
        text: "It consumes too much browser cache memory over time.",
        correct: false,
        reason: "Password length and reuse have no impact on browser cache or device memory."
      },
      {
        text: "If any low-security website suffers a data breach, attackers use automated credential stuffing to compromise your critical accounts.",
        correct: true,
        reason: "Breached databases are parsed by automated bots that test leaked email/password pairs across banking, email, and social networks in seconds."
      },
      {
        text: "Password hashing algorithms run significantly slower when passwords repeat across websites.",
        correct: false,
        reason: "Hashing occurs independently on each separate server; there is no cross-server speed penalty."
      },
      {
        text: "Modern web browsers automatically lock accounts with identical passwords.",
        correct: false,
        reason: "Browsers may warn you of compromised passwords, but they cannot automatically lock third-party accounts."
      }
    ],
    hint: "Consider what happens when an obscure shopping forum gets breached: attackers take that password straight to your email."
  },
  {
    id: 5,
    category: "Mobile Privacy & App Permissions",
    question: "You install a simple 'Flashlight & Torch Utility' app from an app repository. Upon opening, it asks for permissions to access your Contacts, Microphone, Camera, and SMS. What is the most appropriate response?",
    options: [
      {
        text: "Grant all permissions because the torch app needs them to calibrate screen brightness.",
        correct: false,
        reason: "Flashlight hardware operates via the camera flash API—it never requires SMS, Contacts, or Microphone access."
      },
      {
        text: "Deny all permissions, immediately uninstall the app, and report it for deceptive permission harvesting.",
        correct: true,
        reason: "Under the Principle of Least Privilege, apps asking for sensitive capabilities unrelated to their core utility are often spyware, fleeceware, or ad fraud bots."
      },
      {
        text: "Grant permissions for 24 hours to test whether the flashlight functions correctly.",
        correct: false,
        reason: "24 hours is more than enough time for malicious apps to exfiltrate your entire contact book and messages."
      },
      {
        text: "Turn off Wi-Fi before granting the permissions so the data can't upload.",
        correct: false,
        reason: "The app will simply cache your contacts locally and upload them the moment internet connectivity resumes."
      }
    ],
    hint: "Always question why a single-purpose utility needs access to your personal contacts and SMS messages."
  },
  {
    id: 6,
    category: "QR Code Safety & Quishing",
    question: "At a university food stall, you notice a printed paper sticker QR code placed over the merchant's payment stand stating: 'Scan here for instant 50% Student Cashback on your UPI payment!' What is the main danger?",
    options: [
      {
        text: "QR codes only work on Android devices, so iOS devices will crash.",
        correct: false,
        reason: "QR codes are universal optical barcodes supported across all mobile operating systems."
      },
      {
        text: "Physical sticker overlays are common 'Quishing' scams designed to divert payments to an attacker's UPI account or open phishing sites.",
        correct: true,
        reason: "Scammers paste fraudulent QR stickers over genuine merchant placards. Always verify the merchant name displayed in your payment app before entering any payment details."
      },
      {
        text: "Scanning any QR code automatically downloads ransomware without user confirmation.",
        correct: false,
        reason: "Modern mobile browsers do not execute arbitrary code upon scan; the primary threat is malicious redirects or fraudulent payment recipient IDs."
      },
      {
        text: "There is no danger if the QR code is printed on glossy sticker paper.",
        correct: false,
        reason: "Print quality has no bearing on legitimacy; anyone can print professional glossy QR stickers."
      }
    ],
    hint: "Check if the QR code is an overlay sticker and always inspect the recipient name on your screen before proceeding."
  },
  {
    id: 7,
    category: "Employment & Internship Fraud",
    question: "A recruiter reaches out to you on Telegram offering a 'Flexible Work-From-Home Student Internship' paying ₹35,000/month for liking videos. To issue your official offer letter and employee ID, they request a 'refundable document verification fee of ₹1,500'. What should you do?",
    options: [
      {
        text: "Pay the ₹1,500 immediately because the promised monthly stipend is significantly higher.",
        correct: false,
        reason: "The high salary is deliberately exaggerated bait; you will never get your money back."
      },
      {
        text: "Negotiate to pay half (₹750) now and have the remaining half deducted from your first salary.",
        correct: false,
        reason: "Scammers will take whatever amount you send and follow up with endless demands for more 'taxes' or 'fees'."
      },
      {
        text: "Recognize this as an upfront-fee employment scam; legitimate employers never demand money from candidates to start working.",
        correct: true,
        reason: "Real companies and university internships compensate their workers; they never charge 'security deposits', 'training charges', or 'kit fees'. Any upfront fee request is fraud."
      },
      {
        text: "Send a scan of your passport and bank passbook first to prove your student status.",
        correct: false,
        reason: "Sending identity documents provides scammers with credentials for identity theft and fraudulent SIM purchases."
      }
    ],
    hint: "Golden Rule: Legitimate jobs PAY you. If you have to pay money to get a job, it is 100% a scam."
  },
  {
    id: 8,
    category: "Malware & Deceptive File Extensions",
    question: "You receive an email from an unfamiliar address claiming to be from the exam administration cell with an attachment titled 'Semester_Final_Grades_Report.pdf.exe'. What does this indicate?",
    options: [
      {
        text: "It is an encrypted PDF document that opens using an automatic executable reader.",
        correct: false,
        reason: "Authentic PDFs use the .pdf extension and open natively in standard PDF viewers, never as .exe binaries."
      },
      {
        text: "It is a dangerous executable file disguising itself using a double file extension to trick users into running malware.",
        correct: true,
        reason: "Windows hides known file extensions by default. Attackers append '.pdf.exe' so users only notice '.pdf' and execute malware, trojans, or infostealers."
      },
      {
        text: "It is a standard compressed archive file created by macOS computers.",
        correct: false,
        reason: "macOS archives use .zip, .tar, or .dmg formats, never Windows .exe executable binaries."
      },
      {
        text: "You can safely open it as long as your device has updated graphic card drivers.",
        correct: false,
        reason: "Graphic drivers provide no protection against executable binary exploitation or ransomware."
      }
    ],
    hint: "Look at the very last extension after the final period: .exe represents an executable program, not a document."
  },
  {
    id: 9,
    category: "Two-Factor Authentication Security",
    question: "Which of the following Multi-Factor Authentication (MFA) mechanisms provides the strongest defense against SIM-swapping and automated adversary-in-the-middle phishing attacks?",
    options: [
      {
        text: "SMS text message verification codes sent to your cellular carrier.",
        correct: false,
        reason: "SMS codes are susceptible to SIM swap fraud, cellular signaling (SS7) attacks, and phishing proxy harvesting."
      },
      {
        text: "Secret security questions like 'What is your mother's maiden name?'.",
        correct: false,
        reason: "Security questions are static and easily uncovered through social media profiling or public records."
      },
      {
        text: "Hardware Security Keys (FIDO2 / WebAuthn like YubiKey) or Time-based Authenticator Apps (TOTP).",
        correct: true,
        reason: "FIDO2 / WebAuthn cryptographic keys cryptographically bind authentication to the verified domain name, making phishing technically impossible even on cloned replica websites."
      },
      {
        text: "Receiving a one-time verification link sent to an unsecured secondary email.",
        correct: false,
        reason: "Secondary emails with identical or weak passwords become a single point of failure."
      }
    ],
    hint: "Cryptographic hardware tokens and authenticator apps do not rely on telecommunication networks or plain text transmission."
  },
  {
    id: 10,
    category: "Financial Scams & UPI Deception",
    question: "You put up an old college textbook for sale on a student classifieds marketplace. A buyer messages: 'I want to purchase this! I have sent you a payment request of ₹500. Just scan this QR code or enter your UPI PIN to receive the money.' What is happening?",
    options: [
      {
        text: "Enter your UPI PIN right away so the funds can credit into your linked bank account.",
        correct: false,
        reason: "Entering your UPI PIN authorizes a debit from your bank. It will instantly transfer money TO the scammer."
      },
      {
        text: "Never enter your UPI PIN to receive money; entering a UPI PIN is strictly and exclusively used to SEND money.",
        correct: true,
        reason: "Universal UPI Banking Rule: Receiving money requires zero authorization from you. You NEVER enter a PIN or scan a code to receive payments. Entering your PIN transfers funds OUT."
      },
      {
        text: "Enter 0000 instead of your real PIN to safely verify whether the money arrives.",
        correct: false,
        reason: "Entering an incorrect PIN may fail, but attempting PIN authorization under false pretenses is dangerous."
      },
      {
        text: "Scan the QR code but do not accept the terms of service in the app.",
        correct: false,
        reason: "Scammers disguise 'Pay/Collect' requests as 'Refund/Receive' vouchers. Scanning takes you directly into an outflow transaction."
      }
    ],
    hint: "Rule of Gold: You NEVER enter your UPI PIN to RECEIVE funds. PIN entry ALWAYS authorizes money leaving your account."
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CYBER_QUIZ_DATA };
}
