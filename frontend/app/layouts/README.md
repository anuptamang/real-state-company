# layouts

> Nuxt provides a layouts framework to extract common UI patterns into reusable layouts.

<tip icon="i-lucide-rocket">

For best performance, components placed in this directory will be automatically loaded via asynchronous import when used.

</tip>

## Enable Layouts

Layouts are enabled by adding [`<NuxtLayout>`](/docs/4.x/api/components/nuxt-layout) to your [`app.vue`](/docs/4.x/guide/directory-structure/app/app):

```vue [app/app.vue]
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

To use a layout:

- Set a `layout` property in your page with [definePageMeta](/docs/4.x/api/utils/define-page-meta).
- Set the `name` prop of `<NuxtLayout>`.

<note>

The layout name is normalized to kebab-case, so `someLayout` becomes `some-layout`.

</note>

<note>

If no layout is specified, `app/layouts/default.vue` will be used.

</note>

<important>

If you only have a single layout in your application, we recommend using [`app.vue`](/docs/4.x/guide/directory-structure/app/app) instead.

</important>

<important>

Unlike other components, your layouts must have a single root element to allow Nuxt to apply transitions between layout changes - and this root element cannot be a `<slot />`.

</important>

## Default Layout

Add a `~/layouts/default.vue`:

```vue [app/layouts/default.vue]
<template>
  <div>
    <p>Some default layout content shared across all pages</p>
    <slot />
  </div>
</template>
```

In a layout file, the content of the page will be displayed in the `<slot />` component.

## Named Layout

```bash [Directory Structure]
-| layouts/
---| default.vue
---| custom.vue
```

Then you can use the `custom` layout in your page:

```vue [pages/about.vue]twoslash
<script setup lang="ts">
definePageMeta({
  layout: "custom",
});
</script>
```

<read-more to="/docs/4.x/guide/directory-structure/app/pages#page-metadata">

Learn more about `definePageMeta`.

</read-more>

You can directly override the default layout for all pages using the `name` property of [`<NuxtLayout>`](/docs/4.x/api/components/nuxt-layout):

```vue [app/app.vue]
<script setup lang="ts">
// You might choose this based on an API call or logged-in status
const layout = "custom";
</script>

<template>
  <NuxtLayout :name="layout">
    <NuxtPage />
  </NuxtLayout>
</template>
```

If you have a layout in nested directories, the layout's name will be based on its own path directory and filename, with duplicate segments being removed.

<table>
<thead>
  <tr>
    <th>
      File
    </th>
    
    <th>
      Layout Name
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        ~/layouts/desktop/default.vue
      </code>
    </td>
    
    <td>
      <code>
        desktop-default
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        ~/layouts/desktop-base/base.vue
      </code>
    </td>
    
    <td>
      <code>
        desktop-base
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        ~/layouts/desktop/index.vue
      </code>
    </td>
    
    <td>
      <code>
        desktop
      </code>
    </td>
  </tr>
</tbody>
</table>

For clarity, we recommend that the layout's filename matches its name:

<table>
<thead>
  <tr>
    <th>
      File
    </th>
    
    <th>
      Layout Name
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        ~/layouts/desktop/DesktopDefault.vue
      </code>
    </td>
    
    <td>
      <code>
        desktop-default
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        ~/layouts/desktop-base/DesktopBase.vue
      </code>
    </td>
    
    <td>
      <code>
        desktop-base
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        ~/layouts/desktop/Desktop.vue
      </code>
    </td>
    
    <td>
      <code>
        desktop
      </code>
    </td>
  </tr>
</tbody>
</table>

<link-example to="/docs/4.x/examples/features/layouts">

</link-example>

## Changing the Layout Dynamically

You can also use the [`setPageLayout`](/docs/4.x/api/utils/set-page-layout) helper to change the layout dynamically:

```vuetwoslash
<script setup lang="ts">
function enableCustomLayout () {
  setPageLayout('custom')
}
definePageMeta({
  layout: false,
})
</script>

<template>
  <div>
    <button @click="enableCustomLayout">
      Update layout
    </button>
  </div>
</template>
```

<link-example to="/docs/4.x/examples/features/layouts">

</link-example>

## Overriding a Layout on a Per-page Basis

If you are using pages, you can take full control by setting `layout: false` and then using the `<NuxtLayout>` component within the page.

<code-group>

```vue [app/pages/index.vue]
<script setup lang="ts">
definePageMeta({
  layout: false,
});
</script>

<template>
  <div>
    <NuxtLayout name="custom">
      <template #header> Some header template content. </template>

      The rest of the page
    </NuxtLayout>
  </div>
</template>
```

```vue [app/layouts/custom.vue]
<template>
  <div>
    <header>
      <slot name="header"> Default header content </slot>
    </header>
    <main>
      <slot />
    </main>
  </div>
</template>
```

</code-group>

<important>

If you use `<NuxtLayout>` within your pages, make sure it is not the root element (or [disable layout/page transitions](/docs/4.x/getting-started/transitions#disable-transitions)).

</important>
