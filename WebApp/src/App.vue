<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>
<style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

    :root {
        /* Vibrant & Premium Color Palette */
        --color-primary: #6366F1; /* Indigo 500 */
        --color-primary-light: #818CF8; /* Indigo 400 */
        --color-primary-dark: #4338CA; /* Indigo 700 */
        --color-secondary: #EC4899; /* Pink 500 */
        --color-text: #0F172A; /* Slate 900 */
        --color-text-secondary: #334155; /* Slate 700 */
        --color-text-muted: #64748B; /* Slate 500 */
        --color-bg: #F8FAFC; /* Slate 50 */
        --color-bg-card: #FFFFFF;
        --color-border: #E2E8F0; /* Slate 200 */
        --color-border-light: #F1F5F9; /* Slate 100 */
        --color-danger: #F43F5E; /* Rose 500 */
        
        --radius-sm: 8px;
        --radius-md: 12px;
        --radius-lg: 20px;
        --radius-full: 9999px;
        
        /* Modern Shadows */
        --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05);
        --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
        --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04);
        --shadow-glow: 0 0 20px rgba(99, 102, 241, 0.3);
        --shadow-glow-pink: 0 0 20px rgba(236, 72, 153, 0.3);
        
        /* Glassmorphism */
        --glass-bg: rgba(255, 255, 255, 0.75);
        --glass-border: rgba(255, 255, 255, 0.5);
        
        --transition-fast: 0.15s cubic-bezier(0.4, 0, 0.2, 1);
        --transition-normal: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        --transition-slow: 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        --transition-bounce: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);

        --font-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        --font-heading: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    }

    html, body, #app{
        overflow-x: hidden;
        background-color: var(--color-bg);
        background-image: 
            radial-gradient(circle at 15% 50%, rgba(99, 102, 241, 0.03), transparent 25%),
            radial-gradient(circle at 85% 30%, rgba(236, 72, 153, 0.03), transparent 25%);
        font-family: var(--font-sans);
        color: var(--color-text);
        margin: 0;
        padding: 0;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        min-height: 100vh;
    }
    
    * {
        box-sizing: border-box;
    }

    /* Custom Premium Scrollbar */
    ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }
    ::-webkit-scrollbar-track {
        background: transparent;
    }
    ::-webkit-scrollbar-thumb {
        background: #CBD5E1;
        border-radius: var(--radius-full);
    }
    ::-webkit-scrollbar-thumb:hover {
        background: #94A3B8;
    }

    /* Global Element UI Overrides for Modern Look */
    .el-button {
        border-radius: var(--radius-full) !important;
        font-weight: 600 !important;
        font-family: var(--font-sans) !important;
        transition: all var(--transition-bounce) !important;
        letter-spacing: 0.2px;
    }
    .el-button--primary {
        background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light)) !important;
        border: none !important;
        color: white !important;
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2) !important;
    }
    .el-button--primary:hover {
        transform: translateY(-2px) scale(1.02);
        box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3) !important;
    }
    .el-input__inner {
        border-radius: var(--radius-full) !important;
        border: 2px solid transparent !important;
        background-color: #F1F5F9 !important;
        color: var(--color-text) !important;
        font-family: var(--font-sans) !important;
        font-weight: 500;
        transition: all var(--transition-normal) !important;
    }
    .el-input__inner:focus {
        background-color: var(--color-bg-card) !important;
        border-color: var(--color-primary-light) !important;
        box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1) !important;
    }
    .el-textarea__inner {
        border-radius: var(--radius-md) !important;
        border: 2px solid transparent !important;
        background-color: #F1F5F9 !important;
        font-family: var(--font-sans) !important;
        transition: all var(--transition-normal) !important;
    }
    .el-textarea__inner:focus {
        background-color: var(--color-bg-card) !important;
        border-color: var(--color-primary-light) !important;
        box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1) !important;
    }
    .el-card {
        border-radius: var(--radius-lg) !important;
        border: 1px solid var(--color-border-light) !important;
        box-shadow: var(--shadow-md) !important;
        background-color: var(--color-bg-card) !important;
        transition: box-shadow var(--transition-normal) !important;
    }
    .el-card:hover {
        box-shadow: var(--shadow-lg) !important;
    }
    
    /* Animations */
    @keyframes fadeInUp {
        0% { opacity: 0; transform: translateY(20px); }
        100% { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-up {
        animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    
    @keyframes gradientBG {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
    .bg-animated-gradient {
        background: linear-gradient(-45deg, #6366F1, #EC4899, #8B5CF6, #3B82F6);
        background-size: 400% 400%;
        animation: gradientBG 15s ease infinite;
    }
</style>