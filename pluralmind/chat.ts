import type { TwitchId } from 'pluralmind'

import type { ChatMessageEnvironment, ChatMessageType, ChatMessage } from './types'

type ChatMessageCallback = (chatMessage: ChatMessage) => void

const liveMessageSelector = '.chat-line__message'
const vodMessageSelector = '.vod-message'
const nameElementSelector = '.chat-author__display-name[data-a-user]'
const bodyElementSelector = '.text-fragment[data-a-target="chat-message-text"]'
const pronounsTargetSelector = '.chat-line__username, .video-chat__message-author'
const ffzMetadataSelector = 'div[data-room-id][data-user-id][data-user]'
const ffzNameElementSelector = '.chat-author__display-name'
const anyEnvironmentMessageSelector = `${nameElementSelector}, ${ffzMetadataSelector}`

export const observeChatMessages = (callback: ChatMessageCallback) => {
    const examineMessage = (hookElement: HTMLElement) => {
        // Grab the user's twitch ID and name element, which varies when FFZ
        // is present on the page
        let twitchId: TwitchId | null = null
        let environment: ChatMessageEnvironment | null = null
        let nameElement: HTMLElement | null = null
        if (hookElement.matches(ffzMetadataSelector)) {
            twitchId = hookElement.dataset.userId || null
            environment = 'ffz'
            nameElement = hookElement.querySelector(ffzNameElementSelector)
        } else {
            twitchId = hookElement.dataset.aUser || null
            environment = 'vanilla'
            nameElement = hookElement
        }

        if (!twitchId || !nameElement) return

        const rootElement = nameElement.closest(`${liveMessageSelector}, ${vodMessageSelector}`) as HTMLElement | null
        if (!rootElement) return

        const messageType: ChatMessageType = rootElement.matches(liveMessageSelector) ? 'live' : 'vod'
        const bodyElement = rootElement.querySelector<HTMLElement>(bodyElementSelector)
        if (!bodyElement || !bodyElement.textContent) return

        const chatMessage: ChatMessage = {
            type: messageType,
            environment,
            twitchId,
            bodyText: bodyElement.textContent,
            rootElement,
            nameElement,
            bodyElement,
            pronounsTargetElement: nameElement.closest(pronounsTargetSelector) as HTMLElement | null,
        }
        callback(chatMessage)
    }

    const handleAddedNode = (node: Node) => {
        if (!(node instanceof HTMLElement)) return

        if (node.matches(anyEnvironmentMessageSelector)) examineMessage(node)
        node.querySelectorAll<HTMLElement>(anyEnvironmentMessageSelector).forEach(examineMessage)
    }

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            mutation.addedNodes.forEach(handleAddedNode)
        }
    })

    observer.observe(document.body, { childList: true, subtree: true })
}
