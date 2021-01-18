
<template>
    <div v-if="loading" class="loading-div" >
      <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
    </div>
    <div class="app-body">
      <div class="app-header">
        <!-- <a @click="testToken">Test Token</a> -->
        <img src="../assets/InstaPicLogo.png">
        <span id="userLabel" v-if="isLoggedIn && step === 1">{{currentUser.username}} | <a @click="logout">Logout</a>
        </span>
        <a v-if="step === 2" class="cancel-cta"
          @click="goToHome">Cancel</a>
        <a class="next-cta" v-if="step === 2" 
          @click="sharePost">Share</a>
      </div>
      <feed-body :posts="posts"
                 :image="image"
                 :step="step"
                 v-on:updateCaption="updateCaption"/>
      <div class="app-footer">
        <div class="home-cta">
          <i @click="goToHome" class="fas fa-home fa-lg"></i>
       </div>
       <div class="upload-cta">
         <input type="file"
           name="file"
           id="file"
           accept=".png, .jpg, .jpeg"
           class="inputfile"
           @change="uploadImage"/>
          <label for="file">
              <i class="far fa-plus-square fa-lg"></i>
          </label>
       </div>
      </div>
    </div>
</template>

<script>
// this is the home page and the main feed page of the app
// import the feed-body
import feedBody from "./FeedBody.vue"
// this is for testing purposes, replace with getting data at the created lifecycle hook
// import posts from "../data/posts.js" // this imports an array of post objects

// function convertToBlobUrl(imagLink) {
//     fetch(imagLink).then(response => {
//         return response.blob();
//     }).then((myBlob) => {
//         return URL.createObjectURL(myBlob);
//     }).catch(err => {
//       console.log(err.message)
//     });
// }
// import axios from 'axios';

