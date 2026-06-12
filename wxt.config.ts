import { defineConfig } from 'wxt'

// See https://wxt.dev/api/config.html
export default defineConfig({
    manifest: {
        name: 'PluralMind - Plurality Plugin for Twitch Chat',
        host_permissions: ['https://pluralmind.chat/*'],
        browser_specific_settings: {
            gecko: {
                data_collection_permissions: {
                    required: ['none'],
                },
            },
        },
    },
})
