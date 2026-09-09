
/*
 * MeASURe SIgNature
 * Measurement Theatre
 *
 * The theatre runs independently of the AI request.
 *
 * Usage:
 *
 *   const theatre = runMeasurementTheatre({
 *       signature: "K s^-1",
 *       element: document.getElementById("result")
 *   });
 *
 *   // When the AI response arrives:
 *   theatre.complete();
 *
 * The theatre will:
 *   1. Run the fixed measurement opening.
 *   2. Escalate through increasingly questionable measurement procedures.
 *   3. Continue indefinitely in the deranged phase until complete() is called.
 *   4. Run the fixed closing sequence.
 *
 * The theatre does NOT make network requests.
 */


/* ============================================================
   CONFIGURATION
   ============================================================ */

const MEASUREMENT_THEATRE_CONFIG = {

    // Normal message interval.
    // A little jitter stops it feeling like a mechanical slideshow.
    intervalMin: 800,
    intervalMax: 1200,

    // How long each deliberate phase lasts.
    respectableMessages: 4,
    questionableMessages: 4,
    bureaucraticMessages: 4,

    // Safety timeout. The theatre will not run forever.
    // This is deliberately generous because slow AI responses are part
    // of the joke.
    maximumDuration: 90000
};


/* ============================================================
   MESSAGE LIBRARY
   ============================================================ */

