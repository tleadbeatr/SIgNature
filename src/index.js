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

                const prompt =
                    `Here is my SIgNature: ${signature}\n\n` +
                    `What do you think?`;

                const response = await fetch(
                    "https://api.openai.com/v1/responses",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${env.OPENAI_API_KEY}`
                        },
                        body: JSON.stringify({
                            model: "gpt-5.6-luna",
                            input: prompt
                        })
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    console.error("OpenAI error:", data);

                    return Response.json(
                        {
                             error: `OpenAI error: ${JSON.stringify(data)}`
                        },
                        { status: 500 }
                    );
                }

                return Response.json({
                    result: data.output_text
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
