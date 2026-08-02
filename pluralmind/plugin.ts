import { createProxyService } from '@webext-core/proxy-service'
import { each } from 'lodash-es'
import { getProxiedMessage } from 'pluralmind'
import { observeChatMessages, type ChatMessage } from 'twitch-refragment'
import { watch } from 'vue'

import './styles.css'
import { useSettings } from './settings'
import { PLURALMIND_SERVICE_KEY } from './types'

const pluralMindService = createProxyService(PLURALMIND_SERVICE_KEY)

let { settings, settingsPromise, settingsReady } = useSettings()

const handleMessage = async (message: ChatMessage) => {
    // Check if this user has a system, and if this is a proxied message
    const system = await pluralMindService.getSystem(message.userId ?? message.username)
    const pm = getProxiedMessage(system, message.fragments)
    if (!pm) return

    // A system member sent this message, let's update it with their info
    // Let's first ensure our settings have loaded
    if (!settingsReady.value) await settingsPromise
    const showUsernames = settings.value!.showUsernames

    // Store the member's name and original username on the element so we can
    // toggle between them
    const nameDataset = message.displayNameElement.dataset
    if (!nameDataset.pmName) {
        nameDataset.pmName = pm.member.name
        nameDataset.pmNameWithUsername = `${pm.member.name} (${message.displayNameElement.textContent})`
    }

    // Update the user info
    message.displayNameElement.textContent = showUsernames ? nameDataset.pmNameWithUsername! : nameDataset.pmName
    if (pm.color) message.displayNameElement.style.setProperty('color', pm.color)
    if (pm.pronouns) {
        message.authorElement?.setAttribute('data-pm-pronouns', pm.pronouns)

        // Hide FFZ's pronouns for this message, if they're present
        message.element.classList.add('pm-pronouns')
    }

    // Update the message fragments
    each(pm.changedFragments, (fragment, idx) => {
        if (fragment === null) {
            message.fragments[Number(idx)].element.remove()
        } else {
            fragment.element.textContent = fragment.text!
        }
    })
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

/**
 * Returns all of the name elements we've already added proxy information to.
 */
export const getAllProxiedNameElements = (): NodeListOf<HTMLElement> => {
    return document.querySelectorAll('.chat-author__display-name[data-pm-name]')
}

export const start = () => {
    observeChatMessages(handleMessage)
    monitorSettings()
}
