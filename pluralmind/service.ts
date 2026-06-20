import { getSystem, type System, type TwitchId } from 'pluralmind'

export class PluralMindService {
    getSystem(id: TwitchId): Promise<System | null> {
        return getSystem(id)
    }
}
