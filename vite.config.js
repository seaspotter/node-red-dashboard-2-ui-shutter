import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

export default defineConfig({
    plugins: [
        vue(),
        cssInjectedByJsPlugin()
    ],
    define: {
        // vuex is bundled (not external, see below) and reads process.env.NODE_ENV at
        // runtime; there is no `process` global in the browser, so replace it at build time
        'process.env.NODE_ENV': JSON.stringify('production')
    },
    build: {
        lib: {
            entry: resolve(__dirname, 'ui/index.js'),
            // Dashboard's client loads UMD widgets as window[<widget type key>][<component name>] -
            // the global name must be the literal key from package.json's
            // node-red-dashboard-2.widgets ("ui-shutter"), not the component's own name.
            name: 'ui-shutter',
            fileName: (format) => `ui-shutter.${format === 'es' ? 'esm' : 'umd'}.js`,
            formats: ['es', 'umd']
        },
        rollupOptions: {
            // 'vue' must stay external - the Dashboard host app provides the actual running
            // instance. 'vuex' is bundled in: the host does not expose a global Vuex, but
            // mapState()'s generated computed properties only ever touch `this.$store`
            // (injected by the host), so a locally-bundled copy of the helper works fine.
            external: ['vue'],
            output: {
                globals: {
                    vue: 'Vue'
                }
            }
        },
        outDir: 'resources',
        emptyOutDir: false
    }
})
