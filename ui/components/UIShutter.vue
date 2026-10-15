<template>
    <div
        class="nrdb-ui-shutter"
        :class="{ 'nrdb-ui-shutter--disabled': !state.enabled }"
        :style="{ '--sky-color': skyColor, '--cover-color': color, '--button-color': buttonColor }"
    >
        <label
            v-if="showLabel && props.label"
            class="nrdb-ui-shutter-label"
            :style="{ textAlign: labelAlignment }"
        >{{ props.label }}</label>
        <div class="nrdb-ui-shutter-body">
            <div v-if="props.showGraphic" class="nrdb-ui-shutter-window">
                <div class="nrdb-ui-shutter-cover" :style="{ height: coverHeightPct + '%' }">
                    <div v-if="!isBlind" class="nrdb-ui-shutter-panels"></div>
                    <div v-else class="nrdb-ui-shutter-slats">
                        <div
                            v-for="n in slatCount"
                            :key="n"
                            class="nrdb-ui-shutter-slat"
                            :style="{ height: slatHeightPx + 'px', marginBottom: slatGapPx + 'px' }"
                        ></div>
                    </div>
                </div>
            </div>
            <div class="nrdb-ui-shutter-controls">
                <div v-if="props.showPositionText" class="nrdb-ui-shutter-position-text">
                    {{ positionText }}
                </div>
                <div v-if="props.showSlider" class="nrdb-ui-shutter-slider-row">
                    <svg class="nrdb-ui-shutter-slider-icon" viewBox="0 0 24 24"><path d="M12 7l-8 8h16z" /></svg>
                    <input
                        type="range"
                        class="nrdb-ui-shutter-slider"
                        min="0"
                        max="100"
                        step="1"
                        :value="displayPosition"
                        :disabled="!state.enabled"
                        @input="onPositionInput"
                        @change="onPositionChange"
                    >
                    <svg class="nrdb-ui-shutter-slider-icon" viewBox="0 0 24 24"><path d="M12 17l8-8H4z" /></svg>
                </div>
                <div v-if="props.showSlider && isBlind" class="nrdb-ui-shutter-slider-row">
                    <svg class="nrdb-ui-shutter-slider-icon" viewBox="0 0 24 24"><rect x="4" y="11" width="16" height="2" /></svg>
                    <input
                        type="range"
                        class="nrdb-ui-shutter-slider"
                        min="0"
                        max="100"
                        step="1"
                        :value="displaySlats"
                        :disabled="!state.enabled"
                        @input="onSlatsInput"
                        @change="onSlatsChange"
                    >
                    <svg class="nrdb-ui-shutter-slider-icon" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" /></svg>
                </div>
                <div v-if="props.showButtons" class="nrdb-ui-shutter-buttons">
                    <button type="button" class="nrdb-ui-shutter-button" :disabled="!state.enabled" aria-label="Up" title="Up" @click="sendAction('up')">
                        <svg class="nrdb-ui-shutter-icon" :class="{ 'nrdb-ui-shutter-icon--stroke': buttonIcons.mode === 'stroke' }" viewBox="0 0 24 24"><path :d="buttonIcons.up" /></svg>
                    </button>
                    <button type="button" class="nrdb-ui-shutter-button" :disabled="!state.enabled" aria-label="Stop" title="Stop" @click="sendAction('stop')">
                        <svg class="nrdb-ui-shutter-icon" viewBox="0 0 24 24"><rect x="5" y="5" width="14" height="14" rx="1.5" /></svg>
                    </button>
                    <button type="button" class="nrdb-ui-shutter-button" :disabled="!state.enabled" aria-label="Down" title="Down" @click="sendAction('down')">
                        <svg class="nrdb-ui-shutter-icon" :class="{ 'nrdb-ui-shutter-icon--stroke': buttonIcons.mode === 'stroke' }" viewBox="0 0 24 24"><path :d="buttonIcons.down" /></svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'

const DRAG_REVERT_TIMEOUT_MS = 10000
const SLAT_COUNT = 10

const BUTTON_ICON_SETS = {
    arrow: { mode: 'fill', up: 'M12 4l8 9h-5v7H9v-7H4z', down: 'M12 20l-8-9h5V4h6v7h5z' },
    triangle: { mode: 'fill', up: 'M12 5l7 7H5z', down: 'M12 19l-7-7h14z' },
    chevron: { mode: 'stroke', up: 'M5 15l7-7 7 7', down: 'M5 9l7 7 7-7' }
}

