export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        // The SIgNature analysis endpoint
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

                return Response.json({
                    result:
                        `Your SIgNature is ${signature}.\n\n` +
                        `The MeASURe-ment has been received. ` +
                        `The AI interpretation will appear here shortly.`
                });

            } catch (error) {
                return Response.json(
                    { error: "Invalid request." },
                    { status: 400 }
                );
            }
        }

        // Everything else is handled by the static assets.
        return env.ASSETS.fetch(request);
    }
};

