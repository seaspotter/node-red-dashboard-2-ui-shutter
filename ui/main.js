/**
 * Used only for development (via `npm run dev`).
 *
 * This file is useful for testing your component in isolation from Node-RED.
 */
import { createApp } from 'vue'

import UIShutter from './components/UIShutter.vue'

const props = {
    label: 'Living Room',
    shutterType: 'blind',
    zeroMeans: 'open',
    showGraphic: true,
    showButtons: true,
    showSlider: true,
    showPositionText: true,
    textOpen: 'Open',
    textClosed: 'Closed',
    color: '#607d8b',
    skyColor: '#bbdefb'
}

createApp(UIShutter, {
    id: 'dev-preview',
    props,
    state: { enabled: true, visible: true }
}).mount('#app')