const MEASUREMENT_THEATRE = {

    /*
     * These always happen, in this order.
     */
    opening: [
        "MeASURe-ment submitted.",
        "Parsing SIgNature.",
        "Identifying units.",
        "Querying metrological authority."
    ],


    /*
     * Initially everything sounds completely legitimate.
     */
    respectable: [

        "Computing dimensional consistency.",

        "Checking unit compatibility.",

        "Evaluating dimensional structure.",

        "Assessing physical plausibility.",

        "Propagating uncertainties.",

        "Evaluating systematic effects.",

        "Applying calibration coefficients.",

        "Checking significant figures.",

        "Assessing measurement resolution.",

        "Establishing traceability.",

        "Comparing against reference standards.",

        "Consulting primary standards.",

        "Consulting secondary standards.",

        "Checking instrument response.",

        "Evaluating measurement sensitivity.",

        "Assessing reproducibility.",

        "Assessing repeatability.",

        "Verifying calibration history.",

        "Reviewing uncertainty budget.",

        "Performing dimensional analysis.",

        "Checking SI coherence.",

        "Evaluating derived quantities.",

        "Checking for systematic bias.",

        "Estimating confidence in measurement."
    ],


    /*
     * Things are still technically plausible, but something is
     * beginning to go wrong.
     */
    questionable: [

        "Applying correction factors.",

        "Correcting correction factors.",

        "Calibrating the calibration.",

        "Measuring the measurement.",

        "Normalising the normalisation.",

        "Propagating propagated uncertainties.",

        "Checking the uncertainty of the uncertainty.",

        "Resolving unit ambiguity.",

        "Resolving ambiguity in the resolution.",

        "Performing second-order dimensional analysis.",

        "Performing additional dimensional analysis.",

        "Cross-checking the dimensional cross-check.",

        "Reassessing the preliminary assessment.",

        "Verifying the verification procedure.",

        "Validating the validation.",

        "Checking whether the correction requires correction.",

        "Estimating residual residuals.",

        "Investigating small discrepancies.",

        "Investigating discrepancies in the discrepancy analysis.",

        "Repeating measurement for reproducibility.",

        "Repeating reproducibility assessment.",

        "Comparing independently derived reference quantities.",

        "Comparing the comparison with the reference.",

        "Performing an independent independent check.",

        "Checking for hidden units.",

        "Searching for unreported prefixes.",

        "Evaluating possible dimensional aliases.",

        "Checking whether the SI is still coherent.",

        "Reviewing the interpretation of the interpretation."
    ],


    /*
     * Now the measurement has become a committee.
     */
    bureaucratic: [

        "Establishing formal metrological traceability.",

        "Consulting secondary reference standards.",

        "Consulting tertiary reference standards.",

        "Reviewing reference standard documentation.",

        "Reviewing the documentation of the documentation.",

        "Requesting independent verification.",

        "Requesting independent verification independently.",

        "Escalating to senior metrological review.",

        "Consulting a more senior metrologist.",

        "Requesting a second opinion from the first opinion.",

        "Initiating inter-laboratory comparison.",

        "Initiating inter-laboratory comparison of the comparison.",

        "Checking accreditation status.",

        "Checking the accreditation of the accreditation.",

        "Assessing compliance with applicable standards.",

        "Assessing compliance with the compliance assessment.",

        "Reviewing measurement governance.",

        "Reviewing measurement governance documentation.",

        "Verifying instrument traceability documentation.",

        "Verifying the traceability of the documentation.",

        "Preparing a preliminary uncertainty statement.",

        "Reviewing the preliminary uncertainty statement.",

        "Requesting clarification from the uncertainty budget.",

        "Awaiting clarification from the uncertainty budget.",

        "Reconciling reference standards.",

        "Reconciling conflicting reference standards.",

        "Establishing which reference standard is most referenced.",

        "Checking whether the reference standard references itself.",

        "Performing administrative dimensional analysis.",

        "Completing form MS-17B.",

        "Checking whether form MS-17B requires form MS-17C.",

        "Form MS-17C required.",

        "Completing form MS-17C.",

        "Checking whether form MS-17C requires approval.",

        "Approval required.",

        "Requesting approval.",

        "Approval pending.",

        "Approval conditionally granted.",

        "Conditionally verifying conditional approval.",

        "Escalating conditional verification.",

        "Measurement governance committee notified.",

        "Committee has requested more measurements.",

        "Committee has requested fewer uncertainties.",

        "Committee has requested a clearer uncertainty budget.",

        "Uncertainty budget remains unconvinced."
    ],


    /*
     * Once we get here, all pretence of normality is gone.
     *
     * These are deliberately broad enough that we can keep adding
     * increasingly ridiculous material without touching the engine.
     */
    deranged: [

        "Measuring the measurement of the measurement.",

        "Checking for hidden kilograms.",

        "Searching for undocumented prefixes.",

        "Detecting suspicious SI behaviour.",

        "Suspicious SI behaviour confirmed.",

        "Investigating anomalous quantities.",

        "Anomaly confirmed.",

        "Measuring anomaly.",

        "Anomaly measurement inconclusive.",

        "Increasing anomaly measurement budget.",

        "Anomaly measurement budget exceeded.",

        "Proceeding anyway.",

        "Consulting the kilogram.",

        "Consulting the new kilogram.",

        "Comparing against the historical kilogram.",

        "Historical unit detected.",

        "Historical unit has been quarantined.",

        "Checking whether kilograms have become sentient.",

        "No evidence of sentience detected.",

        "Continuing measurement.",

        "Searching for a missing mole.",

        "Mole located.",

        "Mole has no comment.",

        "Checking Planck's constant.",

        "Checking Planck's constant again.",

        "Checking whether Planck's constant has changed.",

        "Planck's constant remains suspiciously constant.",

        "Consulting an independent Planck constant.",

        "Independent Planck constant unavailable.",

        "Attempting to manufacture one.",

        "Manufacturing Planck constant not authorised.",

        "Returning to SI analysis.",

        "Performing emergency dimensional analysis.",

        "Emergency dimensional analysis complete.",

        "Emergency dimensional analysis inconclusive.",

        "Performing non-emergency dimensional analysis.",

        "Non-emergency dimensional analysis also inconclusive.",

        "Increasing dimensional analysis.",

        "Dimensional analysis now excessive.",

        "Reducing dimensional analysis.",

        "Dimensional analysis reduction successful.",

        "Checking whether the result has dimensions.",

        "Result has dimensions.",

        "Dimensions appear to be multiplying.",

        "Attempting dimensional containment.",

        "Dimensional containment holding.",

        "Dimensional containment failing.",

        "Applying dimensional duct tape.",

        "Dimensional containment restored.",

        "Consulting the International Bureau of Extremely Specific Units.",

        "International Bureau unavailable.",

        "Leaving a message.",

        "Message has been received by an automated metrologist.",

        "Automated metrologist has requested a measurement.",

        "Measurement already in progress.",

        "Automated metrologist appears confused.",

        "Human metrologist has been notified.",

        "Human metrologist has also become confused.",

        "Consulting a physicist.",

        "Physicist recommends measuring it.",

        "Measurement already in progress.",

        "Physicist recommends measuring it again.",

        "Repeat measurement initiated.",

        "Repeat measurement differs from first measurement.",

        "Difference deemed statistically insignificant.",

        "Difference deemed philosophically significant.",

        "Philosophical significance outside calibration scope.",

        "Returning to quantitative analysis.",

        "Quantitative analysis has become qualitative.",

        "Qualitative analysis has become enthusiastic.",

        "Reducing enthusiasm.",

        "Checking significant figures.",

        "Significant figures appear to be multiplying.",

        "Removing unnecessary significant figures.",

        "Unnecessary significant figures resisting removal.",

        "Escalating significant figure removal.",

        "Significant figures successfully removed.",

        "Result now contains no significant figures.",

        "Adding one significant figure for safety.",

        "Checking uncertainty.",

        "Uncertainty found.",

        "Uncertainty appears uncertain.",

        "Quantifying uncertainty.",

        "Uncertainty has requested anonymity.",

        "Respecting uncertainty's privacy.",

        "Estimating uncertainty anyway.",

        "Uncertainty estimate itself uncertain.",

        "Adding uncertainty to uncertainty.",

        "Uncertainty budget exceeded.",

        "Increasing uncertainty budget.",

        "Budget increase approved.",

        "Budget increase requires uncertainty assessment.",

        "Uncertainty assessment underway.",

        "Uncertainty assessment uncertain.",

        "Returning to measurement.",

        "Measurement authority escalation initiated.",

        "International level reached.",

        "International level exceeded.",

        "Attempting interplanetary metrological consultation.",

        "Interplanetary metrological consultation unavailable.",

        "Checking local standards instead.",

        "Local standards appear adequate.",

        "Local standards have declined to comment.",

        "Checking reference material.",

        "Reference material has been referenced.",

        "Reference confirmed.",

        "Reference reference confirmed.",

        "Reference reference requires verification.",

        "Verifying reference reference.",

        "Reference reference verified.",

        "This is getting unnecessarily complicated.",

        "Complexity assessment initiated.",

        "Complexity exceeds recommended limits.",

        "Recommended limits being reviewed.",

        "Recommended limits require approval.",

        "Approval pending.",

        "Proceeding without approval.",

        "Measurement proceeding within acceptable levels of irresponsibility.",

        "Final correction identified.",

        "Applying final correction.",

        "Correcting final correction.",

        "Correcting correction to final correction.",

        "Final correction now considered provisional.",

        "Making provisional correction less provisional.",

        "Provisionality reduced.",

        "Checking whether this is still science.",

        "Science confirmed.",

        "Checking again.",

        "Science remains plausible.",

        "Probably.",

        "Continuing."
    ],


    /*
     * These happen only once the AI response is ready and the theatre
     * is allowed to close.
     */
    closing: [

        "Measurement analysed.",

        "Results may have relevance.",

        "Metrological significance cannot be excluded.",

        "Interpretation follows."
    ],


    /*
     * Used only if the ultimate safety timeout expires.
     */
    timeout: [

        "Measurement authority has failed to respond.",

        "Metrological patience threshold exceeded.",

        "Result is therefore probably correct."
    ]
};