export default {
    name: 'UIShutter',
    inject: ['$socket'],
    props: {
        id: { type: String, required: true },
        props: { type: Object, default: () => ({}) },
        state: { type: Object, default: () => ({ enabled: true, visible: true }) }
    },
    data () {
        return {
            localPosition: null,
            localSlats: null,
            revertTimer: null,
            revertTimerSlats: null,
            slatCount: SLAT_COUNT
        }
    },
    computed: {
        ...mapState('data', ['messages']),
        msg () {
            return this.messages[this.id]
        },
        hasPosition () {
            return this.msg !== undefined && this.msg !== null && this.msg.position !== undefined && this.msg.position !== null
        },
        hasSlats () {
            return this.msg !== undefined && this.msg !== null && this.msg.slats !== undefined && this.msg.slats !== null
        },
        isBlind () {
            return this.props.shutterType === 'blind'
        },
        displayPosition () {
            if (this.localPosition !== null) {
                return this.localPosition
            }
            return this.hasPosition ? this.msg.position : 0
        },
        displaySlats () {
            if (this.localSlats !== null) {
                return this.localSlats
            }
            return this.hasSlats ? this.msg.slats : 0
        },
        closedAt100 () {
            return this.props.zeroMeans !== 'closed'
        },
        closedFraction () {
            const p = this.displayPosition
            return this.closedAt100 ? p / 100 : 1 - (p / 100)
        },
        coverHeightPct () {
            return Math.min(100, Math.max(0, this.closedFraction * 100))
        },
        slatClosedFraction () {
            const s = this.displaySlats
            return Math.min(1, Math.max(0, s / 100))
        },
        slatPitchPx () {
            // approximate pitch of a slat (bar + gap) within the cover, in px, assuming ~90px tall cover at 100% closed
            return 9
        },
        slatHeightPx () {
            const minPx = 2
            const maxPx = this.slatPitchPx - 1
            return minPx + this.slatClosedFraction * (maxPx - minPx)
        },
        slatGapPx () {
            return Math.max(1, this.slatPitchPx - this.slatHeightPx)
        },
        positionText () {
            if (!this.hasPosition && this.localPosition === null) {
                return '–'
            }
            const p = this.displayPosition
            const openValue = this.closedAt100 ? 0 : 100
            const closedValue = this.closedAt100 ? 100 : 0
            if (p === openValue) {
                return this.props.textOpen || 'Open'
            }
            if (p === closedValue) {
                return this.props.textClosed || 'Closed'
            }
            return `${Math.round(p)} %`
        },
        color () {
            return this.props.color || 'var(--v-theme-primary, #607d8b)'
        },
        skyColor () {
            return this.props.skyColor || '#bbdefb'
        },
        buttonColor () {
            return this.props.buttonColor || this.color
        },
        buttonIcons () {
            return BUTTON_ICON_SETS[this.props.buttonIconStyle] || BUTTON_ICON_SETS.arrow
        },
        showLabel () {
            return this.props.showLabel !== false
        },
        labelAlignment () {
            return this.props.labelAlignment || 'left'
        }
    },
    mounted () {
        this.$socket?.on('widget-load:' + this.id, this.onLoad)
        this.$socket?.on('msg-input:' + this.id, this.onMsgInput)
        this.$socket?.emit('widget-load', this.id)
    },
    unmounted () {
        this.$socket?.off('widget-load:' + this.id, this.onLoad)
        this.$socket?.off('msg-input:' + this.id, this.onMsgInput)
        clearTimeout(this.revertTimer)
        clearTimeout(this.revertTimerSlats)
    },
    methods: {
        onLoad (msg) {
            this.$store.commit('data/bind', { widgetId: this.id, msg })
        },
        onMsgInput (msg) {
            this.$store.commit('data/bind', { widgetId: this.id, msg })
            // a fresh status message is authoritative: drop any locally latched drag value
            clearTimeout(this.revertTimer)
            clearTimeout(this.revertTimerSlats)
            this.localPosition = null
            this.localSlats = null
        },
        sendAction (action) {
            if (!this.state.enabled) {
                return
            }
            this.$socket.emit('widget-action', this.id, { shutterAction: action })
        },
        onPositionInput (evt) {
            this.localPosition = Number(evt.target.value)
        },
        onPositionChange (evt) {
            const value = Number(evt.target.value)
            this.localPosition = value
            this.$socket.emit('widget-action', this.id, { shutterAction: 'position', value })
            clearTimeout(this.revertTimer)
            this.revertTimer = setTimeout(() => { this.localPosition = null }, DRAG_REVERT_TIMEOUT_MS)
        },
        onSlatsInput (evt) {
            this.localSlats = Number(evt.target.value)
        },
        onSlatsChange (evt) {
            const value = Number(evt.target.value)
            this.localSlats = value
            this.$socket.emit('widget-action', this.id, { shutterAction: 'slats', value })
            clearTimeout(this.revertTimerSlats)
            this.revertTimerSlats = setTimeout(() => { this.localSlats = null }, DRAG_REVERT_TIMEOUT_MS)
        }
    }
}
</script>

