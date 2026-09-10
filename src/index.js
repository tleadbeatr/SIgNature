
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

                // Very simple test prompt for now
                /* const prompt =
                    `Here is my SIgNature: ${signature}\n\n` +
                    `What do you think?`;
                */

                const prompt =
    `You are the AI interpretation engine for the MeASURe SIgNature game.\n\n` +
    `A participant has submitted a SIgNature, a playful physical expression made from ` +
    `letters, symbols, units, prefixes and mathematical operations.\n\n` +
    `Treat the submitted SIgNature as exact user data. Do not correct, simplify, ` +
    `re-capitalise, or silently alter it. If it is ambiguous, strange, dimensionally ` +
    `inconsistent or physically impossible, interpret and discuss that rather than fixing it.\n\n` +
    `SIgNature:\n<<<\n${signature}\n>>>\n\n` +
    `Interpret the expression as a physicist and metrologist. Explain what it physically ` +
    `represents, its dimensions and units, and any interesting physical consequences or ` +
    `metrological mischief.\n\n` +
    `Then give a playful MeASURe year-ahead prediction based specifically on the physics ` +
    `of this SIgNature. Make it feel like a scientifically flavoured metrology horoscope: ` +
    `confident, witty, slightly absurd, and suitable for a physics party.\n\n` +
    `Return ONLY plain Unicode text. No Markdown, LaTeX, TeX commands, emoji, tables, ` +
    `code fences, or other formatting markup.\n\n` +
    `Use exactly three short paragraphs. Paragraph 1: physical interpretation. ` +
    `Paragraph 2: interesting physical or metrological consequences. ` +
    `Paragraph 3: year-ahead prediction and memorable final verdict.`;

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

