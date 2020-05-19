<template>
    <div>
        <div>
            <b-navbar>
                <template slot="brand">
                    <b-navbar-item tag="router-link" :to="{ path: '/about' }">
                        <h1>About Petitions</h1>
                    </b-navbar-item>
                </template>
                <template slot="start">
                    <b-navbar-item v-on:click="goToPage('/petitions')">
                        View Petitions
                    </b-navbar-item>
                </template>
            </b-navbar>
        </div>
        <section><br/><br/><br/>

            <h2 class="text-center">Login to your Petitions Account</h2>
        <br/>
            <b-field label="Email">
                <b-input type="email"
                         v-model="email"
                         placeholder="john@doe.com" required>
                </b-input>
            </b-field>
            <b-field label="Password">
                <b-input v-model="password"
                         type="password"
                         placeholder="Password"
                         password-reveal
                         required>
                </b-input>
            </b-field>
            <b-field class="buttons">
                <b-button type="is-primary" v-on:click="login">Login</b-button>
                <b-button type="is-primary" outlined v-on:click="goToPage('/register')">Register</b-button>
            </b-field>
        </section>
    </div>
</template>

<style scoped>
    h2 {
        font-size: x-large;

        text-align: center;
    }
    section {
        position: relative;
        width: 60%;
        padding-left: 40%;
    }

    .buttons {
        padding-right: 50px;
    }

</style>

<script>
    import server from '../Api';
    import {tokenStore} from "../main";
    async function validUser(userLogin) {
        return (userLogin.email !== '' && userLogin.password !== '')
    }
    export default {
        name: "Login",
        data() {
            return {
                email: '',
                password: '',
                message: null
            }
        },
        methods: {
            goToPage(page) {
                this.$router.push(page);
            },
            async login() {
                const userLogin = {
                    email: this.email.trim(),
                    password: this.password.trim()
                };
                let valid = await validUser(userLogin);
                if (!valid) {
                    return valid;
                }
                // Send login post to serve
                server.post('/api/v1/users/login',
                    userLogin,
                    {
                        headers: {"content-type": "application/json"}
                    }
                ).then(response => { //If successfully logged the response will have a status of 201
                    if (response.status === 200) {
                        console.log('User Logged In Successfully!');
                        tokenStore.setToken(response.data['token']);
                        tokenStore.setUserId(response.data['userId']);
                        console.log(tokenStore.state.token);
                        this.$router.push("/profile"); //Route to profile screen on successful login
                    } else {
                        console.log(response.status);
                    }
                }).catch(error => { //If an error occurs during login (includes server side errors)
                    console.log(error);
                    //Get alert bar element
                    this.message = error.message;
                });
            }
        }
    }
</script>
