
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
    `SIgNature is a units and dimensional analysis game. ` +
    `A participant has constructed the following expression:\n` +
    `\n${signature}\n\n` +
    `Determine the dimensions of the complete expression by explicit dimensional analysis. ` +
    `Preserve every dimension that does not algebraically cancel. ` +
    'First calculate the SI base dimensions of every quantity separately. Then perform the multiplication and division algebra explicitly. Check the resulting exponents before interpreting the expression.' +
    'Show the dimensional algebra explicitly and use that algebra as the authoritative result. Check the final dimensions against the algebra before interpreting them.' +
    `Interpret the resulting physical quantity consistently with those dimensions. Do not claim a more specific physical meaning than the dimensions justify. ` +
    `Give a positive, playful prediction for the participant's year in research, measurement, experiments, ` +
    `data, discovery, collaboration or scientific progress for their year ahead inspired by their expression. ` +
    `Be witty, encouraging and slightly absurd.\n\n` +
    `Return exactly two short paragraphs, 30–100 words total. One paragraph for physcial interpretation, the other for prediction. ' +
    'Plain Unicode text only. No headings, Markdown, LaTeX, emoji or code fences.`;

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
                    signature: signature,
                    prompt: prompt,
                    payload: payload,
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




