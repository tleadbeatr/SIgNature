
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
    `SIgNature is a MeASURe SI measurement game in which participants construct a proposed physical signature from physics concepts, symbols, units and mathematical operations.\n\n` +
    `SIgNature:\n<<<\n${signature}\n>>>\n\n` +
    `Interpret the physical meaning of the full SIgNature exactly as supplied. Do not correct, simplify, replace, omit or reinterpret any component, even if the result is bizarre, ambiguous or physically unusual. Take the complete expression seriously and find the most interesting scientifically defensible interpretation of it.\n\n` +
    `The interpretation should be scientifically robust: distinguish established physics from reasonable inference and playful speculation, without allowing the science to become nonsense.\n\n` +
    `Then give a positive, playful MeASURe prediction for the year ahead, inspired by the physics or peculiarities of the SIgNature. Make it specific to research, measurement, experiments, instruments, data, uncertainty, discovery or scientific life, rather than a generic horoscope. Be witty, confident and slightly absurd.\n\n` +
    `Return only plain Unicode text in exactly three short paragraphs, 30–100 words total. Do not use Markdown, LaTeX, headings, tables, emoji or code fences.`;


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

