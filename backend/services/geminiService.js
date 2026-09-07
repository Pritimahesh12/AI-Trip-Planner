
const generateTripPlan = async ({ destination, days, budget, travelers }) => {
  const prompt = `
    You are a travel planning assistant. Generate a detailed travel itinerary.

    Trip details:
    - Destination: ${destination}
    - Duration: ${days} days
    - Budget: ${budget}
    - Travelers: ${travelers}

    Requirements:
    - Suggest EXACTLY 4 hotels matching the budget level.
    - Cover each day of the trip with 3-5 places/activities.

    Return ONLY valid JSON (no markdown, no extra text) in exactly this structure:
    {
      "hotels": [
        { "name": "", "address": "", "priceRange": "", "description": "" }
      ],
      "itinerary": [
        {
          "day": 1,
          "places": [
            { "name": "", "details": "", "ticketPrice": "", "time": "" }
          ]
        }
      ]
    }
`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || "Gemini API request failed");
  }

  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    throw new Error("Gemini returned an empty response");
  }

  const cleanedText = rawText.replace(/```json|```/g, "").trim();

  let parsedResponse;
  try {
    parsedResponse = JSON.parse(cleanedText);
  } catch (err) {
    throw new Error("Failed to parse AI response as JSON");
  }

  return parsedResponse;
};

const chatAboutTrip = async (trip, conversationHistory, newMessage) => {
  const historyText = conversationHistory
    .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
    .join("\n");

  const prompt = `
You are a helpful travel assistant discussing a specific trip with the user.

Trip context:
- Destination: ${trip.destination}
- Duration: ${trip.days} days
- Budget: ${trip.budget}
- Travelers: ${trip.travelers}
- Current itinerary: ${JSON.stringify(trip.aiResponse)}

Conversation so far:
${historyText}

User's new message: ${newMessage}

Reply conversationally and helpfully, as a travel assistant would. Keep it concise (2-4 sentences unless the user asks for detail). Do not return JSON, just plain conversational text.
`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || "Gemini API request failed");
  }

  const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!replyText) {
    throw new Error("Gemini returned an empty response");
  }

  return replyText.trim();
};

module.exports = { generateTripPlan, chatAboutTrip };