/* ============================================================
   UTILITY FUNCTIONS
   ============================================================ */

function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


function chooseRandom(array, previous = null) {

    if (!array.length) {
        return "";
    }

    if (array.length === 1) {
        return array[0];
    }

    let choice;

    do {
        choice = array[Math.floor(Math.random() * array.length)];
    } while (choice === previous);

    return choice;
}


/*
 * Return the next item from a pool without immediately repeating
 * anything, and without simply hammering the same few entries.
 *
 * We shuffle the pool and consume it. When exhausted, reshuffle.
 */
function createMessageQueue(messages) {

    let queue = [];
    let previous = null;

    function refill() {

        queue = [...messages];

        // Fisher-Yates shuffle
        for (let i = queue.length - 1; i > 0; i--) {

            const j = Math.floor(Math.random() * (i + 1));

            [queue[i], queue[j]] = [queue[j], queue[i]];
        }

        // Avoid repeating the final item of the previous queue
        // as the first item of the next queue.
        if (queue.length > 1 && queue[0] === previous) {
            [queue[0], queue[1]] = [queue[1], queue[0]];
        }
    }

    return {

        next() {

            if (queue.length === 0) {
                refill();
            }

            const message = queue.shift();
            previous = message;

            return message;
        }
    };
}


/* ============================================================
   THEATRE ENGINE
   ============================================================ */

