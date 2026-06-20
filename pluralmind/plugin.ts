import { createProxyService } from '@webext-core/proxy-service'
import { getProxiedMessage } from 'pluralmind'

import { observeChatMessages } from './chat'
import { ChatMessage, PLURALMIND_SERVICE_KEY } from './types'

const pluralMindService = createProxyService(PLURALMIND_SERVICE_KEY)

const handleMessage = async (message: ChatMessage) => {
    // Check if this user has a system, and if this is a proxied message
    const system = await pluralMindService.getSystem(message.twitchId)
    const pm = getProxiedMessage(system, message.bodyText)
    if (!pm) return

    // A system member sent this message, let's update it with their info
    message.nameElement.textContent = pm.member.name
    if (pm.pronouns) message.nameElement.textContent += ` (${pm.pronouns})`
    if (pm.color) message.nameElement.style.setProperty('color', pm.color)
    message.bodyElement!.textContent = pm.body
}

export const start = () => {
    observeChatMessages(handleMessage)
}
