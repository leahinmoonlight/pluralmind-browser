import type { ProxyServiceKey } from '@webext-core/proxy-service'

import type { PluralmindService } from './service'

export const PLURALMIND_SERVICE_KEY = 'pluralmind-service' as ProxyServiceKey<PluralmindService>

export interface SettingsV1 {
    showUsernames: boolean
}

export interface Settings extends SettingsV1 {}
