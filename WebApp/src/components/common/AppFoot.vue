<template>
    <div class="foot-container">
        <div class="footer-content">
            <div class="author">
                二手交易平台 &copy; {{ new Date().getFullYear() }} 
                <span class="divider">|</span>
                <a target="_blank" href="https://github.com/Z4R1TSU/transaction" class="github-link">
                    Project Repo
                </a>
            </div>
        </div>
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
        margin-top: 40px;
        padding: 30px 0;
        background: var(--bg-elevated);
        border-top: 1px solid var(--card-border);
    }

    .footer-content {
        max-width: 1200px;
        margin: 0 auto;
        text-align: center;
    }

    .author {
        color: var(--text-secondary);
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
    }
    
    .divider {
        color: var(--card-border);
    }
    
    .github-link {
        color: var(--text-secondary);
        text-decoration: none;
        transition: color 0.2s;
        display: flex;
        align-items: center;
        gap: 6px;
    }
    
    .github-link:hover {
        color: var(--brand);
    }
</style>