import { createProxyService } from '@webext-core/proxy-service'

import { observeChatMessages } from './chat'
import { ChatMessage, PLURALMIND_SERVICE_KEY } from './types'

const pluralMindService = createProxyService(PLURALMIND_SERVICE_KEY)

const handleMessage = async (message: ChatMessage) => {
    // Check if this user has a system
    // Note: We have to fetch early (rather than checking for something that
    // looks like a proxy) because the user may have autoproxy enabled.
    const system = await pluralMindService.fetchSystem(message.username)
    if (!system) return

    // Alrighty, we have a system!
    let member = null
    if (system.autoproxy_member_id) member = system.members.find(m => m.id === system.autoproxy_member_id)

    // Let's see if the user used a proxy
    let actualMessage = message.bodyText
    const splitByColon = message.bodyText.split(': ')
    if (splitByColon.length >= 2) {
        const proxyPrefix = splitByColon[0]
        const proxiedMember = system.members.find(m => {
            if (m.case_sensitive) return m.proxies.includes(proxyPrefix)
            return m.proxies.some(p => p.toLowerCase() === proxyPrefix.toLowerCase())
        })
        if (proxiedMember) {
            member = proxiedMember
            actualMessage = splitByColon.slice(1).join(': ')
        }
    }

    if (!member) return

    // We have a system member to apply to the message
    message.nameElement.textContent = member.name
    const effectivePronouns = member.pronouns ?? system.pronouns
    const effectiveColor = member.color ?? system.color
    if (effectivePronouns) message.nameElement.textContent += ` (${effectivePronouns})`
    if (effectiveColor) message.nameElement.style.setProperty('color', effectiveColor)
    message.bodyElement!.textContent = actualMessage
}

export const start = () => {
    observeChatMessages(handleMessage)
}
