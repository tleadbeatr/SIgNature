
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
    `Interpret the complete SIgNature exactly as supplied. Keep every component and do not correct, omit or replace anything. Determine the physical quantity represented by the full expression, using dimensional analysis where useful while preserving the complete dimensional result: never replace it with a familiar quantity that has only some of the same dimensions. Interpret what that complete quantity could physically mean.\n\n` +
    `Keep the interpretation scientifically robust, distinguishing established physics from reasonable inference or speculation.\n\n` +
    `Give a positive, playful prediction for the year ahead inspired by the SIgNature and its physical meaning. Make it specific to research, measurement, experiments, instruments, data, uncertainty, discovery or scientific life. Be witty, confident and slightly absurd.\n\n` +
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

