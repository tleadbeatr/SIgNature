
export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        // SIgNature analysis endpoint
        if (url.pathname === "/analyse" && request.method === "POST") {
            try {
                const body = await request.json();
                const signature = body.signature?.trim();

                if (!signature) {
                    return Response.json(
                        { error: "No SIgNature was supplied." },
                        { status: 400 }
                    );
                }

// the AI prompt 
const prompt =
    `SIgNature is a playful SI unit and dimensional analysis game. A participant has constructed the following physical expression as their SIgNature:\n\n` +
    `<<<\n${signature}\n>>>\n\n` +
    `Interpret the complete physical expression represented by this submission. You may simplify units algebraically to determine its dimensions and physical meaning, but account for every quantity and factor present in the expression. Do not discard a unit or quantity merely because the remaining expression resembles a familiar physical quantity. If the result is unusual, take the unusual result seriously and explain it rather than forcing it into a familiar interpretation.\n\n` +
    `Then give a positive, playful prediction for the participant's year ahead, inspired by their SIgNature and its physical meaning. Make it about research, measurement, experiments, data, discovery, collaboration or scientific progress. Be witty, encouraging and slightly absurd.\n\n` +
    `Return exactly two short paragraphs, 30–100 words total. Plain Unicode text only. No headings, Markdown, LaTeX, emoji or code fences.`;






                const response = await fetch(
                    "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${env.GEMINI_API_KEY}`
                        },
                        body: JSON.stringify({
                            model: "gemini-3.5-flash-lite",
                            messages: [
                                {
                                    role: "user",
                                    content: prompt
                                }
                            ]
                        })
                    }
                );

                const data = await response.json();

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
                    result: data.choices?.[0]?.message?.content
                        || "Gemini returned no text."
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

