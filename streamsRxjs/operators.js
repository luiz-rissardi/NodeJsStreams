
/**
 * 
 * @param {EventTarget} target 
 * @param {string} eventName 
 * @returns {ReadableStream} 
 */

export function fromEvent(target, eventName) {
    let listener;
    return new ReadableStream({
        start(controller) {
            listener = (e) => controller.enqueue(e);
            target.addEventListener(eventName, listener);
        },
        cancel() {
            target.removeEventListener(eventName, listener)
        }
    })
}

/**
 * 
 * @param {Function} fn
 * @returns {TransformStream}
 */

export function map(fn) {
    return new TransformStream({
        transform(chunk, controller) {
            controller.enqueue(fn.bind(fn)(chunk))
        }
    })
}

/**
 * 
 * @param {Stream[] } streams 
 * @returns 
 */
export function merge(streams) {
    return new ReadableStream({
        start(controller) {
            for (const stream of streams) {
                const reader = (stream.readable || stream).getReader()
                async function read() {
                    const { value, done } = await reader.read()
                    if (done) return
                    // verifica se a stream ja encerrou
                    if (!controller.desiredSize) return

                    controller.enqueue(value)

                    return read()
                }

                read()
            }
        }
    })
}

/**
 * 
 * @param {Function} fn 
 * @param { Object } options 
 * @param { Boolean } options.pairwise 
 * 
 * @returns { TransformStream }
 */
export function switchMap(fn, options = { pairwise: true }) {
    return new TransformStream({
        transform(chunk, controller) {
            const stream = fn(chunk);
            const readerStream = (stream.readble || stream).getReader();

            async function read() {
                const { value, done } = await readerStream.read()
                if (done) return
                const result = options.pairwise ? [chunk, value] : value
                controller.enqueue(result)
                return read()
            }
            return read()
        }
    })
}


/**
 * 
 * @param { TransformStream | ReadableStream } stream
 * @returns { TransformStream } 
 */
export function takeUntil(stream) {
    return new TransformStream({
        transform(chunk, controller) {
            controller.enqueue(chunk);
        },

        start(controller) {
            readAndTerminate(stream, controller)
        }
    })
}


async function readAndTerminate(stream, controller) {
    const streamReader = (stream.readable || stream).getReader();
    const { value } = await streamReader.read();
    controller.enqueue(value);
    controller.terminate();
}