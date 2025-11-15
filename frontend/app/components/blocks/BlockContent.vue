<script setup lang="ts">
interface Props {
  content?: string;
}

defineProps<Props>();
</script>

<template>
  <section class="w-full py-16 px-4 bg-background">
    <div class="max-w-4xl mx-auto prose prose-lg dark:prose-invert prose-headings:font-bold prose-headings:text-foreground prose-p:text-foreground prose-a:text-primary prose-a:no-underline prose-a:hover:underline prose-strong:text-foreground prose-strong:font-semibold prose-ul:text-foreground prose-ol:text-foreground prose-li:text-foreground prose-blockquote:border-primary prose-blockquote:text-muted-foreground prose-code:text-foreground prose-code:bg-muted prose-pre:bg-muted prose-img:rounded-lg">
      <div v-html="content" />
    </div>
  </section>
</template>
