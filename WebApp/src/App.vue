<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>
<style>
    :root {
        --color-primary: #3B82F6; /* blue-500 */
        --color-primary-light: #60A5FA; /* blue-400 */
        --color-primary-dark: #2563EB; /* blue-600 */
        --color-text: #0F172A; /* slate-900 */
        --color-text-secondary: #475569; /* slate-600 */
        --color-text-muted: #64748B; /* slate-500 */
        --color-bg: #F8FAFC; /* slate-50 */
        --color-bg-card: #FFFFFF;
        --color-border: #E2E8F0; /* slate-200 */
        --color-border-light: #F1F5F9; /* slate-100 */
        --color-danger: #EF4444; /* red-500 */
        
        --radius-sm: 6px;
        --radius-md: 8px;
        --radius-lg: 12px;
        --radius-full: 9999px;
        
        --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        
        --transition-fast: 0.15s ease;
        --transition-normal: 0.2s ease;
        --transition-slow: 0.3s ease;

        --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        --font-heading: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    }

    html, body, #app{
        overflow: visible;
        background-color: var(--color-bg);
        font-family: var(--font-sans);
        color: var(--color-text);
        margin: 0;
        padding: 0;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
    
    * {
        box-sizing: border-box;
    }

    /* Global Element UI Overrides for Modern Look */
    .el-button {
        border-radius: var(--radius-md) !important;
        font-weight: 500 !important;
        transition: all var(--transition-normal) !important;
    }
    .el-button--primary {
        background-color: var(--color-primary) !important;
        border-color: var(--color-primary) !important;
    }
    .el-button--primary:hover {
        background-color: var(--color-primary-light) !important;
        border-color: var(--color-primary-light) !important;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }
    .el-input__inner {
        border-radius: var(--radius-md) !important;
        border: 1px solid var(--color-border) !important;
        background-color: var(--color-bg) !important;
        color: var(--color-text) !important;
        transition: all var(--transition-normal) !important;
    }
    .el-input__inner:focus {
        border-color: var(--color-primary) !important;
        background-color: var(--color-bg-card) !important;
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1) !important;
    }
    .el-textarea__inner {
        border-radius: var(--radius-md) !important;
        border: 1px solid var(--color-border) !important;
        background-color: var(--color-bg) !important;
        transition: all var(--transition-normal) !important;
    }
    .el-textarea__inner:focus {
        border-color: var(--color-primary) !important;
        background-color: var(--color-bg-card) !important;
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1) !important;
    }
    .el-card {
        border-radius: var(--radius-lg) !important;
        border: 1px solid var(--color-border) !important;
        box-shadow: var(--shadow-md) !important;
        background-color: var(--color-bg-card) !important;
    }
    .el-dialog {
        border-radius: var(--radius-lg) !important;
        box-shadow: var(--shadow-lg) !important;
        overflow: hidden;
    }
    .el-dialog__header {
        padding: 24px !important;
        border-bottom: 1px solid var(--color-border-light);
    }
    .el-dialog__title {
        font-weight: 700 !important;
        color: var(--color-text) !important;
    }
    .el-table {
        border-radius: var(--radius-md) !important;
        overflow: hidden !important;
        border: 1px solid var(--color-border-light) !important;
    }
    .el-table th.el-table__cell {
        background-color: var(--color-bg) !important;
        color: var(--color-text-secondary) !important;
        font-weight: 600 !important;
        border-bottom: 1px solid var(--color-border-light) !important;
    }
    .el-table td.el-table__cell {
        border-bottom: 1px solid var(--color-border-light) !important;
    }
    .el-message {
        border-radius: var(--radius-md) !important;
        box-shadow: var(--shadow-md) !important;
        border: none !important;
    }
    .el-pagination.is-background .el-pager li:not(.disabled).active {
        background-color: var(--color-primary) !important;
        color: #fff !important;
        border-radius: var(--radius-md) !important;
    }
    .el-pagination.is-background .el-pager li {
        border-radius: var(--radius-md) !important;
        background-color: var(--color-bg) !important;
        border: 1px solid var(--color-border) !important;
    }
</style>