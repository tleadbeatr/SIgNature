
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
    `SIgNature is a MeASURe SI measurement game in which participants construct a physical signature from physics concepts, symbols, units and mathematical operations.\n\n` +
    `SIgNature:\n<<<\n${signature}\n>>>\n\n` +
    `Interpret the complete SIgNature exactly as supplied. Keep every component, including anything strange or bizarre. Components may only disappear through valid algebraic cancellation; never drop a factor because the remaining expression resembles a familiar quantity. Determine the complete physical quantity represented by the expression and interpret it using sound physics.\n\n` +
    `Then give a positive, playful prediction for the participant's year ahead, inspired by the SIgNature and its physical meaning. The prediction should suggest scientific progress, successful experiments, useful measurements, good data, productive collaborations, discoveries or other satisfying developments in research life. Keep the absurdity playful rather than destructive. Be witty, confident and slightly ridiculous.\n\n` +
    `Return only plain Unicode text in exactly two short paragraphs (physical interpretation and playful prediction), 30–100 words total. No Markdown, LaTeX, headings, tables, emoji or code fences.`;




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

