
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
    `SIgNature is a MeASURe SI measurement game in which participants construct a proposed physical quantity from physics concepts, symbols, units and mathematical operations.\n\n` +
    `SIgNature:\n<<<\n${signature}\n>>>\n\n` +
    'Interpret the complete expression as a physical measurement. Work out what the units reduce to while keeping all terms, and use that to identify what kind of physical quantity the participant has constructed. Keep all factors in the expression: do not discard a unit or rename the quantity based on only part of it. If the resulting quantity has a familiar physical meaning, recognise it; if it is an unusual or constructed quantity, explain that rather than forcing it into a familiar category.\n\n' +
    `Give a scientifically sound interpretation of what this quantity could represent. Be imaginative where appropriate, but do not invent physics merely to make the expression fit a familiar phenomenon.\n\n` +
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

