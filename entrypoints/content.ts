import { start } from '@/pluralmind/plugin'

export default defineContentScript({
    matches: ['*://*.twitch.tv/*'],
    main() {
        start()
    },
})
