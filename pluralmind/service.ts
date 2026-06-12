import type { System, TwitchId } from './types'

const CACHE_DURATION = 15 * 60 * 1000 // 15 minutes

interface CachedSystem {
    system: System | null
    timestamp: number
}

const pendingFetches: Record<TwitchId, Promise<System | null>> = {}
const systemCache: Record<TwitchId, CachedSystem> = {}

export class PluralMindService {
    async fetchSystem(id: TwitchId): Promise<System | null> {
        // Check if we already have a fresh enough copy of this system
        const cached = systemCache[id]
        const now = Date.now()
        if (cached && now - cached.timestamp < CACHE_DURATION) return cached.system

        // We need fresh data, check if there's already a pending fetch for this system
        if (id in pendingFetches) return await pendingFetches[id]

        // Load the system's info fresh
        pendingFetches[id] = new Promise(async (resolve) => {
            const response = await fetch(`https://pluralmind.chat/api/system/${id}`)
            const system = response.ok ? (await response.json()) : null
            systemCache[id] = { system, timestamp: now }
            resolve(system)
            delete pendingFetches[id]
        })
        return await pendingFetches[id]
    }
}
