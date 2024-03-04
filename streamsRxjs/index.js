import { fromEvent, map, merge, switchMap, takeUntil } from "./operators.js";


const canvas = document.getElementById('canvas')
const clearBtn = document.getElementById('clearBtn')
const contextCanvas = canvas.getContext('2d')



const store = {
    db: [],
    get: function () { return this.db },
    set: function (item) { this.db.unshift(item) },
    clear: function () { this.db.length = 0 }
}

function resetCanvas(width, height) {
    const parent = canvas.parentElement;
    canvas.width = width || parent.clientWidth * 0.9;
    canvas.height = height || parent.clientHeight * 1.5;
    configCanvas()
}

function configCanvas() {
    contextCanvas.clearRect(0, 0, canvas.width, canvas.height)
    contextCanvas.strokeStyle = 'green'
    contextCanvas.lineWidth = 4
}

resetCanvas();

const mouseEvents = {
    down: "mousedown",
    up: "mouseup",
    leave: "mouseleave",
    move: "mousemove",

    touchstart: 'touchstart',
    touchmove: 'touchmove',
    touchend: 'touchend',
    click: 'click',
}

/**
 * 
 * @param {TouchEvent} touchEvent 
 * @param {MouseEvent} mouseEvent 
 */

function touchToMouse(touchEvent, mouseEvent) {
    const [touch] = touchEvent.touches.length ?
        touchEvent.touches :
        touchEvent.changedTouches;
    return new MouseEvent(mouseEvent, {
        clientX: touch.clientX,
        clientY: touch.clientY
    })
}

/**
 * 
 * @param {HTMLCanvasElement} canvasDom 
 * @param {MouseEvent} mouseEvent 
 */
function getMousePosition(canvasDom, mouseEvent) {
    const rect = canvasDom.getBoundingClientRect()
    return {
        x: mouseEvent.clientX - rect.left,
        y: mouseEvent.clientY - rect.top,
    }
}

function writeInCanvas({ from, to }) {
    contextCanvas.moveTo(from.x, from.y);
    contextCanvas.lineTo(to.x, to.y);
    contextCanvas.stroke();
}

merge([
    fromEvent(canvas, mouseEvents.down),
    fromEvent(canvas, mouseEvents.touchstart)
        .pipeThrough(map(e => touchToMouse(e, mouseEvents.touchstart)))
])
    .pipeThrough(
        switchMap(e => {
            return merge([
                fromEvent(canvas, mouseEvents.move),
                fromEvent(canvas, mouseEvents.touchmove)
                    .pipeThrough(map(e => touchToMouse(e, mouseEvents.touchmove)))

            ]).pipeThrough(
                takeUntil(
                    merge([
                        fromEvent(canvas, mouseEvents.up),
                        fromEvent(canvas, mouseEvents.leave),
                        fromEvent(canvas, mouseEvents.touchend)
                            .pipeThrough(map(e => touchToMouse(e, mouseEvents.up)))
                    ]))
            )
        })
    )
    .pipeThrough(map(function ([mousedown, mouseMove]) {
        this._lastPosition = this._lastPosition ?? mousedown;
        const [from, to] = [this._lastPosition, mouseMove]
            .map(el => getMousePosition(canvas, el))
        this._lastPosition = mouseMove.type == mouseEvents.up ? null : mouseMove;
        return { from, to }

    }))
    .pipeTo(new WritableStream({
        write({ from, to }) {
            store.set({ from, to })
            writeInCanvas({ from, to })
        }
    }))



const sleep = (ms) => new Promise(r => setTimeout(r, ms))
fromEvent(clearBtn, mouseEvents.click)
    .pipeTo(new WritableStream({
        async write() {
            contextCanvas.beginPath()
            contextCanvas.strokeStyle = 'white'

            for (const { from, to } of store.get()) {
                contextCanvas.moveTo(from.x, from.y)
                contextCanvas.lineTo(to.x, to.y)
                contextCanvas.stroke()

                await sleep(5)
            }
            resetCanvas(canvas.width, canvas.height)
            store.clear()
        }
    }))