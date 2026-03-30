<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>
<style>
    /* Global Reset & Modern Typography */
    :root {
        --primary-color: #ff4d4f;
        --primary-hover: #ff7875;
        --secondary-color: #faad14;
        --bg-color: #f4f6f9;
        --surface-color: #ffffff;
        --text-primary: #1f2225;
        --text-secondary: #5c6b77;
        --text-tertiary: #8b9aab;
        --border-color: #e8eaec;
        --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.04);
        --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.08);
        --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);
        --radius-md: 12px;
        --radius-lg: 16px;
    }

    html, body {
        overflow-x: hidden;
        background-color: var(--bg-color);
        /* Modern subtle mesh gradient */
        background-image: 
            radial-gradient(at 0% 0%, rgba(255, 77, 79, 0.06) 0px, transparent 50%),
            radial-gradient(at 100% 0%, rgba(250, 173, 20, 0.05) 0px, transparent 50%),
            radial-gradient(at 100% 100%, rgba(255, 77, 79, 0.06) 0px, transparent 50%),
            radial-gradient(at 0% 100%, rgba(250, 173, 20, 0.05) 0px, transparent 50%);
        background-attachment: fixed;
        margin: 0;
        padding: 0;
        min-height: 100vh;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: var(--text-primary);
    }

    #app {
        min-height: 100vh;
        /* Subtle dot pattern texture overlay */
        background-image: radial-gradient(rgba(0, 0, 0, 0.04) 1px, transparent 1px);
        background-size: 24px 24px;
    }

    /* Element UI Theme Overrides for Modern Look */
    .el-button {
        font-weight: 600 !important;
        border-radius: 8px !important;
        transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1) !important;
    }
    
    .el-button--primary {
        background-color: var(--primary-color) !important;
        border-color: var(--primary-color) !important;
        box-shadow: 0 4px 10px rgba(255, 77, 79, 0.2);
    }
    .el-button--primary:hover, .el-button--primary:focus {
        background-color: var(--primary-hover) !important;
        border-color: var(--primary-hover) !important;
        transform: translateY(-1px);
        box-shadow: 0 6px 14px rgba(255, 77, 79, 0.3);
    }
    
    .el-button--danger {
        background-color: var(--primary-color) !important;
        border-color: var(--primary-color) !important;
    }
    .el-button--danger:hover {
        background-color: var(--primary-hover) !important;
        border-color: var(--primary-hover) !important;
    }

    .el-button--warning {
        background-color: var(--secondary-color) !important;
        border-color: var(--secondary-color) !important;
        color: #fff !important;
    }

    .el-button.is-plain {
        background: var(--surface-color) !important;
    }

    .el-input__inner {
        border-radius: 8px !important;
        border: 1px solid var(--border-color) !important;
        transition: all 0.3s;
    }
    .el-input__inner:focus {
        border-color: var(--primary-color) !important;
        box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.1) !important;
    }

    .el-card {
        border-radius: var(--radius-lg) !important;
        border: none !important;
        box-shadow: var(--shadow-md) !important;
    }

    .el-tabs__item {
        font-size: 16px !important;
        font-weight: 500 !important;
        color: var(--text-secondary) !important;
    }
    .el-tabs__item.is-active, .el-tabs__item:hover {
        color: var(--primary-color) !important;
    }
    .el-tabs__active-bar {
        background-color: var(--primary-color) !important;
        height: 3px !important;
        border-radius: 3px;
    }
    .el-tabs__nav-wrap::after {
        background-color: var(--border-color) !important;
    }

    .el-pagination.is-background .el-pager li {
        border-radius: 6px !important;
        font-weight: 600;
    }
    .el-pagination.is-background .el-pager li:not(.disabled).active {
        background-color: var(--primary-color) !important;
        box-shadow: 0 2px 6px rgba(255, 77, 79, 0.3);
    }

    /* Beautiful Scrollbar */
    ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
    }
    ::-webkit-scrollbar-track {
        background: transparent;
    }
    ::-webkit-scrollbar-thumb {
        background-color: rgba(144, 147, 153, 0.3);
        border-radius: 10px;
    }
    ::-webkit-scrollbar-thumb:hover {
        background-color: rgba(144, 147, 153, 0.5);
    }
</style>