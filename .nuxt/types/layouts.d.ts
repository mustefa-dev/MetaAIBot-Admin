import auth from "C:/Users/musta/RiderProjects/MetaAIBot-Admin/app/layouts/auth.vue";
import dashboard from "C:/Users/musta/RiderProjects/MetaAIBot-Admin/app/layouts/dashboard.vue";
import _default from "C:/Users/musta/RiderProjects/MetaAIBot-Admin/app/layouts/default.vue";
import type { ComputedRef, MaybeRef } from 'vue'
declare module 'nuxt/app' {
  interface NuxtLayouts {
    'auth': InstanceType<typeof auth>['$props'],
    'dashboard': InstanceType<typeof dashboard>['$props'],
    'default': InstanceType<typeof _default>['$props'],
}
  export type LayoutKey = keyof NuxtLayouts extends never ? string : keyof NuxtLayouts
  interface PageMeta {
    layout?: MaybeRef<LayoutKey | false> | ComputedRef<LayoutKey | false>
  }
}