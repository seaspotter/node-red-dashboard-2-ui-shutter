# Spec: `ui-shutter` – Node-RED Dashboard 2.0 widget for shutters and venetian blinds

Package name (suggestion): `@seaspotter/node-red-dashboard-2-ui-shutter`
Reference package for structure: `@mschaeffler/node-red-dashboard-2-ui-led` (same layout: `nodes/`, `ui/`, Vite build to `resources/*.umd.js`).

## 1. Goal

One reusable Dashboard 2.0 node, one instance per shutter or blind. It shows the state and offers all controls in a single widget:

- up / stop / down buttons
- position slider (0–100 %)
- for blinds additionally a slat angle slider (0–100 %)
- animated graphic of a window whose cover moves with the position
- usable without any template, function or switch nodes: outputs wire straight into KNX (or any other) nodes

Motivation: my previous attempt (one big `ui-template` per floor) overflowed its container, the buttons ended up off screen and the slider produced no output. A proper widget package avoids this.

## 2. Decisions already made

| Topic | Decision |
|---|---|
| Outputs | **Separate outputs** per command, payload values configurable |
| Look | **Animated window graphic** plus controls |
| Scope v1 | **Shutter and blind** in one node, switchable by type |
| Language | Package and editor in English; all visible texts (open/closed, button tooltips) editable in the node config. Owner (Flo) prefers German UI texts, so make them easy to override |
| Build | Vite, output UMD in `resources/`, like the LED package |

## 3. Node configuration (editor)

| Field | Default | Notes |
|---|---|---|
| `name` | "" | |
| `group`, `order`, `width`, `height` | standard Dashboard fields | width/height default 0 (auto); copy validation from ui-led |
| `label` | "" | shown above the controls |
| `shutterType` | `shutter` | `shutter` or `blind`. `blind` enables slats |
| `closedAt100` | true | KNX convention: 0 % = open, 100 % = closed. If false the graphic and texts are inverted. Values on inputs and outputs are never converted |
| `showGraphic` | true | |
| `showButtons` | true | |
| `showSlider` | true | |
| `showPositionText` | true | e.g. "73 %", "open", "closed" |
| `textOpen` / `textClosed` | "Open" / "Closed" | |
| `color` | theme primary | cover/slat color |
| `skyColor` | light blue | window background |
| `positionProperty` | `payload` | input msg property holding the position |
| `slatProperty` | `slats` | input msg property holding the slat angle |
| `upValue` / `downValue` | bool `false` / bool `true` | typed input (str/num/bool/json), KNX DPT 1.008: 0 = up, 1 = down |
| `stopValue` | bool `true` | |
| `topic` | "" | optional topic for all output messages |
| `outputs` | 3 | set in `oneditsave`: 3 for shutter, 4 for blind |

## 4. Messages

### Inputs (one input)

- Position: `msg[positionProperty]` is a number 0–100.
- Slats: `msg[slatProperty]` is a number 0–100.
- Both may arrive in one message or in separate messages. Status telegrams usually come separately, so the node must merge into a stored state `{ position, slats }`.
- Invalid values (NaN, out of range): clamp to 0–100 or ignore with a node warning; decide and document.
- Standard Dashboard props `enabled`, `visible`, `class` are handled by Dashboard itself.
- The node does **not** pass input messages through (outputs are commands only).

### Outputs

| # | Meaning | Payload | Extra props |
|---|---|---|---|
| 1 | Move up/down | `upValue` or `downValue` | `msg.action = 'up' \| 'down'` |
| 2 | Stop | `stopValue` | `msg.action = 'stop'` |
| 3 | Set position | number 0–100 | `msg.action = 'position'` |
| 4 | Set slats (blind only) | number 0–100 | `msg.action = 'slats'` |

All outputs also carry `msg.topic` if configured. Each user action emits exactly one message on exactly one output.

### Example wiring for my KNX setup (knxUltimate, group addresses from ETS)

- Output 1 → knxUltimate `3/1/10` (Auf/Ab, DPT 1.008)
- Output 2 → knxUltimate `3/1/11` (Stop)
- Output 3 → knxUltimate `3/1/12` (Position)
- Status `3/1/13` (Position status, DPT 5.001) → input of the widget
- Slats: a second status GA → change node setting `msg.slats` → input

Group addresses follow the pattern: Auf/Ab = n, Stop = n+1, Position = n+2, Position status = n+3. Full list is in the ETS CSV inside the `knxUltimate-config` node of my flow (`flows.json`, tab "Visu Rollo"). Shutters: EG Bad, Büro, Wohnen klein, Wohnen groß, Küche; OG Schlafen Ost/Süd, Büro Süd/West, Gast West, Kind West/Nord, Bad Nord/Ost; Zipscreens West rechts/links, Nord. Central groups EG `3/3/1` and `3/3/2`, OG `3/3/6` and `3/3/7`, Zipscreens `3/4/15` and `3/4/16`.

## 5. UI behaviour

Layout: graphic on the left, controls on the right (label, position text, position slider, optional slat slider, button row). Must work in narrow groups (width 3–4 grid columns) without any horizontal scrolling. No fixed pixel widths that can exceed the group.

