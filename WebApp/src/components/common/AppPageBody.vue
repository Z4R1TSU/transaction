<template>
    <div class="main-container">
        <div class="main-content">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: "PageBody"
    }
</script>

<style scoped>
    .main-container{
        margin-top: 104px; /* Account for floating header (64px + 16px top + 24px gap) */
        display: flex;
        justify-content: center;
        padding: 0 16px 32px 16px; 
        background-color: var(--color-bg); 
        min-height: 100vh; 
    }
    .main-content{
        width: 100%;
        max-width: 1280px; /* Consistent max-width with header */
        background-color: var(--color-bg-card);
        min-height: calc(100vh - 136px); 
        padding: 32px; 
        border-radius: var(--radius-lg); 
        border: 1px solid var(--color-border);
        box-shadow: var(--shadow-sm); 
    }
</style>