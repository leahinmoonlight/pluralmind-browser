import { registerService } from '@webext-core/proxy-service'

import { PluralmindService } from '@/pluralmind/service'
import { PLURALMIND_SERVICE_KEY } from '@/pluralmind/types'

export default defineBackground(() => {
    const pluralmindService = new PluralmindService()
    registerService(PLURALMIND_SERVICE_KEY, pluralmindService)
})