export default {
  components: {
    "feed-body": feedBody,
  },
  data() {
    return {
      posts: [],
      image: "",
      caption: "",
      step: 1,
      signedIn: true,
      file: null,
      test_image: null,
      latestPostId: null,
      continueSubscribe: true,
      polling: null,
      current_username: '',
      loading: false,
      userId: 1, //later change this when implementing login
    }
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
    currentUser() {
      // console.log(this.$store.getters.currentUser);
      return this.$store.getters.currentUser;
    }
  },
  created() {
    // initialize the landing page here
    // get latest 10? posts and load them into posts
    console.log('im created');
    (async () =>{
      await this.getLatestPosts(50); 
      this.polling = setInterval(() => {
        this.subscribe();
      }, 2000);
    })();
    // this.current_username = this.$store.state.user.username;
    //subscribe to the server to check for updates


  },
  beforeUnmount() {
    this.posts.forEach(post => {
      URL.revokeObjectURL(post.imageString);
      // console.log('unmounting')
    })
    clearInterval(this.polling);
  },
  methods: {
    testToken() {
        this.$http.post('http://127.0.0.1:5000/api/post/testToken').then((resp) => {
        console.log(resp.data);
      }).catch((err) => {
        console.log(err.response.data);
        console.log(err)
        throw err
      })
    },
    logout() {
      this.$store.dispatch('logout')
      .then(() => {
        this.$router.push('/login')
      });
      clearInterval(this.polling);
    },
    uploadImage(e) {
      const files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.file = files[0];
      this.image = URL.createObjectURL(this.file);

      this.step = 2;

      // To enable reuploading of same file in Chrome
      document.querySelector('#file').value = "";
    },
    goToHome() {
      this.step = 1;
      this.image = "";
    },
    updateCaption(value) {
      this.caption = value;
    },
    async sharePost() {
      try {
          if(!this.image) {
            this.goToHome();
            return;
          }
          this.loading = true;
          let blob = await fetch(this.image);
          blob = await blob.blob();
          let form = new FormData();
          form.append('file', blob, this.file?.name);
          form.append('caption', this.caption);
          form.append('userId', this.currentUser.user_id);
          // console.log(this.caption);
          let responseJson = await this.$http.post(process.env.VUE_APP_SUBMIT_POST, 
            form,
          );
          console.log(responseJson.status);

      } catch (err) {
          console.log(err.message);
          console.log(err.stack);
      } finally {
          // console.log('finally: go back to home');
          this.goToHome();
          this.loading = false;
      }
    },
    async b64toBlob(base64, type = 'image/jpg') {
      let res = await fetch(`data:${type};base64,${base64}`);
      let blob = await res.blob();
      
      return blob
    }
    ,
    async getLatestPosts(numPosts) {
        // get latest posts from the db and unshift the post array to slot it in
        await fetch(process.env.VUE_APP_GET_LATEST + `${numPosts}`).then( response => {
            return response.json();
        }).then(async (myJson) => {
            const allPromises = myJson.map(async (value) =>{
              let blob = await this.b64toBlob(value.imageString);
              value.imageString = URL.createObjectURL(blob);
            })
            await Promise.all(allPromises);
            for (let post of myJson) {
              this.posts.push(post);
            }
          }).then(() => {
            if (this.posts) {
             this.updateLatestPostId();
           }
          }).catch((err) => {
            console.log(err.message)
            console.log(err.stack)
        })
    },
    async subscribe() {
      try{
        // subscribe to server for updates
        console.log('start subscribing');
        // console.log(!this.continueSubscribe);
        console.log(this.latestPostId)
        if (!this.continueSubscribe || this.latestPostId === null) return;
        console.log('passed subcribe check');
        let form = new FormData();
        form.append('latestId', this.latestPostId);
        let response = await this.$http.post(process.env.VUE_APP_SUBSCRIBE, form);
        // let response = await fetch("http://127.0.0.1:5000/api/post/subscribe", {
        //   method: "POST",
        //   body: form
        //   });
        if(response.status == 502) {
          // timeout error, reconnect
          throw new Error('timeout error');
        }
        else if (response.status != 200) {
          console.log(response.statusText);
          // reconnect in one second
          // await new Promise(resolve => setTimeout(resolve, 1000));
          // throw new Error('error')
        } else {
          // get posts and add to the posts array
          let json = response.data
          const allPromises = json.map(async (value) =>{
            let blob = await this.b64toBlob(value.imageString);
            value.imageString = URL.createObjectURL(blob);
          })
          await Promise.all(allPromises);
          for (let post of json) {
            this.posts.unshift(post);
            }
          this.updateLatestPostId();
          // await new Promise(resolve => setTimeout(resolve, 1000));
          // throw new Error('start again');
        }
      } catch(error){
        // console.log(error.message);
        // await new Promise(resolve => setTimeout(resolve, 1000));
        // restart for all cases
        // await this.subscribe();
      }
    },
    updateLatestPostId() {
      if(this.posts){
        this.latestPostId = this.posts[0].id;
        console.log(`The latest post id is ${this.latestPostId}`);
      }
    }
  },
}
</script>

<style lang="css" scoped>

.app-body {
  background-color: white;
  height: 100%;
  width: 500px;
  margin: 0 auto;
}

.app-header {
  height: 70px;
  background: #fafafa;
  border-bottom: 1px solid #eeeeee;
  position: fixed;
  width: 500px;
  top: 0;
  z-index: 99;
}

img {
  max-width: 150px;
  display: block;
  margin: 0 auto; 
  /* margin 0 auto horizontally centers element within parent */
  padding-top: 2px;
}

#userLabel {
  float: right;
  padding-right: 5px;
  font-weight: bold;
}

.app-footer {
  height: 50px;
  width: 500px;
  position: fixed;
  bottom: 0;
  background: #fafafa;

}

.home-cta {
  position: absolute;
  left: 10px;
  top: 15px;
  cursor: pointer;
}

.upload-cta {
  position: absolute;
  right: 10px;
  top: 15px;

}

input[name="file"] {
  visibility: hidden;
}

label {
  cursor: pointer;
  z-index: 99;
}

.cancel-cta, .next-cta {
  position: absolute;
  top:17px;
  color: #209cee;
  font-weight: bold;
  cursor: pointer;
}

.cancel-cta {
  left: 10px;
}

.next-cta {
  right: 10px;
}

.lds-ring {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}

.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 64px;
  height: 64px;
  margin: 8px;
  border: 8px solid #fff;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #fff transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.loading-div {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 1000;
  background: rgba(0,0,0,0.5);
  display: grid;
  place-items: center;
}

</style>