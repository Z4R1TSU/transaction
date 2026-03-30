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
        margin-top: 80px; 
        display: flex;
        justify-content: center;
        padding-bottom: 30px; 
        background-color: transparent; 
        min-height: calc(100vh - 80px); 
    }
    .main-content{
        width: 100%;
        max-width: 1200px; 
        background-color: transparent;
        min-height: calc(90vh - 80px); 
        padding: 0; 
    }
</style>