import type { ProxyServiceKey } from '@webext-core/proxy-service'
import type { TwitchId } from 'pluralmind'

import type { PluralMindService } from './service'

export const PLURALMIND_SERVICE_KEY = 'pluralmind-service' as ProxyServiceKey<PluralMindService>

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
