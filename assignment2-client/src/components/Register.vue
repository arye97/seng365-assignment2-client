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
                <template slot="end">
                    <b-navbar-item tag="div">
                        <div class="buttons">
                            <a class="button is-primary">
                                <strong>Sign up</strong>
                            </a>
                            <a class="button is-light">
                                Log in
                            </a>
                        </div>
                    </b-navbar-item>
                </template>
            </b-navbar>
        </div>
    <section>

        <br/><br/>
        <h2 class="text-center">Register for Petitions!</h2>
        <b-field label="Name *">
            <b-input v-model="name" placeholder="Jeff Winger" required></b-input>
        </b-field>

        <b-field label="Email *">
            <b-input v-model="email" type="email" placeholder="jeff@greendale.com" required></b-input>
        </b-field>

        <b-field label="Password *">
            <b-input v-model="password" placeholder="Must be more than 8 characters and be alphanumeric" required></b-input>
        </b-field>

        <b-field label="City">
            <b-input type="text"
                     v-model="city"
                     placeholder="Christchurch">
            </b-input>
        </b-field>

        <b-field label="Country">
            <b-input type="text"
                     v-model="country"
                     placeholder="New Zealand">
            </b-input>
        </b-field>
        <b-field label="Fields marked * are required!"></b-field>
        <b-field class="buttons">
            <b-button type="is-primary" v-on:click="registerUser">Register</b-button>
            <b-button type="is-primary" outlined v-on:click="goToPage('/login')">Login</b-button>
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


</style>

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
            goToPage(page) {
                this.$router.push(page);
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
                        tokenStore.setToken(response.data['token']);
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