function runMeasurementTheatre(options = {}) {

    const {

        element,

        signature = "",

        config = MEASUREMENT_THEATRE_CONFIG

    } = options;


    if (!element) {
        throw new Error(
            "Measurement Theatre requires an output element."
        );
    }


    let completed = false;
    let timedOut = false;
    let startedAt = Date.now();

    let completionResolve;

    const completionPromise = new Promise(resolve => {
        completionResolve = resolve;
    });


    /*
     * Display a message.
     */
    function show(message) {

        if (!completed && !timedOut) {
            element.textContent = message;
        }
    }


    /*
     * Wait, but allow completion to interrupt the wait.
     */
    async function waitForNextMessage() {

        const duration = randomBetween(
            config.intervalMin,
            config.intervalMax
        );

        await Promise.race([

            sleep(duration),

            completionPromise

        ]);
    }


    /*
     * Run a finite collection of messages.
     */
    async function runStage(messages, count = messages.length) {

        const queue = createMessageQueue(messages);

        for (let i = 0; i < count; i++) {

            if (completed || timedOut) {
                return;
            }

            show(queue.next());

            await waitForNextMessage();
        }
    }


    /*
     * The infinite deranged loop.
     *
     * Once all the planned stages are complete, this keeps going
     * until the AI response tells us it is time to stop.
     */
    async function runDerangedLoop() {

        const queue = createMessageQueue(
            MEASUREMENT_THEATRE.deranged
        );

        while (!completed && !timedOut) {

            show(queue.next());

            await waitForNextMessage();
        }
    }


    /*
     * Fixed closing sequence.
     */
    async function runClosing() {

        for (const message of MEASUREMENT_THEATRE.closing) {

            show(message);

            await sleep(700);
        }
    }


    /*
     * Safety timeout.
     *
     * This does not normally matter, but prevents a network failure
     * or programming error from leaving the theatre alive forever.
     */
    const timeoutTimer = setTimeout(() => {

        if (!completed) {
            timedOut = true;
            completionResolve();
        }

    }, config.maximumDuration);


    /*
     * The main theatre.
     */
    async function run() {

        /*
         * OPENING
         */

        for (const message of MEASUREMENT_THEATRE.opening) {

            if (completed || timedOut) {
                break;
            }

            show(message);

            await sleep(850);
        }


        /*
         * Make the submitted expression visible.
         *
         * This is deliberately inserted into the otherwise fixed
         * opening because it makes the process feel connected to
         * what the user actually submitted.
         */

        if (!completed && !timedOut && signature) {

            show(`SIgNature received: ${signature}`);

            await sleep(900);
        }


        /*
         * RESPECTABLE
         */

        if (!completed && !timedOut) {

            await runStage(
                MEASUREMENT_THEATRE.respectable,
                config.respectableMessages
            );
        }


        /*
         * QUESTIONABLE
         */

        if (!completed && !timedOut) {

            await runStage(
                MEASUREMENT_THEATRE.questionable,
                config.questionableMessages
            );
        }


        /*
         * BUREAUCRATIC
         */

        if (!completed && !timedOut) {

            await runStage(
                MEASUREMENT_THEATRE.bureaucratic,
                config.bureaucraticMessages
            );
        }


        /*
         * DERANGED
         *
         * This continues until complete() is called.
         */

        if (!completed && !timedOut) {
            await runDerangedLoop();
        }


        /*
         * If we timed out, show the timeout ending.
         */

        if (timedOut) {

            for (const message of MEASUREMENT_THEATRE.timeout) {

                show(message);

                await sleep(800);
            }

            clearTimeout(timeoutTimer);

            return;
        }


        /*
         * AI response is ready.
         *
         * Now we close the measurement formally.
         */

        await runClosing();

        clearTimeout(timeoutTimer);
    }


    /*
     * Start immediately, but return a controller so the caller
     * can tell us when the AI response arrives.
     */
    const theatrePromise = run();


    return {

        /*
         * Call this when the AI response arrives.
         */
        complete() {

            if (completed || timedOut) {
                return;
            }

            completed = true;
            completionResolve();
        },


        /*
         * Useful if the caller wants to know when the theatrical
         * sequence has actually finished.
         */
        promise: theatrePromise,


        /*
         * Useful for debugging.
         */
        isComplete() {
            return completed;
        }
    };
}


/* ============================================================
   GLOBAL EXPORT
   ============================================================ */

/*
 * Because this is a normal browser script rather than a module,
 * expose the public API explicitly.
 */
window.runMeasurementTheatre = runMeasurementTheatre;
```

### A couple of deliberate choices here

**1. The AI request and theatre are independent.**

The eventual `index.html` will do approximately:

```javascript
const theatre = runMeasurementTheatre({
    signature,
    element: result
});

const response = await fetch("/analyse", ...);

theatre.complete();

await theatre.promise;

// Now display data.result


