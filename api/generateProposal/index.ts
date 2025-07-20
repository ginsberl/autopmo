import axios from "axios";

const httpTrigger = async function (context: Context, req: HttpRequest): Promise<void> {
  let userPrompt: string | undefined;

  if (req.body && typeof req.body === "object" && "prompt" in req.body) {
    userPrompt = (req.body as any).prompt;
  } else if (typeof req.body === "string") {
    try {
      const parsed = JSON.parse(req.body);
      userPrompt = parsed.prompt;
    } catch {
      userPrompt = undefined;
    }
  }

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
          "api-key": process.env.AZURE_OPENAI_KEY!
        }
      }
    );

    context.res = {
      status: 200,
      body: response.data.choices[0].message.content
    };
  } catch (error: any) {
    context.res = {
      status: 500,
      body: error.message
    };
  }
};

export default httpTrigger;