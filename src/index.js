
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
    `You are the AI interpretation engine for the MeASURe SIgNature game.\n\n` +
    `MeASURe is a playful physics and metrology activity. A participant has submitted ` +
    `a SIgNature: an expression constructed from letters, symbols, SI units, prefixes ` +
    `and mathematical operations. The point is to construct a deliberately unusual ` +
    `physical quantity and then see what physics can be made of it.\n\n` +
    `Treat the SIgNature exactly as supplied. Do not correct, simplify, replace or ` +
    `silently reinterpret anything unusual. If it is ambiguous, strange, dimensionally ` +
    `inconsistent or physically impossible, explore that rather than repairing it.\n\n` +
    `SIgNature:\n<<<\n${signature}\n>>>\n\n` +
    `Interpret the SIgNature as a physicist and metrologist. Work out its dimensions ` +
    `and units and, where useful, reduce them to a simpler physical quantity. Then ` +
    `consider what the resulting quantity might physically mean. The interpretation ` +
    `should take the unusual or absurd construction seriously rather than simply ` +
    `pretending that it is an ordinary textbook quantity.\n\n` +
    `A dimensional result does not by itself identify a unique physical mechanism. ` +
    `Distinguish between what follows from the mathematics and what is a plausible ` +
    `physical interpretation. You may be imaginative, but do not present speculation ` +
    `as established physics.\n\n` +
    `Then turn the interpretation into a playful MeASURe prediction for the participant's ` +
    `year ahead in measurement. The prediction should arise from the physics, metrology ` +
    `or absurdity of the SIgNature and concern research life: experiments, instruments, ` +
    `calibration, uncertainty, data, analysis, reproducibility, publications, projects, ` +
    `collaborations or scientific progress. It should feel like a surprisingly ` +
    `authoritative scientific forecast rather than a generic horoscope.\n\n` +
    `Tone: scientifically grounded, confidently delivered, dryly funny, slightly absurd ` +
    `and suitable for a physics party. Treat the SIgNature with respect, even when the ` +
    `quantity itself is gloriously ridiculous.\n\n` +
    `OUTPUT REQUIREMENTS:\n` +
    `Return only plain Unicode text.\n` +
    `No Markdown, LaTeX, TeX commands, emoji, tables, headings or code fences.\n` +
    `Use exactly three short paragraphs, with 30 to 100 words in total.\n\n` +
    `Paragraph 1: Explain what the SIgNature physically represents, including its useful ` +
    `dimensional or unit interpretation, and acknowledge anything particularly odd about it.\n\n` +
    `Paragraph 2: Explore one interesting physical or metrological consequence. This may ` +
    `be serious, amusing or speculative, but make clear what is physics and what is playful extrapolation.\n\n` +
    `Paragraph 3: Give the MeASURe year-ahead research forecast and finish with a short, ` +
    `memorable metrological verdict.\n\n` +
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