- **Graphic**: SVG or CSS window. Cover height = closed fraction × window height (closed fraction = `pos/100`, or `1 - pos/100` if `closedAt100` is false).
  - Shutter: cover with horizontal panel lines and a bottom bar.
  - Blind: repeated slats. Slat bar height = slat pitch × slat closed fraction (0 % = thin line, 100 % = fully closed).
  - Smooth CSS transition on changes.
- **Buttons**: up, stop, down. Respect `state.enabled`.
- **Position slider**: shows current position. While dragging, show the dragged value locally and send **only on release** (`end`), not continuously. After release keep the dragged value until the next status arrives or a short timeout, so it does not jump back.
- **Slat slider**: same behaviour, only for `blind`.
- **Text**: "Open" at 0 %, "Closed" at 100 % (swapped if `closedAt100` is false), otherwise "73 %". Show "–" until the first value is received.

## 6. Technical notes on Dashboard 2.0 (findings from reading `@flowfuse/node-red-dashboard` 1.33 source)

Server (`nodes/ui-shutter.js`), following `ui-led.js` and `ui_button.js`:

- `group.register(node, config, evts)` with
  - `onAction: true` so that `widget-action` events from the client are accepted.
  - `beforeSend(msg)`: if `msg.shutterAction` is set, build and return the **array** of output messages (e.g. `[msgMove, null, null, null]`). Dashboard then calls `wNode.send(msg)`, and Node-RED accepts arrays for multiple outputs. Otherwise return `msg` unchanged. Caution: `beforeSend` is also called in the input path, so it must pass normal input messages through untouched.
  - `onInput(msg, send)`: read position and slat properties, merge into node state, store a merged message with `base.stores.data.save(base, node, msg)` so reloading clients get the full state. Dashboard emits `msg-input:<id>` to clients after `onInput` returns.
- Evaluate typed values server-side with `RED.util.evaluateNodeProperty(value, type, node)`.
- `appendTopic` is applied by Dashboard before `beforeSend` when `topic` is configured.

Client (`ui/components/UIShutter.vue`):

- Props as in `UILed.vue`: `id`, `props` (the node config), `state`. Inject `$socket`.
- On mount: `$socket.on('widget-load:' + id, ...)` and `$socket.on('msg-input:' + id, ...)`, both commit to the Vuex `data/bind` store, then `$socket.emit('widget-load', id)`. Unsubscribe in `unmounted`.
- To send a command: `this.$socket.emit('widget-action', this.id, { shutterAction: 'position', value: 42 })`.
- `package.json`: `node-red.nodes` entry for `ui-shutter`, and `node-red-dashboard-2.widgets` entry `{ "ui-shutter": { "output": "ui-shutter.umd.js", "component": "UIShutter" } }`.
- Not yet verified: whether Dashboard registers all Vuetify components globally (`v-btn`, `v-slider`). The dist bundle contains `createVuetify`, but check the registered component list. If not available, use native elements styled with Vuetify CSS variables.

Editor (`nodes/ui-shutter.html` plus locale files): copy the group/width/height validation from `ui-led.html`. Use typed inputs for the output values. Output labels: "up/down", "stop", "position", "slats". Update `outputs` in `oneditsave` based on `shutterType`.

## 7. Dev and test setup (worked in my sandbox)

- Scaffold from the LED package (`npm pack @mschaeffler/node-red-dashboard-2-ui-led` to read it), add `vite.config.js` with `@vitejs/plugin-vue`, `vite-plugin-css-injected-by-js`, lib entry `ui/index.js`, `vue`/`vuex` as externals, UMD output to `resources/`.
- Local test instance: `npm i node-red @flowfuse/node-red-dashboard`, install the package via `npm i /path/to/package` in the Node-RED user dir.
- Replace the KNX node with a function stub that logs telegrams, and echo a fake status for read requests.
- Drive the dashboard page with Playwright (Chromium is available at `/opt/pw-browsers` in the sandbox) and assert:
  1. Click up / stop / down → exactly one message on the right output with the configured payload.
  2. Drag position slider → one message on output 3 on release, value matches.
  3. Input message with a position → graphic, slider and text update; reload page → state is restored.
  4. Blind: slat slider → output 4; slat input updates the graphic.
  5. Narrow group (3 columns): no horizontal scrollbar, all controls visible.
  6. `closedAt100 = false` inverts graphic and texts but not the values.
- Take screenshots for the README.

## 8. Acceptance criteria

- Installable from a tarball into an existing Dashboard 2.0 setup (Dashboard ≥ 1.30, Node-RED ≥ 3).
- All six test points above pass.
- Replacing my existing 17 shutters (about 100 nodes in tab "Visu Rollo") works with one widget node per shutter plus the KNX nodes.
- README with install instructions, config table, message tables, wiring example and screenshots.

## 9. Out of scope for v1 (possible later)

- Slat step buttons (KNX step/stop telegrams)
- Central/group control as its own widget variant
- Showing "moving" state or travel direction on the graphic
- Window lock / shading lock indicators (I use these in separate switches today)
- Dragging directly on the graphic to set the position
