<template>
    <div class="dashboard-container" />
</template>

<script>
export default {
    name: 'Dashboard',
    beforeCreate () {
        const accessedRoutes = this.$store.getters.accessedRoutes;
        const path = accessedRoutes[0].path;
        this.$router.replace(path);
    }
};
</script>

<style lang="scss" scoped>
</style>
