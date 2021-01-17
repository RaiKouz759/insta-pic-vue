<template>
    <div class="post">
        <div class="header level">
            <span class="username">{{post.username}}</span>
        </div>
    <div class="image-container">
        <img :src="post.imageString" alt="">
    </div>
    <div class="content">
        <p class="caption"><span>{{post.username}}</span> {{post.caption}}</p>
    </div>
    </div>
</template>

<script>
    export default {
        name: "Post",
        props: {
            post: Object
        }
    }
</script>

<style lang="css" scoped>

.post {
    padding-top: 10px;
}

.header {
    height: 30px;
    border-bottom: 1px solid #fff;
    margin: 7.5px 10px;
}

img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.username {
    position: relative;
    top: 3px;
    padding-left: 5px;
    font-size: 0.9rem;
    font-weight: bold;
}

.level {
    margin-bottom: 0.5rem !important;
}

.image-container {
    height: 440px;
    background-repeat: no-repeat; 
    /* dont repeat images to cover the width */
    background-position: center center;
    background-size: cover;
}

.content {
    margin: 7.5px 10px;
}

.caption {
    font-size: 0.85rem;
}

.caption > span {
    font-weight: bold;
}

.post:last-child {
    margin-bottom: 150px;
}

</style>