import 'vue-router';
import type {DefineLocaleMessage, IsEmptyObject, IsNever, RemovedIndexResources} from "vue-i18n";
import type {JsonPaths} from "@intlify/core-base";
import {MessageSchema} from "@/plugins/i18n/types";

declare module '*.vue' {
  import type { DefineComponent } from 'vue';

  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module 'vue-router' {
  interface RouteMeta {
    layout?: "Default" | "Empty"
  }
}

declare module '*.svg?raw' {
  const content: any;
  export default content;
}

declare module '*.svg' {
  const content: any;
  export default content;
}

declare module 'vue-i18n' {
  export interface DefineLocaleMessage extends MessageSchema{}
}

interface GlobalProperties {
  $tl: <
    Key extends string, DefinedLocaleMessage extends RemovedIndexResources<DefineLocaleMessage> = RemovedIndexResources<DefineLocaleMessage>,
    Keys = IsEmptyObject<DefinedLocaleMessage> extends false ? JsonPaths<{ [K in keyof DefinedLocaleMessage]: DefinedLocaleMessage[K] }> : never,
    ResourceKeys extends Keys = IsNever<Keys> extends false ? Keys : never,
  >(key: Key | ResourceKeys, params?: Record<string, string | number>) => string
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties extends GlobalProperties {}
}
