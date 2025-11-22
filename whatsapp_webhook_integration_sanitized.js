
// 📦 Dependencies
const express = require('express');
const axios = require('axios');

// 🚀 Initialize Express app
const app = express();
app.use(express.json());

// 🔐 Config Variables
const VERIFY_TOKEN = "<VERIFY_TOKEN>";
const WHATSAPP_TOKEN = "<WHATSAPP_TOKEN>";
const PHONE_NUMBER_ID = "<PHONE_NUMBER_ID>";
const NEW_RELIC_API_KEY = "<NEW_RELIC_API_KEY>";
const NR_ACCOUNT_ID = "3963341";

function convertDuration(input) {
  if (input.endsWith('m')) return `${input.slice(0, -1)} minutes`;
  if (input.endsWith('h')) return `${input.slice(0, -1)} hours`;
  if (input.endsWith('d')) return `${input.slice(0, -1)} days`;
  return input;
}

// ✅ Step 1: Handle webhook verification handshake
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verified");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// ✅ Step 2: Receive incoming WhatsApp messages
app.post('/webhook', async (req, res) => {
  const message = req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  const from = message?.from;
  const text = message?.text?.body;

  if (text) {
    console.log(`📥 Received: ${text}`);

    let reply = `You said: ${text}`;

    if (text.startsWith("/nrl")) {
      const [_, metric, duration] = text.split(" ");
      const converted = convertDuration(duration);
      const nrql = `SELECT average(${metric}) FROM SystemSample SINCE ${converted} ago`;

      const gqlQuery = {
        query: `{
          actor {
            account(id: ${NR_ACCOUNT_ID}) {
              nrql(query: "${nrql}") {
                results
                metadata {
                  facets
                }
              }
            }
          }
        }`
      };

      try {
        const nrResponse = await axios.post(
          "https://api.newrelic.com/graphql",
          gqlQuery,
          {
            headers: {
              "Content-Type": "application/json",
              "API-Key": NEW_RELIC_API_KEY
            }
          }
        );

        console.log("📡 NR Raw Response:", JSON.stringify(nrResponse.data, null, 2));

        const results = nrResponse.data?.data?.actor?.account?.nrql?.results;

        if (results && results.length > 0) {
          const formatted = results.map((r, i) => `${i + 1}. ${JSON.stringify(r)}`).join("\n");
          reply = `📊 ${metric} results:\n${formatted}`;
        } else {
          reply = `⚠️ No results returned for query.`;
        }
      } catch (err) {
        console.error("❌ New Relic API Error:", err.response?.data || err.message);
        reply = "⚠️ Failed to fetch data from New Relic.";
      }
    }

    const payload = {
      messaging_product: "whatsapp",
      to: from,
      text: { body: reply }
    };

    console.log("Sending payload to WhatsApp:", payload);

    try {
      await axios.post(
        `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${WHATSAPP_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );
    } catch (error) {
      console.error("❌ Axios error:", error.response?.data || error.message);
    }
  }

  res.sendStatus(200);
});

// 🟢 Start server on port 3030
app.listen(3030, () => console.log("🌐 Webhook server running on port 3030"));

app.get('/', (req, res) => {
  res.send("Webhook server is live!");
});
