<template>
  <div class="theme-switch" :title="isDark ? '切换到浅色' : '切换到深色'">
    <el-switch
      v-model="isDark"
      :active-color="activeColor"
      :inactive-color="inactiveColor"
      active-icon-class="el-icon-moon"
      inactive-icon-class="el-icon-sunny"
      @change="onChange"
    />
  </div>
  
</template>

<script>
import { applyTheme, getCurrentTheme } from '../../utils/theme';

export default {
  name: 'ThemeSwitch',
  data() {
    const dark = getCurrentTheme() === 'dark';
    return {
      isDark: dark,
      activeColor: '#111827',
      inactiveColor: '#f3f4f6',
    };
  },
  methods: {
    onChange(value) {
      applyTheme(value ? 'dark' : 'light');
    }
  }
};
</script>

<style scoped>
.theme-switch /deep/ .el-switch__core {
  border-radius: 999px;
  border: 1px solid var(--card-border);
  box-shadow: var(--shadow-sm);
}
.theme-switch /deep/ .el-switch {
  --ring: 0 0 12px rgba(124,108,255,0.35);
}
.theme-switch /deep/ .is-checked .el-switch__core {
  box-shadow: var(--ring);
}
</style>


