import { cloneDeep, isEqual } from 'lodash-es'
import { onScopeDispose, ref, watch, type Ref } from 'vue'

import type { Settings } from './types'

export const settingsItem = storage.defineItem<Settings>('sync:settings', {
    fallback: {
        showUsernames: false,
    },
    version: 1,
})

export const useSettings = (): {
    settings: Ref<Settings | null>,
    settingsReady: Ref<boolean>,
    settingsPromise: Promise<void>
} => {
    const settingsReady = ref(false)
    const settings = ref(null) as Ref<Settings | null>

    // Prepare setting change handlers
    const onStoredSettingsChanged = (storedSettings: Settings) => {
        if (isEqual(settings.value, storedSettings)) return

        settings.value = cloneDeep(storedSettings)
    }

    const onSettingsChanged = async (newSettings: Settings | null) => {
        const storedSettings = await settingsItem.getValue()
        if (!newSettings || isEqual(storedSettings, newSettings)) return

        await settingsItem.setValue(cloneDeep(newSettings))
    }

    const settingsPromise = new Promise<void>((resolve) => {
        // Load existing settings from storage
        settingsItem.getValue().then((val) => {
            settings.value = cloneDeep(val)
            settingsReady.value = true

            // Register setting change handlers
            const unwatchStorage = settingsItem.watch(onStoredSettingsChanged)
            watch(settings, onSettingsChanged, { deep: true })

            // Clean up our storage watcher when we're unloaded
            onScopeDispose(() => {
                unwatchStorage()
            }, true)

            // Notify anyone that was waiting for us to be ready
            resolve()
        })
    })

    return { settings, settingsReady, settingsPromise }
}
