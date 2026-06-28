import { getSystem, type System, type TwitchId } from 'pluralmind'

export class PluralmindService {
    getSystem(id: TwitchId): Promise<System | null> {
        return getSystem(id)
    }
}
