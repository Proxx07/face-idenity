<script setup lang="ts">
import { navigation } from '@/router/navigation.ts';
</script>

<template>
  <nav>
    <ul>
      <li v-for="route in navigation" :key="route.name">
        <router-link :to="route.link" class="link">
          {{ route.name }}
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<style scoped lang="scss">
nav ul {
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  gap: 1rem;
  justify-content: center;
  .link {
    display: inline-block;
    text-decoration: none;
    padding: 1rem;
    border: 1px solid var(--black);
    border-radius: .5rem;
    font-size: 2rem;
    color: var(--black);
    &:hover {
      background: var(--black);
      color: var(--white);
    }
  }
}
</style>
