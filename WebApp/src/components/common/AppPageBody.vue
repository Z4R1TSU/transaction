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
        margin-top: 80px; /* Increased margin-top to account for taller header */
        display: flex;
        justify-content: center;
        padding-bottom: 20px; /* Add some padding at the bottom */
        background-color: #f4f6f8; /* Lighter background for the page body */
        min-height: calc(100vh - 80px); /* Adjust min-height */
    }
    .main-content{
        width: 100%;
        max-width: 1200px; /* Consistent max-width with header */
        background-color: #ffffff;
        min-height: calc(90vh - 80px); /* Adjust min-height */
        padding: 20px; /* Add padding inside the content area */
        border-radius: 8px; /* Rounded corners for the content area */
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); /* Subtle shadow for content area */
    }
</style>