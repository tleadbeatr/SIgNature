
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
    `SIgNature is a playful SI unit and dimensional analysis game. A participant has constructed the following physical expression from physics concepts, units and mathematical operations. Their submission may contain working, explanations, names, symbols, dimensions or a mixture of these.\n\n` +
    `Participant's submission:\n<<<\n${signature}\n>>>\n\n` +
    'Identify the participants intended SIgNature and explain what the complete expression represents physically. You may simplify the units to discover its physical dimensions and meaning, but every factor in the original expression must remain accounted for. Explain what physical quantity the participant has constructed, including any interesting or surprising consequences of the combination. Do not force it into a familiar category if that does not fit. If the combination is unusual, explain why.\n\n' +
    `Then give a positive, playful prediction for the year ahead, inspired by the SIgNature. Make it about research, measurement, experiments, data, discovery, collaboration or scientific progress. Be witty, encouraging and slightly absurd.\n\n` +
    `Return only plain Unicode text in exactly two short paragraphs, 30–100 words total. No Markdown, LaTeX, headings, tables, emoji or code fences.`;






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

