import type { ChatMessageType, ChatMessage } from './types'

type ChatMessageCallback = (chatMessage: ChatMessage) => void

const liveMessageSelector = '.chat-line__message[data-a-user]'
const vodMessageSelector = '.vod-message'
const nameElementSelector = '.chat-author__display-name[data-a-user]'
const bodyElementSelector = '.text-fragment[data-a-target="chat-message-text"]'

export const observeChatMessages = (callback: ChatMessageCallback) => {
    const examineMessage = (nameElement: HTMLElement) => {
        if (!nameElement.dataset.aUser) return

        const username: string = nameElement.dataset.aUser
        const rootElement = nameElement.closest(`${liveMessageSelector}, ${vodMessageSelector}`) as HTMLElement | null
        if (!rootElement) return

        const messageType: ChatMessageType = rootElement.matches(liveMessageSelector) ? 'live' : 'vod'
        const bodyElement = rootElement.querySelector<HTMLElement>(bodyElementSelector)
        if (!bodyElement || !bodyElement.textContent) return

        const chatMessage: ChatMessage = {
            type: messageType,
            username,
            bodyText: bodyElement.textContent,
            rootElement,
            nameElement,
            bodyElement,
        }
        callback(chatMessage)
    }

    const handleAddedNode = (node: Node) => {
        if (!(node instanceof HTMLElement)) return

        if (node.matches(nameElementSelector)) examineMessage(node)
        node.querySelectorAll<HTMLElement>(nameElementSelector).forEach(examineMessage)
    }

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            mutation.addedNodes.forEach(handleAddedNode)
        }
    })

    observer.observe(document.body, { childList: true, subtree: true })
}
