<template>
    <div class="feed-body">
        <div v-if="step === 1" class="feed">
            <Post v-for="post in posts"
                :post="post"
                :key="posts.indexOf(post)">
            </Post>
        </div>
        <div v-if="step === 2">
            <div id="selected-image" class="selected-image">
                <img :src="image" alt="No image uploaded">
            </div>
            <div class="caption-container">
                <textarea class="caption-input"
                  placeholder="Write a caption..."
                  rows="7"
                  :value="caption"
                  @input="updateValue($event.target.value)"></textarea>
                  <!-- <input type="text" :value="caption" @input="updateValue($event.target.value)"> -->
            </div>
            <!-- <a @click="checkSomething">click me</a> -->
        </div>


    </div>
</template>

<script>
    import Post from "./Post.vue";
    export default {
        name: "FeedBody",
        props: {
            posts: Array,
            step: Number,
            image: String,
            value: String
        },
        components: {
            Post
        },
        methods: {
            checkSomething() {
                console.log(this.image);
            },
            updateValue(value) {
                this.$emit('updateCaption', value);
            },
        },
    }
</script>

<style lang="css" scoped>

.feed-body {
    padding-top: 70px;
    height: 100%;
    width: 100%
}

.feed {
    height: 100%;
    width: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none;  /* Internet Explorer 10+ */
}

.feed::-webkit-scrollbar {
    width: 0;
    height: 0;
}

.selected-image {
    height: 440px;
}

img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.caption-container {
    padding-top: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.caption-container > textarea {
    border: 0;
    font-size: 1rem;
    width: 100%;
    padding: 10px;
    border-bottom: 1px solid #eeeeee;
}

textarea:focus {
    outline: 0;
}



</style>