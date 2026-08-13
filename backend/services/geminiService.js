
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

module.exports = { generateTripPlan };