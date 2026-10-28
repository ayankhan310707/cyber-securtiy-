/**
 * Student Scam Radar Data
 * Curated real-world educational examples of scams targeting college students and young professionals.
 */
const SCAM_RADAR_DATA = [
  {
    id: "fake-internship",
    title: "Fake Remote Internship & Part-Time Job Scams",
    category: "Careers & Internships",
    severity: "CRITICAL",
    icon: "work_alert",
    badgeColor: "error",
    summary: "Scammers promise high daily wages for trivial tasks (e.g., liking YouTube videos, reviewing hotels, rating apps) or data entry, then demand 'refundable registration fees' or crypto deposits.",
    mockup: {
      channel: "Telegram / WhatsApp Message",
      sender: "+91 98XXX-XXXXX (HR Talent Lead)",
      timestamp: "Today, 11:24 AM",
      text: "👋 Hello! I am Sarah from TechGlobal Talent Recruiters. Your resume was selected on our campus student portal! 🎉\n\nRole: Junior Remote Content Analyst\nStipend: ₹25,000 to ₹45,000/month (only 2 hours/day!)\nTasks: Like assigned YouTube videos & submit screenshots.\n\n⚠️ To activate your Employee Onboarding Portal & ID badge, please pay a 100% REFUNDABLE registration deposit of ₹1,499 via UPI to verify your banking credentials. Deposit will be returned with your first task payout in 1 hour!\n\nClick link to begin immediately: hxxps://techglobal-onboarding[.]xyz/pay"
    },
    redFlags: [
      {
        tag: "Upfront Payment Demand",
        desc: "Legitimate employers never demand registration fees, laptop security deposits, or background check costs from candidates."
      },
      {
        tag: "Absurd Pay for Minimal Effort",
        desc: "Promising ₹40,000/month for simply liking videos or typing numbers is an unrealistic bait mechanism designed to trigger FOMO."
      },
      {
        tag: "Non-corporate Communication Channels",
        desc: "Recruiting conducted entirely via Telegram or unverified WhatsApp numbers without an official corporate email domain."
      },
      {
        tag: "Artificial Urgency & 'Guaranteed' Refund",
        desc: "Pressure to pay within 1 hour combined with hollow guarantees that money will be refunded instantly."
      }
    ],
    psychology: "Exploits college students' eagerness for pocket money, flexible work-from-home gigs, and lack of corporate hiring experience.",
    defenseRules: [
      "Rule #1: Never pay money to earn money. Genuine jobs compensate you; they never ask you to invest first.",
      "Rule #2: Verify the recruiter's official company email address (e.g. name@company.com), never free Gmail or Telegram accounts.",
      "Rule #3: Cross-check job postings on official company careers pages and LinkedIn company profiles before sharing details."
    ]
  },
  {
    id: "scholarship-scam",
    title: "Scholarship & Financial Aid Grant Scams",
    category: "Academic & Grants",
    severity: "HIGH",
    icon: "school",
    badgeColor: "warning",
    summary: "Fraudsters send letters or emails claiming the student has won an exclusive government or international merit grant, but must pay a 'disbursement fee' or 'foreign exchange tax'.",
    mockup: {
      channel: "Official-Looking Email",
      sender: "national-awards-cell@scholarship-disbursement-gov[.]online",
      timestamp: "Yesterday, 3:15 PM",
      text: "OFFICIAL MEMORANDUM: National Merit Student Fellowship 2026\n\nDear Student,\nWe are pleased to notify you that your profile has been selected for the 2026 Merit Education Grant of ₹75,000 disburseable directly to your student bank account.\n\nTo release this treasury disbursement, you must complete your Mandatory Student Anti-Money Laundering (AML) Compliance by paying the statutory verification stamp duty of ₹2,200 within 24 hours.\n\nFailure to clear verification stamp fee will result in permanent disqualification and forfeiture to alternate candidates.\n\nVerify & Pay Stamp Duty: hxxps://scholarship-disbursement-gov[.]online/claim-grant"
    },
    redFlags: [
      {
        tag: "You Won a Grant You Never Applied For",
        desc: "Authentic scholarships require rigorous applications, transcripts, and faculty recommendations. You cannot win a competition you never entered."
      },
      {
        tag: "Processing / Stamp Duty Fee Request",
        desc: "Government and NGO scholarships deduct any administrative fees from the grant itself—they never request out-of-pocket payments."
      },
      {
        tag: "Lookalike Spoofed Domain (.online / .xyz)",
        desc: "The email uses 'scholarship-disbursement-gov.online' instead of the authentic government top-level domain (.gov.in, .gov, or .ac.in)."
      },
      {
        tag: "Forfeiture Threat & 24h Countdown",
        desc: "Aggressive forfeiture language prevents you from taking time to consult university authorities or parents."
      }
    ],
    psychology: "Preys on academic aspiration, student financial stress, and reliance on formal-sounding government terminology (AML, Treasury, Stamp Duty).",
    defenseRules: [
      "Rule #1: Check legitimate government grant portals directly (e.g., scholarships.gov.in) rather than clicking links in unsolicited emails.",
      "Rule #2: Inspect the sender's full email address and top-level domain. Official portals use '.gov' or '.edu'.",
      "Rule #3: Consult your college financial aid office or student advisor before sending any money for scholarship processing."
    ]
  },
  {
    id: "placement-offer",
    title: "Fraudulent Campus Placement & Spoofed Offer Letters",
    category: "Campus Recruitment",
    severity: "CRITICAL",
    icon: "badge",
    badgeColor: "error",
    summary: "Scammers forge corporate letterheads of renowned tech giants (Google, TCS, Infosys, Deloitte) and send direct job offers without technical interviews to collect sensitive identity documents and onboarding fees.",
    mockup: {
      channel: "PDF Email Attachment",
      sender: "tcs.campus.hiring.board@gmail.com",
      timestamp: "3 days ago",
      text: "TCS CAMPUS RECRUITMENT CELL // CONFIDENTIAL OFFER\n\nRef: TCS/2026/OFFER/77892\nCandidate: Selected for Systems Engineer (Package: 7.2 LPA)\n\nWe are delighted to extend this direct placement offer under the Special Academic Diversity quota. Your appointment is confirmed without interview based on semester GPA.\n\nMandatory Compliance Step:\nAs per company health and asset insurance policy, all candidates must procure corporate liability insurance through our verified vendor panel by transferring ₹4,800 to our banking registrar before 5:00 PM today to guarantee your training batch seat in Bengaluru.\n\nAttach your Aadhaar Card, PAN Card, and Bank Cancelled Cheque in reply."
    },
    redFlags: [
      {
        tag: "Free Public Webmail Sender (@gmail.com)",
        desc: "Major technology firms strictly communicate via their official corporate domains (@tcs.com, @infosys.com, @google.com), never free Gmail or Yahoo accounts."
      },
      {
        tag: "Direct Job Offer Without Interviews",
        desc: "Legitimate corporate engineering positions require coding rounds, technical interviews, and HR discussions. Instant offers are universally fraudulent."
      },
      {
        tag: "Third-Party Insurance / Asset Deposit Fee",
        desc: "Authentic corporate enterprises provide health insurance and equipment at company expense. They never demand upfront candidate deposits."
      },
      {
        tag: "Demanding Identity Documents (Aadhaar / PAN)",
        desc: "Attackers collect your government identity documents to open fraudulent bank accounts or apply for illicit micro-loans in your name."
      }
    ],
    psychology: "Leverages intense placement season anxiety, competitive peer pressure, and the euphoria of landing an unexpected high-paying corporate role.",
    defenseRules: [
      "Rule #1: Always authenticate campus placement offers through your official university Training & Placement (T&P) Officer.",
      "Rule #2: Real MNCs never conduct campus hiring through @gmail.com addresses or dispense with technical evaluation rounds.",
      "Rule #3: Never upload PAN cards, Aadhaar cards, or bank cancelled cheques to unverified emails."
    ]
  },
  {
    id: "upi-scam",
    title: "UPI Reverse Payment & QR Code 'Receive' Scams",
    category: "Financial & Payments",
    severity: "CRITICAL",
    icon: "currency_exchange",
    badgeColor: "error",
    summary: "Attackers posing as buyers on marketplace sites claim they are sending you money, but trick you into scanning a QR code or entering your UPI PIN, which immediately transfers money OUT of your bank.",
    mockup: {
      channel: "WhatsApp & UPI App Notification",
      sender: "OLX Buyer / Classifieds User",
      timestamp: "Yesterday, 6:40 PM",
      text: "Buyer: 'Bhai, I want to buy your engineering graphics tablet for ₹3,500. I am an Army officer stationed at border depot, so my orderly will pick it up tomorrow.'\n\nBuyer: 'I have created an instant Government Merchant Credit voucher for ₹3,500. I am sending you the official bank QR code image on WhatsApp.'\n\nBuyer: 'Just open Google Pay / PhonePe, scan this QR code, and enter your 4-digit or 6-digit UPI PIN to confirm your bank account and receive the credit of ₹3,500 right now! Hurry, the voucher expires in 10 minutes!'"
    },
    redFlags: [
      {
        tag: "Entering UPI PIN to RECEIVE Money",
        desc: "The absolute #1 red flag in digital payments. You NEVER need to enter your UPI PIN to receive money. A PIN is exclusively required to AUTHORIZE MONEY OUT."
      },
      {
        tag: "Scanning a QR Code to Receive Funds",
        desc: "Scanning a QR code in payment apps is solely a command to PAY a merchant or person, not to claim incoming transfers."
      },
      {
        tag: "Impersonating Military / Armed Forces",
        desc: "Scammers frequently use stolen photos of army personnel or uniformed officers to manufacture unquestioned trust and deter verification."
      },
      {
        tag: "Time Expiration Threat ('Voucher expires in 10 mins')",
        desc: "Manufactures panic so the victim focuses on the countdown timer rather than reading the screen prompt in their payment app."
      }
    ],
    psychology: "Exploits technical misunderstanding of how the Unified Payments Interface (UPI) protocol works, combined with respect for military authority.",
    defenseRules: [
      "Rule #1: GOLDEN UPI LAW: PIN = Pay. You enter your PIN only when money is leaving your account. Zero exceptions.",
      "Rule #2: To receive money via UPI, you only need to provide your mobile number or UPI ID (VPA). You never need to open scanner or enter a PIN.",
      "Rule #3: If a buyer asks you to scan an image or approve a 'collect' request to receive money, immediately block and report them."
    ]
  },
  {
    id: "lms-phishing",
    title: "Academic Portal & LMS Password Harvester",
    category: "Campus Infrastructure",
    severity: "HIGH",
    icon: "domain",
    badgeColor: "warning",
    summary: "Cloned student ERP, Moodle, or Canvas login screens sent via SMS or phishing emails warning that grades or exam hall tickets will be withheld unless credentials are re-authenticated.",
    mockup: {
      channel: "SMS from 'CAMPUS-INFO'",
      sender: "VM-ACADEMIC",
      timestamp: "Today, 8:05 AM",
      text: "CAMPUS ALERT: Your Semester End Exam Hall Ticket & Seating Number has been published on the ERP portal. Due to server migration, all student session tokens have expired.\n\nRe-authenticate your Student ID and Master Password within 12 hours to download your admit card before portal lockout: hxxps://univ-portal-exam-admit[.]top/login\n\nUnverified students will NOT be permitted inside examination hall."
    },
    redFlags: [
      {
        tag: "Suspicious Lookalike URL (.top / .cfd)",
        desc: "The URL has a cheap top-level domain (.top) rather than your university's authentic domain name."
      },
      {
        tag: "High-Stakes Academic Blackmail",
        desc: "Threatening to bar students from semester examinations creates immense stress, disabling cautious judgment."
      },
      {
        tag: "Unrequested Password Re-verification",
        desc: "Colleges never require urgent mass password re-verification via SMS links right before an exam period."
      },
      {
        tag: "Generic SMS Header",
        desc: "SMS headers like VM-ACADEMIC or bulk SMS aggregators can be spoofed or bought by third parties."
      }
    ],
    psychology: "Leverages intense academic stress, fear of disqualification from examinations, and automatic student habit of logging into campus services.",
    defenseRules: [
      "Rule #1: Never click direct login links from SMS. Manually type your university portal's official bookmarked URL in your browser.",
      "Rule #2: Verify the SSL certificate and exact domain in your browser's address bar before typing passwords.",
      "Rule #3: Enable Multi-Factor Authentication (MFA) on student and university email accounts."
    ]
  },
  {
    id: "blackmail-bot",
    title: "Social Media Sextortion & Video Call Blackmail",
    category: "Privacy & Social Media",
    severity: "CRITICAL",
    icon: "security_update_warning",
    badgeColor: "error",
    summary: "Attackers create attractive fake profiles on Instagram or dating apps, initiate a brief video call showing pre-recorded explicit video, record the student's face, and threaten to send morphed compromising videos to all friends and family.",
    mockup: {
      channel: "Instagram DM / WhatsApp",
      sender: "Anonymous Blackmailer (@cyber_leak_99)",
      timestamp: "Late Night, 1:12 AM",
      text: "Look at this video clip. We recorded you during that video call. We also have your entire Instagram followers list, your college friends (@rahul_21, @ananya_k, @campus_club), and your parents' contact info.\n\nIf you don't transfer ₹20,000 to this UPI ID within 30 minutes, we will broadcast this morphed explicit video to all 480 of your college followers and upload it to YouTube.\n\nDo not block us or tell anyone or your life is ruined."
    },
    redFlags: [
      {
        tag: "Rapid Escalation to Video Call",
        desc: "Profile immediately asks to switch from text messaging to Instagram or WhatsApp video calls within minutes of matching."
      },
      {
        tag: "Morphed / Deepfake Composite Footage",
        desc: "The blackmailer combines your 5-second facial camera view with pre-recorded explicit footage to construct a fake compromising clip."
      },
      {
        tag: "Follower List Screenshot as Extortion Leverage",
        desc: "Scammers scrape public follower lists from open social media profiles to use as psychological hostages."
      },
      {
        tag: "Insatiable Financial Demands",
        desc: "Paying the blackmailer never stops the blackmail; it proves you are terrified and guarantees endless escalation."
      }
    ],
    psychology: "Exploits extreme social stigma, panic, loneliness, and embarrassment. Victims feel isolated and fear public humiliation.",
    defenseRules: [
      "Rule #1: NEVER PAY A SINGLE RUPEE. Paying does not delete the video; it marks you as an easy recurring target.",
      "Rule #2: Immediately privatize your social media profiles, take screenshots of the extortion messages for evidence, and cut all communication.",
      "Rule #3: Call the National Cyber Crime Helpline (1930 in India / local police cyber cell) and file an anonymous complaint on cybercrime.gov.in. Authorities handle these cases daily with strict confidentiality."
    ]
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SCAM_RADAR_DATA };
}
