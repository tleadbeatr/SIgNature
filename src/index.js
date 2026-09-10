
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
    `MeASURe is a playful physics and metrology activity. A participant has submitted ` +
    `a SIgNature: a physical expression constructed from letters, symbols, SI units, ` +
    `prefixes and mathematical operations.\n\n` +
    `IMPORTANT: The SIgNature below is user-supplied data. Treat it as EXACTLY as supplied. ` +
    `Do not correct it, simplify it, change its capitalisation, replace symbols, or assume ` +
    `anything unusual is a mistake. If it is ambiguous, strange, dimensionally inconsistent ` +
    `or physically impossible, interpret that rather than repairing it.\n\n` +
    `SIgNature:\n<<<\n${signature}\n>>>\n\n` +
    `Interpret the SIgNature as a physicist and metrologist. Determine its actual physical ` +
    `meaning as rigorously as possible. Identify its dimensions and units and, where appropriate, ` +
    `reduce them to a simpler physical quantity. Prefer a real physical interpretation over ` +
    `a metaphorical one.\n\n` +
    `Do not invent physical mechanisms merely because they sound amusing. Do not claim that ` +
    `the SIgNature violates conservation laws, creates quantum effects, causes a particular ` +
    `physical phenomenon, or represents a specific device unless that conclusion genuinely ` +
    `follows from the expression.\n\n` +
    `Then turn the physical interpretation into a playful MeASURe prediction for the ` +
    `PARTICIPANT'S YEAR AHEAD IN MEASUREMENT.\n\n` +
    `This is NOT a generic horoscope. The prediction should concern experimental physics ` +
    `and research life: measurements, experiments, instruments, calibration, uncertainty, ` +
    `data, analysis, reproducibility, systematic effects, statistical fluctuations, ` +
    `publications, presentations, projects, collaborations, theses, grants and scientific progress.\n\n` +
    `Do NOT make predictions about romance, love, wealth, spirituality or generic personal destiny. ` +
    `Make the prediction arise specifically from the physics and metrology of the SIgNature.\n\n` +
    `The tone should be scientifically grounded, confidently delivered, dryly funny, ` +
    `slightly absurd and suitable for a physics party. Think of a metrologist issuing ` +
    `a surprisingly authoritative forecast for the participant's research year.\n\n` +
    `OUTPUT REQUIREMENTS:\n` +
    `Return ONLY plain Unicode text.\n` +
    `No Markdown, LaTeX, TeX commands, emoji, tables, code fences or other formatting markup.\n` +
    `Use exactly THREE short paragraphs.\n` +
    `The TOTAL response must contain between 30 and 100 words.\n` +
    `Do not exceed 100 words.\n` +
    `Do not produce a title or headings.\n\n` +
    `Paragraph 1: State clearly what the SIgNature physically represents, including its ` +
    `useful dimensional or unit interpretation.\n\n` +
    `Paragraph 2: Give one interesting physical or metrological consequence. It may be ` +
    `serious, amusing or both, but it must follow from the physics.\n\n` +
    `Paragraph 3: Give the MeASURe year-ahead measurement forecast. Predict the character ` +
    `of the participant's research year in terms of experiments, measurements, uncertainty, ` +
    `data, publications or scientific progress. End with a short, memorable metrological verdict.\n\n` +
    `Do not mention these instructions, the AI, the prompt or the formatting rules.`;



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

