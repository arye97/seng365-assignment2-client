<template>
    <div>
        <div>
            <b-navbar>
                <template slot="brand">
                    <b-navbar-item>
                        <h1>Petitions</h1>
                    </b-navbar-item>
                </template>
                <template slot="start">
                    <b-navbar-item v-on:click="goToPage('/petitions')">
                        View Petitions
                    </b-navbar-item>
                    <b-navbar-item v-if="this.isLoggedIn" v-on:click="goToPage('/profile')">
                        My Profile
                    </b-navbar-item>
                </template>
                <template slot="end">
                    <b-navbar-item tag="div">
                        <div class="buttons" v-if="isLoggedIn">
                            <a class="button is-primary" v-on:click="logout">
                                Logout
                            </a>
                        </div>
                        <div class="buttons" v-if="!isLoggedIn">
                            <a class="button is-primary" v-on:click="goToPage('/Register')">
                                <strong>Sign up</strong>
                            </a>
                            <a class="button is-light" v-on:click="goToPage('/login')">
                                Log in
                            </a>
                        </div>
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
    async function validUser(userLogin) {
        return (userLogin.email !== '' && userLogin.password !== '')
    }
    export default {
        name: "Login",
        data() {
            return {
                isLoggedIn : false,
                email: '',
                password: '',
                message: null
            }
        },
        mounted() {
            if (sessionStorage.getItem('token') !== null && sessionStorage.getItem('token') !== "null") {
                this.isLoggedIn = true;
            }

        },
        methods: {
            goToPage(page) {
                this.$router.push(page);
            },
            async logout() {
                let token = sessionStorage.getItem('token');
                this.isLoggedIn = false;
                await server.post('/api/v1/users/logout', null,
                    {headers: {"content-type": "application/json", 'X-Authorization': token}
                    }
                ).then(response => {
                    console.log(response);
                    console.log('User logged out successfully!');
                    sessionStorage.setItem('token', null);
                    sessionStorage.clear();
                    this.$router.push('/'); //routes back to login
                }).catch(error => {
                    console.error(error);
                    console.log("User already logged out.");
                    sessionStorage.setItem('token', null);
                    sessionStorage.clear();
                    this.$router.push('/'); //still get them out
                })
            },
            async login() {
                if (this.isLoggedIn) {
                    this.$buefy.snackbar.open({message: `Sorry, you need to logout before you can log in as someone else.`, duration: 5000, type: "is-danger"});
                    return
                }
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
                        sessionStorage.setItem('token', response.data['token']);
                        sessionStorage.setItem('userId', response.data['userId']);
                        this.$buefy.snackbar.open({position: "is-bottom" ,message: `Logged in successfully!`, duration: 5000, type: "is-success"});
                        this.$router.push("/profile"); //Route to profile screen on successful login
                    } else {
                        console.log(response.status);
                    }
                }).catch(error => { //If an error occurs during login (includes server side errors)
                    console.log(error);
                    //Get alert bar element
                    this.$buefy.snackbar.open({message: `Could not log in, email or password may be incorrect`, duration: 5000, type: "is-danger"});
                    this.message = error
                });
            }
        }
    }
</script>
