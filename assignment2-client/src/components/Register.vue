<template>
    <div id="app">
        <div>
            <div class="container">
                <div class="row">
                    <div class="col-sm-6 offset-sm-3">
                        <Header />
                        <router-view></router-view>
                    </div>
                </div>
            </div>
        </div>
        <link href="https://fonts.googleapis.com/css?family=Roboto&display=swap" rel="stylesheet">
        <h1><br/><br/></h1>
        <header class="masthead">
            <div class="container h-100">
                <div class="row h-100 align-items-center">
                    <div class="col-12 text-center">
                        <h1 class="font-weight-light">Welcome to Signalign</h1>
                        <p class="lead">Sign the future</p>
                        <h1 class="font-weight-light">
                            Register with us<br/>
                        </h1>
                    </div>
                </div>
            </div>
        </header>
        <!-- post hides data in the url bar
            v-on:submit.prevent means when you click login then the emit wont only stay for a second
            keeps it in the vue extension logs, wont know until later if we need this to go away
        -->

        <form method="post" v-on:submit.prevent="registerUser">
            <div class="form-group">
                <!-- full-name field-->
                <label id="first-name-label" for="name">Name: </label>
                <input type="text" class="form-control" v-model="name" id="name" name="name" placeholder="Your Name...">
            </div>
            <div class="form-group">
                <!-- email field -->
                <label id="email-label" for="email">Email Address: </label>
                <input type="email" class="form-control" v-model="email" id="email" name="email" placeholder="Your Email Address...">
            </div>
            <div class="form-group">
                <!-- password field-->
                <label id="password-label" for="password">Password: </label>
                <input type="password" class="form-control" v-model="password" id="password" name="password" placeholder="Your Password...">
            </div>
            <div class="form-group">
                <!-- country field-->
                <label id="country-label" for="country">Country: </label>
                <input type="text" class="form-control" v-model="country" id="country" name="country" placeholder="Eg: New Zealand">
            </div>
            <div class="form-group">
                <!-- city field-->
                <label id="city-label" for="city">City: </label>
                <input type="text" class="form-control" v-model="city" id="city" name="city" placeholder="Eg: Christchurch">
            </div>
            <div class="form-group">
                <!-- Login and Register Buttons-->
                <button type="submit" class="btn btn-primary">Register</button>
                <router-link to="/login" class="btn btn-link">Login</router-link>
            </div>
        </form>
    </div>
</template>

<script>
    import server from '../Api'
    import {tokenStore} from "../main";

    export default {
        name: "NewUser",
        data() {
            return {
                name: '',
                email: '',
                password: null,
                country: null,
                city: null
            }
        },
        methods: {
            generateToken() {
                let x = Math.random().toString(36).substr(2);
                let y = Math.random().toString(36).substr(2);
                return x + y; //should return a random string 31 chars long (nums and chars)
            },
            async registerUser() {
                // Save the data as a newUser object
                const newUser = {
                    name: this.name.trim(),
                    email: this.email.trim(),
                    password: this.password.trim(),
                    country: this.country.trim(),
                    city: this.city.trim()
                };

                // The HTTP Post Request
                await server.post('/api/v1/users/register',
                    newUser,
                    {
                        headers: {"content-type": "application/json"}
                    }
                ).then(response => { //If successfully registered the response will have a status of 201
                    if (response.status === 201) {
                        console.log('User Registered Successfully!');
                        tokenStore.setToken(this.generateToken());
                        this.$router.push('/profile'); //Routes to profile on successful register
                    }
                }).catch(error => {
                    console.error(error);
                });
            }
        }
    }

</script>

<style>
</style>