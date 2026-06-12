import type { ProxyServiceKey } from '@webext-core/proxy-service'

import type { PluralMindService } from './service'

export const PLURALMIND_SERVICE_KEY = 'pluralmind-service' as ProxyServiceKey<PluralMindService>

export type TwitchId = string | number

export type ChatMessageType = 'live' | 'vod'

export interface ChatMessage {
    type: ChatMessageType
    username: string
    bodyText: string
    rootElement: HTMLElement
    nameElement: HTMLElement
    bodyElement: HTMLElement
}

export interface Member {
    id: number
    name: string
    proxies: string[]
    case_sensitive: boolean
    color: string | null
    pronouns: string | null
}

export interface System {
    id: number
    color: string | null
    pronouns: string | null
    autoproxy_member_id: number | null
    members: Member[]
}
