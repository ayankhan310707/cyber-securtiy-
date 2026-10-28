# Cyber Defense Sentinel // Think Before You Click

An interactive, client-side cybersecurity training ground and awareness platform designed for college students, developers, and everyday web users. Built with technical precision and tactical design principles to train users to identify social engineering attacks, outsmart campus employment scams, analyze phishing lures, audit account privacy, and manage cyber emergencies.

---

## 🛡️ Functional Feature Matrix

### 0. 🌐 3D Rotating Cyber Threat Intelligence Globe (Three.js WebGL)
- **Interactive Three.js Core**: Integrated directly into the hero section beside "Think Before You Click".
- **1,400 Fibonacci Data Nodes**: Dense cyber point cloud mapped across the globe surface with neon lime (`#00FF66`), cyan (`#06B6D4`), and deep obsidian green nodes.
- **Dual Defense Orbits**: Concentric outer orbital defense rings with differential spin velocities.
- **Quadratic Bezier Threat Arcs**: Elevated threat intercept trajectories connecting global vulnerability hotspots with pulsing beacon markers.
- **Interactive Parallax & Controls**: Smooth mouse and touch rotation, pause/resume button, and orientation reset. 100% offline support via local `js/three.min.js`.

### 1. 🔍 Phishing Message Analyzer
- **Interactive Inspection**: Paste any suspicious SMS, Telegram message, recruitment email, or payment voucher.
- **Preset Fictional Samples**: Instant 1-click test samples (Bank KYC suspension, Telegram part-time job scam, university exam hall ticket alert, lottery prize lure, and legitimate campus seminar).
- **Heuristic Threat Detection**: Scans for artificial urgency, coercive threats, OTP/PIN solicitation, deceptive/shortened URLs, risky top-level domains (`.xyz`, `.top`, bare IPs), and upfront fee demands.
- **Safe URL Defanging**: Automatically defangs extracted URLs (e.g. `hxxp://` and `[.]`) to ensure safe examination without risk of accidental clicks.
- **Transparent Risk Assessment**: Explains *why* specific phrases triggered warnings with point weightings, a composite risk score (0–100), and custom defensive guidance.
- **States Handled**: Empty state, animated cyber scanning loading state, error state, and detailed results breakdown.

### 2. 🎯 Cyber Safety Quiz (10 Scenarios)
- **10 Real-World Multiple-Choice Questions**:
  1. Urgent account termination & deceptive domains
  2. Public unencrypted Wi-Fi hygiene & MITM risks
  3. "Accidental" OTP solicitation social engineering
  4. Credential stuffing risks of password reuse
  5. Excessive mobile app permissions & spyware utilities
  6. Quishing (malicious QR code overlays)
  7. Upfront registration fee internship fraud
  8. Double file extensions (`.pdf.exe`) malware delivery
  9. FIDO2 / WebAuthn vs SMS 2-Factor Authentication
  10. UPI "Reverse Payment" & QR scan deceptions
- **Instant Feedback**: Interactive option selection locks in your choice, displays instant visual feedback (correct green / incorrect red), and renders an in-depth educational explanation box detailing the attacker's psychology and defense pro-tips.
- **Navigation**: Question jump pills (1 to 10) and next/previous controls.
- **Scored Results**: Final score out of 10, performance percentile rank (Cyber Sentinel, Cyber Defender, Security Conscious, Recruit), full review of all 10 answers, and local persistence.

### 3. 🔑 Password Strength Lab
- **100% Local-Only Sandbox**: Keystrokes never leave browser memory. Passwords are never sent across networks, stored in cookies, or collected.
- **Mathematical Information Entropy**: Calculates Shannon entropy bits, character pool variety (lowercase, uppercase, numbers, symbols), and identifies pattern weaknesses (common words, sequential sweeps like `qwerty`, birth years).
- **GPU Crack Time Simulation**: Realistic brute-force time estimates based on multi-GPU offline hashcat cracking clusters (100 Billion hashes/sec) vs slow salted hashes (Argon2 / bcrypt).
- **Cryptographic Generator**: Generate strong random passwords (8 to 32 characters) or 4-word mnemonic passphrases (Diceware method) using browser `window.crypto.getRandomValues()`. 1-click copy with toast notifications and direct transfer to lab.

