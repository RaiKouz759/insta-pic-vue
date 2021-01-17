<template>
    <div id="loginDiv">
        <form class="login-form" @submit.prevent="register">
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
            <div class="field">
                <label for="pasword-confirm" class="label">Confirm Password</label>
                <div class="control">
                    <input type="password" name="password-confirm" v-model="passwordConfirmation" class="input is-small">
                </div>
            </div>             
            <div class="field is-grouped">
                <p class="control">
                    <button class="button is-dark">Register</button>
                </p>
                <p class="control">
                    <router-link to="/" class="button">Cancel</router-link>
                </p>
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
                passwordConfirmation: '',
                errors: []
            }
        },
        methods: {
            register() {
                if(!this.checkForm()) return;
                // form is validated
                let register_data = {
                    username: this.username,
                    password: this.password
                };
                this.$store.dispatch('register', register_data)
                .then(() => this.$router.push('/'))
                .catch(err => {
                    console.log(err);
                    if (err.statusCode == 401) {
                        this.errors.push('User already exists.');
                    }
                });
            },
            checkForm() {
                // input validation 
                this.errors = [];

                if (!this.username) {
                    this.errors.push('Username required.');
                }
                if (!this.password || !this.passwordConfirmation) {
                    this.errors.push('Password required in both fields.')
                } else if ( this.password.length < 6) {
                    this.errors.push('Password length needs to be at least 6.')
                }
                if (this.password !== this.passwordConfirmation) {
                    this.errors.push('Passwords do not match.')
                }
                if (this.errors.length > 0 ) return false;

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