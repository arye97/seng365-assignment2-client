<template>
    <div id="app">
        <h1><br/><br/><br/></h1>
        <link href="https://fonts.googleapis.com/css?family=Roboto&display=swap" rel="stylesheet">
        <!-- Full Page Image Header with Vertically Centered Content -->
        <header class="masthead">
            <div class="container h-100">
                <div class="row h-100 align-items-center">
                    <div class="col-sm-12 text-center">
                        <h1 class="font-weight-light">Login</h1>
                        <form @submit.prevent="login">
                            <div class="form-group">
                                <label for="email">Email Address: </label>
                                <input type="email" class="form-control" v-model="email" id="email" placeholder="Email Address"><br/>
                                <div class="form-group ">
                                    <label for="password">Password: </label>
                                    <input type="password" class="form-control" v-model="password" id="password" placeholder="Password"> <br/>
                                </div>
                                <div class="form-group">
                                    <router-link to="/register" class="btn btn-link">Register</router-link>
                                    <input v-on:submit="login" class="btn btn-primary" type="submit" value="Sign In">

                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </header>
    </div>
</template>

<style>
    form {
        font-family: 'Roboto', sans-serif;
        width: 75%;
        padding-left: 25%;
    }
</style>

<script>
    import server from '../Api';
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
                server.post('/login',
                    userLogin,
                    {
                        headers: {"Access-Control-Allow-Origin": "*", "content-type": "application/json"},
                        withCredentials: true
                    }
                ).then(response => { //If successfully logged the response will have a status of 201
                    if (response.status === 201) {
                        console.log('User Logged In Successfully!');
                        //tokenStore.setToken(response.data);
                        this.$router.push("/profile"); //Route to profile screen on successful login
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
