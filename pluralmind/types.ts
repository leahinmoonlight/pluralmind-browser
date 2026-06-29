import type { ProxyServiceKey } from '@webext-core/proxy-service'
import type { TwitchId } from 'pluralmind'

import type { PluralmindService } from './service'

export const PLURALMIND_SERVICE_KEY = 'pluralmind-service' as ProxyServiceKey<PluralmindService>

export type ChatMessageType = 'live' | 'vod'

export type ChatMessageEnvironment = 'vanilla' | 'ffz'

export interface ChatMessage {
    type: ChatMessageType
    environment: ChatMessageEnvironment
    twitchId: TwitchId
    bodyText: string
    rootElement: HTMLElement
    nameElement: HTMLElement
    bodyElement: HTMLElement
    pronounsTargetElement: HTMLElement | null
}

export interface SettingsV1 {
    showUsernames: boolean
}

export interface Settings extends SettingsV1 {}