### 4. 📋 Privacy Hardening Checklist
- **12 Actionable Controls**: Covering FIDO2 Authenticator apps, password managers, OAuth permissions audit, HaveIBeenPwned breach checks, social media visibility lockdown, lockscreen OTP preview suppression, Wi-Fi auto-connect disabling, encrypted DNS (DoH), and SIM card PIN protection.
- **Categorization**: Filter controls by Authentication, Identity, Device, Network, or Financial.
- **Live Progress Bar**: Dynamic % hardened and task counters.
- **Reset Option**: Clean reset button with confirmation modal.
- **Persistent State**: Toggled tasks are stored locally in `localStorage`.

### 5. 📡 Student Scam Radar
- **Curated Campus Threat Intelligence**:
  1. *Fake Remote Internships & Part-time Work Scams* (Telegram YouTube rating tasks)
  2. *Scholarship & Financial Aid Grant Scams* (Upfront stamp duty / AML fee demands)
  3. *Fraudulent Campus Placement & Spoofed Offer Letters* (Free webmail HR impersonation)
  4. *UPI Reverse Payment & QR Code Fraud* ("Enter PIN to receive credit" deceptions)
  5. *Academic Portal & LMS Password Harvester* (Admit card exam disqualification threats)
  6. *Social Media Sextortion & Video Call Blackmail* (Deepfake morphing & follower threats)
- **Interactive Inspector**: Inspect real-world message mockups, critical red flags, attacker psychological vectors, and 3 Golden Defensive Rules.
- **Search & Category Filters**: Search by keyword or filter by domain.

### 6. 🚨 Incident Response Guide
- **Phased Emergency Triage** for 4 critical cyber emergencies:
  - *I Clicked a Phishing Link*
  - *I Accidentally Shared an OTP / 2FA Code*
  - *My Account Is Compromised / Hacked*
  - *I Lost Money to a UPI / Payment Scam*
- **Action Phases**:
  - *Phase 1: Immediate Triage (0 – 5 Minutes)* — Disconnect, lock, freeze
  - *Phase 2: Containment & Remediation (5 – 60 Minutes)* — Token invalidation, password rotation
  - *Phase 3: Formal Reporting & Recovery* — Official cybercrime reporting
- **Emergency Helplines**: Direct access to National Cyber Crime Reporting Portal (Dial `1930` in India, `cybercrime.gov.in`, RBI Banking Ombudsman).
- **Printable Checklist**: Dedicated print-friendly styles for offline emergency execution.

### 7. 📊 Learning Dashboard
- **Aggregated Readiness Posture**: Tracks quiz scores, completed checklist tasks, and tools used.
- **Dynamic Readiness Tier**: Evolves from Level 1 (Recruit) to Level 4 (Sentinel Guardian).
- **Smart Recommendations**: Recommends learning topics based on questions missed in the quiz or unchecked hygiene items.
- **Data Sovereignty**: "Reset All Data" option with zero telemetry transmitted off-device.

### 8. 🔐 Student Identity & OTP Authentication Terminal
- **Full Identity Fields**: Collects Full Name, Email Address, and Phone Number (with country code selector).
- **Simulated 2FA OTP Protocol**: Includes a live "Send OTP" button, a realistic educational defense SMS alert with a 6-digit verification code, an auto-paste button, and a 30s resend timer.
- **Profile Synchronization**: Upon verification, personalizes the navigation bar header chip and displays the authenticated student badge on the Learning Dashboard.
- **100% Client-Side Privacy**: No personal data or numbers are transmitted externally; session data resides strictly in local browser memory.
- **Demo Identity**: Quick 1-click test student identity button ("Rohan Sharma") for effortless testing.

