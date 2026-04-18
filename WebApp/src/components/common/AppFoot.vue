<template>
    <div class="foot-container">
        <div class="author">二手交易平台 <a target="_blank" href="https://github.com/Z4R1TSU/transaction">@XuZhelei</a></div>
    </div>
</template>

<script>
    export default {
        name: "Foot"
    }
</script>

<style scoped>
    .foot-container {
        width: 100%;
        display: flex;
        justify-content: center;
        height: 60px;
        padding-top: 20px;
        background-color: var(--color-bg);
    }

    .author {
        color: var(--color-text-muted);
        font-size: 14px;
        font-weight: 500;
    }
    
    .author a {
        color: var(--color-primary);
        text-decoration: none;
        transition: color var(--transition-normal);
    }
    
    .author a:hover {
        color: var(--color-primary-dark);
    }
</style>