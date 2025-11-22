# WhatsApp ChatOps Bot with New Relic Integration

This project is a lightweight Node.js-based middleware service that allows on-call engineers and DevOps teams to interact with observability metrics using WhatsApp. The bot integrates Meta's WhatsApp Cloud API with New Relic's NerdGraph API to retrieve and display application and infrastructure telemetry directly in WhatsApp chats.

---

## 🔧 Features

- ✅ Webhook integration with WhatsApp Cloud API
- 📥 Handles incoming user messages
- 🔄 Echo replies for general inputs
- 📈 Parses specific `/nrl` commands to fetch observability metrics
- 📊 Fetches data using New Relic's NerdGraph GraphQL API
- 🛠️ Flexible NRQL query builder with duration conversion (e.g. `30m`, `2h`)
- 🚨 Includes fallback responses and error handling

---

## 📦 Tech Stack

- Node.js (v18+)
- Express.js
- Axios
- WhatsApp Cloud API (Meta)
- New Relic NerdGraph API

---

## 🚀 Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/martin-charles/whatsappbot_Integration.git
cd whatsappbot_Integration
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file or replace the hardcoded variables in the script with your actual values:
```env
VERIFY_TOKEN=test123
WHATSAPP_TOKEN=<your_whatsapp_token>
PHONE_NUMBER_ID=<your_phone_number_id>
NEW_RELIC_API_KEY=<your_new_relic_api_key>
NR_ACCOUNT_ID=<your_nr_account_id>
```

### 4. Run the Bot
```bash
node whatsapp_webhook_integration_sanitized.js
```
You should see:
```
🌐 Webhook server running on port 3030
```

---

## 📱 WhatsApp Bot Usage

### 🧪 Test Commands
Send messages from your connected WhatsApp phone number:
- `Hello bot` → Echoes back
- `/nrl cpuPercent 30m` → Queries NR for average CPU usage in last 30 minutes

### 📘 Command Format
```
/nrl <metric> <duration>
```
Supported durations:
- Minutes: `30m`
- Hours: `2h`
- Days: `1d`

---

## 🧠 Architecture Overview
```text
WhatsApp (User)
   ⬇
WhatsApp Cloud API (Meta)
   ⬇
Your Webhook Server (Express.js)
   ⬇
Command Parser (/nrl ...)
   ⬇
New Relic NerdGraph API
   ⬇
Response → WhatsApp Cloud API → User
```

---

## 🛡️ Security Notes
- All sensitive tokens (WhatsApp, New Relic API) should be stored securely in environment variables or a secret manager.
- Avoid committing hardcoded credentials to source control.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).

---

## 🙌 Acknowledgements
- Meta for WhatsApp Cloud API
- New Relic for the powerful observability platform

---

## 💬 Questions / Support
Feel free to open issues or discussions in the GitHub repository if you need help.

