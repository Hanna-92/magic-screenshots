import { SingleBar } from 'cli-progress'
import * as chalk from 'chalk'
const flag = require('country-code-emoji')

let progressChar = '📷'
let spinner = '|'

const setProgressChar = () => {
    progressChar = progressChar === '📷' ? '📸' : '📷'
    setTimeout(() => setProgressChar(), 500)
}
const setSpinnerChar = (pos: number) => {
    switch(pos) {
        case 0:
            spinner = '|'
            break
        case 1:
            spinner = '/'
            break
        case 2:
            spinner = '-'
            break
        case 3:
            spinner = '\\'
            break
    }
    setTimeout(() => setSpinnerChar(((pos + 1)% 4)), 100)
}
setProgressChar() 
setSpinnerChar(1)

function formatter(_, params, payload){
    const scale = 10
    let complete = params.value * scale
    let total = params.total * scale
    let progress = ""
    for(var i = 0; i < complete - 1; i++) {
        progress += '█'
    }
    if (params.value < params.total) {
        progress += ` ${progressChar}`
    }
    for(var i = 0; i < total - complete; i++) {
        progress += ' '
    }
    const country = payload.lang ? flag(payload.lang) : ''
    const end = complete < total ? `${spinner} ${payload.task}${country}` : '✓ Capture Complete'
    return `[  ${chalk.green(progress)}  ] ${end}`;    
}
 
const progress = () => new SingleBar({
    format: formatter,
    stopOnComplete: true
});

export default progress
