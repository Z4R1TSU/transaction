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
        margin-top: 96px;
        display: flex;
        justify-content: center;
        padding-bottom: 20px;
        background-color: transparent;
        min-height: calc(100vh - 80px);
    }
    .main-content{
        width: 100%;
        max-width: 1200px;
        background-color: var(--card-bg);
        min-height: calc(90vh - 80px);
        padding: 20px; /* Add padding inside the content area */
        border-radius: var(--radius-md);
        border: 1px solid var(--card-border);
        box-shadow: var(--shadow-sm);
    }
</style>