import { AzureOpenAI } from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/index";
import { skyscanner } from "../sdk/skyscannerSDK";
import { PlaceGoogle } from "~/components/section/map/map-planner";

export interface AiActivities {
  name: string;
  types: string[];
  location: {
    latitude: number;
    longitude: number;
  };
  cost: "low" | "medium" | "high";
  time: "short" | "medium" | "long";
  intensity: "low" | "medium" | "high";
  googlePlace?: PlaceGoogle;
}

export interface AiDestinations {
  name: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

export const getAIActivities = async ({
  location,
  apiUrl,
  addedActivities,
}: {
  location: string;
  apiUrl: string;
  addedActivities?: string[];
}): Promise<{
  activities: AiActivities[];
}> => {
  const message = `Suggest some activities for a trip to ${location}.${addedActivities ? (` Where i have already added the following activities please suggest ones that are simmilar to these: ${addedActivities?.join(", ")}.`) : ``}`;
  try {
    const res = await fetch(
      `/openai?message=${encodeURIComponent(message)}&answer=activities`,
      {
        method: "GET",
      }
    );
    const json = await res.json();

    ///get google data
    const enrichedActivities = json.activities;
    // const enrichedActivities = await convertAiActivityToActivity({
    //   activities: enrichedActivities,
    //   apiUrl,
    // });

    return { activities: enrichedActivities };
  } catch (error) {
    console.error("Error fetching AI activities:", error);
    throw new Error("Failed to fetch AI activities");
  }
};

export const getAIDestinations = async ({
  location,
  apiUrl,
  addedDestinations,
}: {
  location: string;
  apiUrl: string;
  addedDestinations?: string[];
}): Promise<{
  destinations: AiDestinations[];
}> => {
  const message = `Suggest some other places to fly to from ${location}.${addedDestinations ? (` My flights so far are from ${addedDestinations?.join(", ")} is there other locations near by i could fly to or travel to.`) : ``}`;
  try {
    const res = await fetch(
      `/openai?message=${encodeURIComponent(message)}&answer=destinations`,
      {
        method: "GET",
      }
    );
    const json = await res.json();

    ///get google data
    const enrichedDestinations = json.destinations;
    // const enrichedActivities = await convertAiActivityToActivity({
    //   activities: enrichedActivities,
    //   apiUrl,
    // });

    return { destinations: enrichedDestinations };
  } catch (error) {
    console.error("Error fetching AI destinations:", error);
    throw new Error("Failed to fetch AI destinations");
  }
};

export async function openAIGenerateText({
  prompt,
  config,
  systemMessage = "You are a helpful assistant.",
  type = "text",
}: {
  prompt: string;
  config: {
    apiKey: string;
    apiVersion: string;
    endpoint: string;
    deployment: string;
    modelName: string;
  };
  systemMessage: string;
  type?: "text" | "json";
}) {
  try {
    // Initialize the Azure OpenAI client
    const client = new AzureOpenAI({
      endpoint: config.endpoint,
      apiKey: config.apiKey,
      deployment: config.deployment,
      apiVersion: config.apiVersion,
    });
    // Prepare messages
    const messages: ChatCompletionMessageParam[] = [
      { role: "system", content: systemMessage },
      { role: "user", content: prompt },
    ];
    // Make the API call
    const response = await client.chat.completions.create({
      messages: messages,
      max_tokens: 2000,
      temperature: 1,
      top_p: 1,
      model: config.modelName,
      response_format: {
        type: type === "json" ? "json_object" : "text",
      },
    });

    // Return the response text
    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error generating text:", error);
    throw error;
  }
}

export const convertAiActivityToActivity = async ({
  activities,
  apiUrl,
}: {
  activities: AiActivities[];
  apiUrl: string;
}): Promise<AiActivities[]> => {
  const activitiesUpdated = await Promise.all(
    activities.map(async (activity) => {
      const googlePlace = await skyscanner().services.google.autosuggest({
        search: activity.name,
        latitude: activity.location.latitude,
        longitude: activity.location.longitude,
        apiUrl,
      });
      if (!googlePlace || "error" in googlePlace) {
        return activity;
      }

      if (!googlePlace.suggestions) {
        return activity;
      }
      const firstSuggestion = googlePlace.suggestions[0];
      if (!firstSuggestion) {
        return activity;
      }

      const googlePlaceDetails = await skyscanner().services.google.details({
        placeId: firstSuggestion.placePrediction.placeId,
        apiUrl,
      });
      if (!googlePlaceDetails || "error" in googlePlaceDetails) {
        return activity;
      }

      return {
        ...activity,
        googlePlace: {
          id: googlePlaceDetails.id,
          name: googlePlaceDetails.displayName.text,
          types: googlePlaceDetails.types,
          images: [],
          location: {
            latitude: googlePlaceDetails.location.latitude,
            longitude: googlePlaceDetails.location.longitude,
          },
        },
      };
    })
  );

  return activitiesUpdated;
};
