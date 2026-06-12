import { registerService } from '@webext-core/proxy-service'

import { PluralMindService } from '@/pluralmind/service'
import { PLURALMIND_SERVICE_KEY } from '@/pluralmind/types'

export default defineBackground(() => {
    const pluralMindService = new PluralMindService()
    registerService(PLURALMIND_SERVICE_KEY, pluralMindService)
})
