
export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        // SIgNature analysis endpoint
        if (url.pathname === "/analyse" && request.method === "POST") {
            try {
                const body = await request.json();
                const signature = body.signature?.trim();

                console.log("SIGNATURE RAW:", JSON.stringify(signature));

                if (!signature) {
                    return Response.json(
                        { error: "No SIgNature was supplied." },
                        { status: 400 }
                    );
                }

                // The AI prompt
                const prompt =
                    `SIgNature is a playful unit and dimensional analysis game. ` +
                    `A participant has constructed the following expression as their SIgNature:\n\n` +
                    `<<<\n${signature}\n>>>\n\n` +
                    `Treat the SIgNature as exact and immutable. Explain what physical quantity the exact SIgNature represents. ` +
                    `You may reduce the units by dimensional analysis.\n\n` +
                    `Give a positive, playful prediction for the participant's year in research, measurement, experiments, ` +
                    `data, discovery, collaboration or scientific progress for their year ahead inspired by their SIgNature. ` +
                    `Be witty, encouraging and slightly absurd.\n\n` +
                    `Return exactly two short paragraphs, 30–100 words total. Plain Unicode text only. ` +
                    `No headings, Markdown, LaTeX, emoji or code fences.`;

                console.log("PROMPT:", JSON.stringify(prompt));
                console.log("PROMPT LENGTH:", prompt.length);

                // Build the exact payload sent to Gemini
                const payload = {
                    model: "gemini-3.5-flash-lite",
                    messages: [
                        {
                            role: "user",
                            content: prompt
                        }
                    ]
                };

                console.log(
                    "GEMINI PAYLOAD:",
                    JSON.stringify(payload, null, 2)
                );

                const response = await fetch(
                    "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${env.GEMINI_API_KEY}`
                        },
                        body: JSON.stringify(payload)
                    }
                );

                const data = await response.json();

                console.log("GEMINI STATUS:", response.status);
                console.log("GEMINI RESPONSE:", JSON.stringify(data));

                if (!response.ok) {
                    console.error("Gemini error:", data);

                    return Response.json(
                        {
                            error: `Gemini error: ${JSON.stringify(data)}`
                        },
                        { status: 500 }
                    );
                }

                return Response.json({
                    result:
                        data.choices?.[0]?.message?.content ||
                        "Gemini returned no text."
                });

            } catch (error) {
                console.error("Worker error:", error);

                return Response.json(
                    { error: "Something went wrong." },
                    { status: 500 }
                );
            }
        }

        // Everything else is handled by the static assets.
        return env.ASSETS.fetch(request);
    }
};




