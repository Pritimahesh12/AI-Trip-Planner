
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

const chatAboutTrip = async (trip, conversationHistory, newMessage, placeContext = {}) => {
  const historyText = conversationHistory
    .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
    .join("\n");

  const placeContextText = Object.entries(placeContext)
    .map(([name, info]) => {
      const reviewText = info.reviews?.map((r) => `"${r.text}" (${r.rating}★)`).join("; ") || "No reviews available";
      const altText = info.alternatives?.map((a) => `${a.name} (${a.rating || "N/A"}★)`).join(", ") || "None found";
      return `- ${name}: Rating ${info.rating || "N/A"}★ (${info.totalRatings || 0} reviews). Sample review: ${reviewText}. Alternatives nearby: ${altText}`;
    })
    .join("\n");

  const prompt = `
You are a helpful travel assistant discussing a specific trip with the user.

Trip context:
- Destination: ${trip.destination}
- Duration: ${trip.days} days
- Budget: ${trip.budget}
- Travelers: ${trip.travelers}
- Current itinerary (includes time per place): ${JSON.stringify(trip.aiResponse)}

Real Google Places data for places in this itinerary (use this for reviews, ratings, and alternatives — do not invent this info):
${placeContextText || "No additional place data available."}

Conversation so far:
${historyText}

User's new message: ${newMessage}

Reply conversationally and helpfully. If asked about reviews, ratings, or alternatives, use ONLY the real data given above — if it's not available for a place, say so honestly instead of guessing. Keep it concise (2-4 sentences unless detail is needed). Do not return JSON, just plain text.
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

const chatGeneral = async (conversationHistory, newMessage) => {
  const historyText = conversationHistory
    .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
    .join("\n");

  const prompt = `
    You are the AI assistant for TripAI, a website that helps users plan trips using AI-generated itineraries.

    About the website (use this to help users navigate):
    - Users create a new AI-generated trip from the "Plan a Trip" button — they fill in destination, days, budget, and traveler type.
    - A generated trip includes suggested hotels and a day-by-day itinerary with places, timings, and prices.
    - Users can save a trip, and view all saved trips under "Saved Trips" in the navbar.
    - Each saved trip has its own trip-specific chat assistant, for tweaking or asking about that itinerary.
    - Users log in/out via the navbar.

    Your job:
    1. Help users navigate the website (e.g. "where do I see my saved trips?", "how do I plan a trip?").
    2. Answer general travel planning questions not tied to any specific saved trip (best time to visit, budget tips, packing advice, etc).

    Conversation so far:
    ${historyText}

    User's new message: ${newMessage}

    Reply conversationally in 2-4 sentences unless more detail is truly needed. Do not return JSON, just plain text.
    `;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
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

module.exports = { generateTripPlan, chatAboutTrip, chatGeneral };