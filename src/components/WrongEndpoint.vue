<template>
    <div class="error-div">
        <div class="error-text-div">
            <span class="error-code-text">404</span>
        </div>
        <div style="text-align: center;">
        <router-link to="/">Back to home</router-link>
        </div>
    </div>
</template>

<script>
export default {
    
}
</script>


<style lang="css" scoped>
.error-code-text {
    font-size: 72px;
    font-weight: bold;
}

.error-text-div {
    text-align: center;
}
</style>