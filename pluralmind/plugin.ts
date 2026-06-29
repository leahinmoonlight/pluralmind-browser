import { createProxyService } from '@webext-core/proxy-service'
import { getProxiedMessage } from 'pluralmind'
import { watch } from 'vue'

import './styles.css'
import { getAllProxiedNameElements, observeChatMessages } from './chat'
import { useSettings } from './settings'
import { ChatMessage, PLURALMIND_SERVICE_KEY } from './types'

const pluralMindService = createProxyService(PLURALMIND_SERVICE_KEY)

let { settings, settingsPromise, settingsReady } = useSettings()

const handleMessage = async (message: ChatMessage) => {
    // Check if this user has a system, and if this is a proxied message
    const system = await pluralMindService.getSystem(message.twitchId)
    const pm = getProxiedMessage(system, message.bodyText)
    if (!pm) return

    // A system member sent this message, let's update it with their info
    // Let's first ensure our settings have loaded
    if (!settingsReady.value) await settingsPromise
    const showUsernames = settings.value!.showUsernames

    // Store the member's name and original username on the element so we can
    // toggle between them
    const nameDataset = message.nameElement.dataset
    if (!nameDataset.pmName) {
        nameDataset.pmName = pm.member.name
        nameDataset.pmNameWithUsername = `${pm.member.name} (${message.nameElement.textContent})`
    }

    // Update the message
    message.nameElement.textContent = showUsernames ? nameDataset.pmNameWithUsername! : nameDataset.pmName
    message.bodyElement!.textContent = pm.body
    if (pm.color) message.nameElement.style.setProperty('color', pm.color)
    if (pm.pronouns) {
        message.pronounsTargetElement?.setAttribute('data-pm-pronouns', pm.pronouns)

        // Hide FFZ's pronouns for this message, if they're present
        message.rootElement.classList.add('pm-pronouns')
    }
}

export const monitorSettings = async () => {
    await settingsPromise

    watch(() => settings.value!.showUsernames, (showUsernames) => {
        const targetData = showUsernames ? 'pmNameWithUsername' : 'pmName'
        getAllProxiedNameElements().forEach((nameElement) => {
            nameElement.textContent = nameElement.dataset[targetData]!
        })
    })
}

export const start = () => {
    observeChatMessages(handleMessage)
    monitorSettings()
}
