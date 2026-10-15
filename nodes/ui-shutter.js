module.exports = function (RED) {
    function UIShutterNode (config) {
        RED.nodes.createNode(this, config)
        const node = this

        node.shutterType = config.shutterType === 'blind' ? 'blind' : 'shutter'
        node.positionProperty = config.positionProperty || 'payload'
        node.slatProperty = config.slatProperty || 'slats'
        node.topic = config.topic || ''

        node.upValue = RED.util.evaluateNodeProperty(config.upValue, config.upValueType || 'bool', node)
        node.downValue = RED.util.evaluateNodeProperty(config.downValue, config.downValueType || 'bool', node)
        node.stopValue = RED.util.evaluateNodeProperty(config.stopValue, config.stopValueType || 'bool', node)

        // merged state, built up from (possibly separate) status messages on the input
        node.state = { position: undefined, slats: undefined }

        // which group are we rendering this widget in
        const group = RED.nodes.getNode(config.group)
        const base = group && group.getBase()

        function readProperty (msg, property) {
            try {
                return RED.util.getMessageProperty(msg, property)
            } catch (err) {
                return undefined
            }
        }

        // clamp a 0-100 value; ignore (return undefined) anything that isn't a number
        function clamp (raw, label) {
            const value = Number(raw)
            if (Number.isNaN(value)) {
                node.warn(`ignoring non-numeric ${label} value: ${JSON.stringify(raw)}`)
                return undefined
            }
            const clamped = Math.min(100, Math.max(0, value))
            if (clamped !== value) {
                node.warn(`clamping out-of-range ${label} value ${value} to ${clamped}`)
            }
            return clamped
        }

        function saveState () {
            if (!base) {
                return
            }
            base.stores.data.save(base, node, {
                position: node.state.position,
                slats: node.state.slats
            })
        }

        // builds the array of per-output command messages sent for a widget-action event
        const beforeSend = function (msg) {
            // beforeSend also runs on the plain input path (see onInput below) - only
            // act here on actions coming from the client widget
            if (!msg || !msg.shutterAction) {
                return msg
            }

            const numOutputs = node.shutterType === 'blind' ? 4 : 3
            const out = new Array(numOutputs).fill(null)
            const topic = msg.topic

            function withTopic (m) {
                if (topic) {
                    m.topic = topic
                }
                return m
            }

            switch (msg.shutterAction) {
            case 'up':
                out[0] = withTopic({ payload: node.upValue, action: 'up' })
                break
            case 'down':
                out[0] = withTopic({ payload: node.downValue, action: 'down' })
                break
            case 'stop':
                out[1] = withTopic({ payload: node.stopValue, action: 'stop' })
                break
            case 'position': {
                const position = clamp(msg.value, 'position')
                if (position !== undefined) {
                    node.state.position = position
                    out[2] = withTopic({ payload: position, action: 'position' })
                }
                break
            }
            case 'slats': {
                if (node.shutterType === 'blind') {
                    const slats = clamp(msg.value, 'slats')
                    if (slats !== undefined) {
                        node.state.slats = slats
                        out[3] = withTopic({ payload: slats, action: 'slats' })
                    }
                }
                break
            }
            default:
                return msg
            }

            saveState()

            return out
        }

        const evts = {
            onAction: true,
            beforeSend,
            onInput: function (msg) {
                let changed = false

                const rawPosition = readProperty(msg, node.positionProperty)
                if (rawPosition !== undefined) {
                    const position = clamp(rawPosition, 'position')
                    if (position !== undefined) {
                        node.state.position = position
                        changed = true
                    }
                }

                if (node.shutterType === 'blind') {
                    const rawSlats = readProperty(msg, node.slatProperty)
                    if (rawSlats !== undefined) {
                        const slats = clamp(rawSlats, 'slats')
                        if (slats !== undefined) {
                            node.state.slats = slats
                            changed = true
                        }
                    }
                }

                // not a status message for us (e.g. just enabled/visible/class) - nothing to merge or send to clients
                if (!changed) {
                    return
                }

                // the dashboard framework broadcasts this same msg object to connected clients as
                // 'msg-input:<id>' right after onInput returns - mutate it so the UI gets the merged state
                msg.position = node.state.position
                msg.slats = node.state.slats

                saveState()
            }
        }

        // inform the dashboard UI that we are adding this node
        if (group) {
            group.register(node, config, evts)
        } else {
            node.error('No group configured')
        }
    }

    RED.nodes.registerType('ui-shutter', UIShutterNode)
}
