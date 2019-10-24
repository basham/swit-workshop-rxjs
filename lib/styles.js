import { adoptStyles } from './util/dom.js'

import button from './components/dice-button.css'
import die from './components/dice-die.css'
import input from './components/dice-input.css'
import picker from './components/dice-picker.css'
import root from './components/dice-root.css'
import toolbar from './components/dice-toolbar.css'
import tray from './components/dice-tray.css'

import exercises from './exercises.css'

adoptStyles(button, die, input, picker, root, toolbar, tray)
adoptStyles(exercises)
