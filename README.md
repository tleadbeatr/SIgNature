# SIgNature

MeASURe SIgNature experiment.


SIgNature — MeASURe birthday AI

This is the web app used for the MeASURe SIgNature experiment.

What it does:
User enters a SIgNature → Worker sends it to AI → interpretation + prediction returned.

GitHub: this repository
Cloudflare Worker: signature.tleadbeatr.workers.dev

To update the AI model: edit src/index.js, find the model: line, and replace it with the current supported model.

To update the SIgNature instructions: edit the prompt in src/index.js.

To update the webpage: edit public/index.html.

API key: stored as a Cloudflare Runtime Secret. Never put it in GitHub.

If the AI provider changes: modify the API request in src/index.js; the webpage does not need to change.

Deployment: push to GitHub; Cloudflare Workers Builds deploys automatically.
