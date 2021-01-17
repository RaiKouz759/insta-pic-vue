<template>
    <div id="loginDiv">
        <form class="login-form" @submit.prevent="login">
            <img src="../assets/InstaPicLogo.png" alt="">
            <div class="field">
                <label for="username" class="label">Username</label>
                <div class="control">
                    <input type="text" name="username" v-model="username" class="input is-small"/>
                </div>
            </div>
            <div class="field">
                <label for="password" class="label">Password</label>
                <div class="control">
                    <input type="password" name="password" v-model="password" class="input is-small">
                </div>
            </div>
            <div class="field button-div">
                    <button class="button is-dark" style="width: ">Login</button>
                    <span class="no-account-span"> Don't have an account? <br><router-link to="/register">Sign up</router-link></span>                
            </div>
                <div class="errors">
                <p v-if="errors.length">
                    <ul>
                        <li v-for="error in errors" :key="error"
                            class="error-text">{{error}}</li>
                    </ul>
                </p>
            </div>
        </form>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                username: '',
                password: '',
                errors: []
            }
        },
        methods: {
            login() {
                if (!this.checkForm()) return;
                let username = this.username;
                let password = this.password;
                this.$store.dispatch('login', {username, password})
                .then(() => this.$router.push('/'))
                .catch(err => {
                    console.log(err.statusCode)
                    if (err.statusCode == 401) {
                        this.errors.push('Wrong credentials.');
                    }
                });
                console.log('finish logging in');
            },
            checkForm() {
                // check form before submitting. 
                // input validation 
                this.errors = [];

                if (!this.username) {
                    this.errors.push('Username required.');
                }
                if (!this.password) {
                    this.errors.push('Password is required.')
                }
                else if ( this.password.length < 6) {
                    this.errors.push('Password length needs to be at least 6.')
                }
                if (this.errors.length > 0) return false;

                return true;
            }
        },
    }
</script>

<style lang="css" scoped>
#loginDiv {
  background-color: white;
  height: 100%;
  width: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-form {
    width: 300px;
}

img {
    display: block;
    max-width: 100%;
    padding-bottom: 27px;
}

.button-div {
    display: flex;
    align-items: center;
    width: 100%;
}

.no-account-span {
    padding-left: 30px;
    width: 100%;
}

.error-text {
    font-weight: bold;
}


</style>