---

## 📁 Project File Structure

```
cyber/
├── index.html                  # Main production application entrypoint
├── code.html                   # Synchronized application file
├── DESIGN.md                   # Brand, typography, and tactical design specifications
├── preview.png                 # Application preview visual
├── css/
│   └── styles.css              # Custom cyber-grid canvas, animations, glows, scrollbars, print styles
└── js/
    ├── quiz-data.js            # 10 authentic cyber safety multiple-choice scenarios & explanations
    ├── scam-radar-data.js      # Student scam catalog with message mockups & red flags
    ├── analyzer.js             # Heuristic phishing analysis engine & URL defanger
    ├── password-lab.js         # Client-side entropy math, GPU crack times, & secure generator
    ├── checklist-data.js       # 12 privacy & account-hardening controls
    ├── incident-guide-data.js  # 4 emergency triage workflows & helplines
    └── app.js                  # Master state controller, UI events, & localStorage manager
```

---

## 🚀 How to Run Locally

Because the application is built with standard web technologies (HTML5, Tailwind CSS, JavaScript ES6+), it requires **zero installation of heavy build tools or database servers**.

### Option 1: Direct File Launch (Fastest)
1. Navigate to `C:\Users\JSPMUNI-ERP-06\cyber\` in Windows File Explorer.
2. Double-click `index.html` (or right-click → **Open with** → **Microsoft Edge** / **Google Chrome**).
3. The application runs immediately in your browser with full offline interactivity!

### Option 2: Python Built-in Web Server (If Python is available)
Open PowerShell or Command Prompt in the project folder and run:
```powershell
cd C:\Users\JSPMUNI-ERP-06\cyber
python -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

### Option 3: PowerShell Micro Web Server (Zero Install)
If Python or Node.js are not installed on your system, you can start a native web server using PowerShell:
```powershell
cd C:\Users\JSPMUNI-ERP-06\cyber
powershell -Command "
$listener = New-Object System.Net.HttpListener;
$listener.Prefixes.Add('http://localhost:8080/');
$listener.Start();
Write-Host 'Server running at http://localhost:8080/ - Press Ctrl+C to stop';
while ($listener.IsListening) {
    $context = $listener.GetContext();
    $path = Join-Path 'C:\Users\JSPMUNI-ERP-06\cyber' ($context.Request.Url.LocalPath.TrimStart('/'));
    if ([string]::IsNullOrEmpty($context.Request.Url.LocalPath.TrimStart('/'))) { $path = 'C:\Users\JSPMUNI-ERP-06\cyber\index.html' }
    if (Test-Path $path) {
        $bytes = [System.IO.File]::ReadAllBytes($path);
        $context.Response.ContentLength64 = $bytes.Length;
        $context.Response.OutputStream.Write($bytes, 0, $bytes.Length);
    } else {
        $context.Response.StatusCode = 404;
    }
    $context.Response.Close();
}"
```
Then visit `http://localhost:8080` in your browser.

### Option 4: VS Code Live Server
1. Open the `cyber` folder in Visual Studio Code.
2. Install the **Live Server** extension (by Ritwick Dey).
3. Right-click `index.html` and choose **"Open with Live Server"**.

---

## 🔒 Privacy & Ethical Disclaimers
- **Local Browser Execution**: All password calculations and phishing text heuristics run in JavaScript memory inside your browser. No passwords, entered messages, or quiz answers are transmitted over any network or stored in external databases.
- **Safe Defanging**: All URLs extracted by the Phishing Analyzer are automatically defanged (`hxxps://`, `[.]`) to prevent automatic network requests or accidental clicks.
- **Educational Awareness**: All sample scenarios, fake recruitment emails, and scam profiles are fictional composites created strictly for cybersecurity awareness training.
