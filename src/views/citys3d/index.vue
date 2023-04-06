<template>
    <div>
        <scene3d />
        <el-button type="primary" @click="$router.back()">返回</el-button>
    </div>
</template>

<script>
import scene3d from '@/components/ThreeD/scene3d.vue';
export default {
    name: 'Login',
    components: {
        scene3d
    },
    data () {
        return {};
    }
};
</script>

<style lang="scss" scoped>

</style>
