import 'vue-router';

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
