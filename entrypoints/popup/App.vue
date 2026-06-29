<template lang="pug">
    .flex.flex-col.items-center.justify-center.w-96.p-4.gap-6
        a.flex.gap-2(href='https://pluralmind.chat' target='_blank')
            img.w-16(src='@/img/pluralmind-plurapus.webp' alt='Plurapus')
            img.w-48(src='@/img/pluralmind-logo.webp' alt='Pluralmind')

        label.label.text-sm.text-base-content(v-if='settingsReady')
            input.toggle.toggle-primary(type='checkbox' v-model='settings.showUsernames')
            | Show Twitch usernames on proxied messages

        p.opacity-80.text-sm.text-center
            | Want to set up your system's headmates?<br />
            | Head over to&nbsp;
            a.text-primary(href='https://pluralmind.chat' target='_blank') the Pluralmind website
            | .
</template>

<script lang="ts" setup>
import { useSettings } from '@/pluralmind/settings'

const { settings, settingsReady } = useSettings()
</script>
