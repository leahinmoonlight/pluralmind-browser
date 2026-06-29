import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'wxt'

// See https://wxt.dev/api/config.html
export default defineConfig({
    manifest: {
        name: 'Pluralmind - Plurality Plugin for Twitch Chat',
        host_permissions: ['https://pluralmind.chat/*'],
        permissions: ['storage'],
        browser_specific_settings: {
            gecko: {
                id: '{f5313eba-0033-40a2-954a-2a851ebcf2ef}',
                data_collection_permissions: {
                    required: ['none'],
                },
            },
        },
    },

    modules: ['@wxt-dev/module-vue'],

    vite: () => ({ plugins: [tailwindcss()] }),
})