<style scoped>
.nrdb-ui-shutter {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    min-width: 0;
    box-sizing: border-box;
}

.nrdb-ui-shutter--disabled {
    opacity: 0.5;
}

.nrdb-ui-shutter-label {
    display: block;
    width: 100%;
    box-sizing: border-box;
    font-size: 1rem;
    font-weight: 500;
}

.nrdb-ui-shutter-body {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: stretch;
    gap: 12px;
    width: 100%;
    min-width: 0;
}

.nrdb-ui-shutter-window {
    flex: 0 0 auto;
    position: relative;
    width: 64px;
    height: 90px;
    background-color: var(--sky-color);
    border: 2px solid var(--red-ui-form-input-border-color, #888);
    box-sizing: border-box;
    overflow: hidden;
}

.nrdb-ui-shutter-cover {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    background-color: var(--cover-color);
    transition: height 0.4s ease;
    box-sizing: border-box;
    border-bottom: 3px solid rgba(0, 0, 0, 0.35);
    overflow: hidden;
}

.nrdb-ui-shutter-panels {
    width: 100%;
    height: 100%;
    background-image: repeating-linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.25) 0,
        rgba(0, 0, 0, 0.25) 1px,
        transparent 1px,
        transparent 10px
    );
}

.nrdb-ui-shutter-slats {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding-top: 1px;
    box-sizing: border-box;
}

.nrdb-ui-shutter-slat {
    width: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    flex-shrink: 0;
}

.nrdb-ui-shutter-controls {
    flex: 1 1 140px;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
    justify-content: center;
}

.nrdb-ui-shutter-position-text {
    font-size: 0.9rem;
    text-align: center;
}

.nrdb-ui-shutter-slider-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 6px;
    width: 100%;
    min-width: 0;
}

.nrdb-ui-shutter-slider-icon {
    flex: 0 0 auto;
    width: 14px;
    height: 14px;
    fill: currentColor;
    opacity: 0.6;
}

.nrdb-ui-shutter-slider {
    flex: 1 1 auto;
    min-width: 0;
    width: 100%;
}

.nrdb-ui-shutter-buttons {
    display: flex;
    flex-direction: row;
    gap: 8px;
    width: 100%;
}

.nrdb-ui-shutter-button {
    flex: 1 1 0;
    min-width: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 44px;
    border: none;
    border-radius: 8px;
    background-color: color-mix(in srgb, var(--button-color, #607d8b) 16%, transparent);
    color: var(--button-color, #607d8b);
    cursor: pointer;
    transition: background-color 0.15s ease;
}

.nrdb-ui-shutter-button:hover:not(:disabled) {
    background-color: color-mix(in srgb, var(--button-color, #607d8b) 28%, transparent);
}

.nrdb-ui-shutter-button:active:not(:disabled) {
    background-color: color-mix(in srgb, var(--button-color, #607d8b) 40%, transparent);
}

.nrdb-ui-shutter-button:disabled {
    cursor: not-allowed;
}

.nrdb-ui-shutter-icon {
    width: 24px;
    height: 24px;
    fill: currentColor;
}

.nrdb-ui-shutter-icon--stroke {
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
}
</style>
