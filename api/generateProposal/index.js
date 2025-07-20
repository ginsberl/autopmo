// api/generateProposal/index.js

const axios = require("axios");

module.exports = async function (context, req) {
  const userPrompt = req.body?.prompt;
  if (!userPrompt) {
    context.res = { status: 400, body: "Missing 'prompt'" };
    return;
  }

  try {
    const response = await axios.post(
      "https://<YOUR-RESOURCE>.openai.azure.com/openai/deployments/<DEPLOYMENT>/chat/completions?api-version=2024-03-01-preview",
      {
        messages: [{ role: "user", content: userPrompt }],
        temperature: 0.7
      },
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.AZURE_OPENAI_KEY
        }
      }
    );

    context.res = {
      status: 200,
      body: response.data.choices[0].message.content
    };
  } catch (err) {
    context.res = {
      status: 500,
      body: err.message
    };
  }
};