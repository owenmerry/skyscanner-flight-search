import type { LoaderFunction } from "@remix-run/node";
import { openAIGenerateText } from "~/helpers/ai/openai";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const message = url.searchParams.get("message");
  const answer = url.searchParams.get("answer");
  let systemMessage = "You are a helpful travel assistant.";

  if (!message) {
    return new Response("Missing message in query parameter", {
      status: 400,
    });
  }

  if (answer && answer === "activities") {
    systemMessage = `You are a helpful travel assistant api and must return with valid JSON array. The answer json array data must be in the following format and you should only return the JSON data without any additional text or explanation:
    export interface Activities {
  name: string;
  types: ('attraction' | 'restaurant' | 'activity' | 'event' | 'shopping' | 'nightlife' | 'outdoor' | 'cultural' | 'adventure' | 'wellness' | 'family' | 'romantic' | 'historical' | 'nature' | 'beach' | 'city' | 'rural' | 'countryside' | 'urban' | 'scenic')[];
    location: {
      latitude: number;
      longitude: number;
    };
    "cost": 'low' | 'medium' | 'high';
    "time": "short" | "medium" | "long";
    "intensity": "low" | "medium" | "high";
  };
  export interface Trip { activities: Activities[]; }
    `;
  }

  if (answer && answer === "destinations") {
    systemMessage = `You are a helpful travel assistant api and must return with valid JSON array. The answer json array data must be in the following format and you should only return the JSON data without any additional text or explanation:
    export interface Destinations {
  name: string;
  description: string;
    location: {
      latitude: number;
      longitude: number;
    };
  };
  export interface Trip { destinations: Destinations[]; }
    `;
  }

  try {
    const openai = await openAIGenerateText({
      prompt: message,
      config: {
        apiKey: process.env.AZURE_OPENAI_API_KEY || "",
        apiVersion: process.env.AZURE_OPENAI_API_VERSION || "",
        endpoint: process.env.AZURE_OPENAI_ENDPOINT || "",
        deployment: process.env.AZURE_OPENAI_DEPLOYMENT || "",
        modelName: process.env.AZURE_OPENAI_MODEL || "",
      },
      systemMessage,
      type: "json",
    });

    return new Response(openai, {
      status: 200,
      headers: {
        "Cache-Control": "public, max-age=600, immutable",
      },
    });
  } catch (error) {
    return new Response("Invalid data", { status: 400 });
  }
};
