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
        margin-top: 120px; /* Increased to account for the larger, floating pill header */
        display: flex;
        justify-content: center;
        padding: 0 24px 48px 24px; 
        background-color: transparent; 
        min-height: 100vh; 
    }
    .main-content{
        width: 100%;
        max-width: 1400px; 
        background-color: var(--color-bg-card);
        min-height: calc(100vh - 168px); 
        padding: 48px; 
        border-radius: 32px; 
        border: 1px solid var(--color-border-light);
        box-shadow: var(--shadow-lg); 
        transition: box-shadow var(--transition-normal);
    }
    .main-content:hover {
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
    }
</style>