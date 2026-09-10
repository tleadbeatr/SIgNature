/*
 * MeASURe SIgNature
 * Measurement Theatre Engine
 *
 * The comedy/message library lives separately in:
 *     measurement-messages.js
 *
 * This file controls timing and state only.
 */

(function () {

    const DEFAULT_CONFIG = {
        intervalMin: 900,
        intervalMax: 1600,

        respectableMessages: 2,
        questionableMessages: 2,
        bureaucraticMessages: 2,

        maximumDuration: 90000
    };


    // ------------------------------------------------------------
    // Utility functions
    // ------------------------------------------------------------

    function randomBetween(min, max) {
        return Math.floor(
            Math.random() * (max - min + 1)
        ) + min;
    }


    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    /*
     * Create a shuffled queue from an array.
     *
     * We shuffle rather than choosing completely at random so that
     * messages don't repeatedly appear in quick succession.
     */
    function createMessageQueue(messages) {

        const queue = [...messages];

        for (let i = queue.length - 1; i > 0; i--) {

            const j = Math.floor(Math.random() * (i + 1));

            [queue[i], queue[j]] =
                [queue[j], queue[i]];
        }

        return {
            index: 0,

            next() {

                if (this.index >= queue.length) {

                    /*
                     * Once the queue is exhausted, reshuffle it.
                     * This allows the deranged stage to continue
                     * indefinitely if the AI takes a long time.
                     */
                    for (let i = queue.length - 1; i > 0; i--) {

                        const j =
                            Math.floor(Math.random() * (i + 1));

                        [queue[i], queue[j]] =
                            [queue[j], queue[i]];
                    }

                    this.index = 0;
                }

                return queue[this.index++];
            }
        };
    }


    // ------------------------------------------------------------
    // Measurement Theatre
    // ------------------------------------------------------------

    function runMeasurementTheatre(options) {

        const element = options.element;
        const signature = options.signature || "";

        const config = {
            ...DEFAULT_CONFIG,
            ...(options.config || {})
        };


        // --------------------------------------------------------
        // State
        // --------------------------------------------------------

        let responseReady = false;
        let timedOut = false;

        const startedAt = Date.now();


        /*
         * This promise resolves only when the COMPLETE theatre
         * sequence has finished.
         *
         * In particular, it does NOT resolve when the AI responds.
         */
        let resolveTheatre;

        const promise = new Promise(resolve => {
            resolveTheatre = resolve;
        });


        // --------------------------------------------------------
        // Output
        // --------------------------------------------------------

        function show(message) {

            /*
             * Append rather than replace.
             *
             * The measurement process is now the visible artefact.
             */
            if (element.textContent.length > 0) {
                element.textContent += "\n";
            }

            element.textContent += message;

            /*
             * Keep the latest activity visible if the log becomes
             * longer than the result box.
             */
            element.scrollTop = element.scrollHeight;
        }


        // --------------------------------------------------------
        // Timing
        // --------------------------------------------------------

        function hasTimedOut() {

            return (
                Date.now() - startedAt >=
                config.maximumDuration
            );
        }


        async function wait() {

            const delay = randomBetween(
                config.intervalMin,
                config.intervalMax
            );

            await sleep(delay);

            if (hasTimedOut()) {
                timedOut = true;
            }
        }


        // --------------------------------------------------------
        // Stages
        // --------------------------------------------------------

        async function runStage(messages, count) {

            const queue = createMessageQueue(messages);

            for (let i = 0; i < count; i++) {

                if (timedOut) {
                    return;
                }

                show(queue.next());

                await wait();
            }
        }


        async function runDerangedLoop() {

            const queue =
                createMessageQueue(
                    window.MEASUREMENT_THEATRE.deranged
                );


            /*
             * This is deliberately controlled by responseReady.
             *
             * If Gemini is still thinking:
             *
             *     deranged
             *     deranged
             *     deranged
             *     ...
             *
             * If Gemini finishes:
             *
             *     stop generating
             *     closing sequence
             */
            while (!responseReady && !timedOut) {

                show(queue.next());

                await wait();
            }
        }


        async function runClosing() {

            /*
             * The closing sequence is deliberately not randomised.
             * It is the ritual ending.
             */
            for (const message of window.MEASUREMENT_THEATRE.closing) {

                show(message);

                await wait();

                if (timedOut) {
                    return;
                }
            }
        }


        async function runTimeout() {

            for (const message of window.MEASUREMENT_THEATRE.timeout) {

                show(message);

                await wait();

                if (timedOut) {
                    return;
                }
            }
        }


        // --------------------------------------------------------
        // Main theatre sequence
        // --------------------------------------------------------

        async function run() {

            /*
             * Opening is fixed and identical every time.
             */
            for (const message of window.MEASUREMENT_THEATRE.opening) {

                show(message);

                await wait();

                if (timedOut) {
                    break;
                }
            }


            if (timedOut) {

                await runTimeout();

                resolveTheatre();

                return;
            }


            /*
             * Put the actual SIgNature into the log.
             */
            show(
                "SIgNature received: " +
                signature
            );

            await wait();


            /*
             * Stage 1: respectable metrology
             */
            await runStage(
                window.MEASUREMENT_THEATRE.respectable,
                config.respectableMessages
            );


            /*
             * Stage 2: things are becoming questionable
             */
            if (!timedOut) {

                await runStage(
                    window.MEASUREMENT_THEATRE.questionable,
                    config.questionableMessages
                );
            }


            /*
             * Stage 3: bureaucracy takes over
             */
            if (!timedOut) {

                await runStage(
                    window.MEASUREMENT_THEATRE.bureaucratic,
                    config.bureaucraticMessages
                );
            }


            /*
             * Stage 4: increasingly questionable science.
             *
             * If the AI has already responded, this exits
             * immediately and we go to the closing sequence.
             *
             * Otherwise it continues indefinitely until the
             * response arrives or the safety timeout fires.
             */
            if (!timedOut) {

                await runDerangedLoop();
            }


            /*
             * AI response arrived.
             *
             * Now we finish the ritual.
             */
            if (responseReady && !timedOut) {

                await runClosing();
            }


            /*
             * Absolute safety net.
             */
            if (timedOut) {

                await runTimeout();
            }


            /*
             * Only NOW is the theatre actually complete.
             */
            resolveTheatre();
        }


        // --------------------------------------------------------
        // Public control
        // --------------------------------------------------------

        /*
         * Called by index.html when the AI response arrives.
         *
         * IMPORTANT:
         * This does NOT stop the theatre.
         *
         * It merely tells the theatre:
         *
         *     "The result is ready."
         *
         * The current theatrical sequence is allowed to finish.
         */
        function complete() {

            responseReady = true;
        }


        function isComplete() {

            return responseReady;
        }


        /*
         * Start immediately.
         */
        run();


        /*
         * Public API.
         */
        return {
            complete,
            promise,
            isComplete
        };
    }


    // ------------------------------------------------------------
    // Expose to browser
    // ------------------------------------------------------------

    window.runMeasurementTheatre =
        runMeasurementTheatre;

})();

