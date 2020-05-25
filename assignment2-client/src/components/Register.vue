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
            <b-input type="password" v-model="password" placeholder="Must be more than 8 characters and be alphanumeric" required></b-input>
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
        <b-field label="Upload a Hero Image"></b-field>
        <b-field  class="file">
            <b-upload v-model="heroImage">
                <a class="button is-primary">
                    <b-icon icon="upload"></b-icon>
                    <span>Click to upload</span>
                </a>
            </b-upload>
            <span class="file-name" v-if="heroImage">
                                    {{ heroImage.name }}
                                </span>
        </b-field>
        <b-button v-if="heroImage" type="is-danger"
                  icon-right="delete" v-on:click="removeHeroImage">
            Remove selection
        </b-button>

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

    export default {
        name: "NewUser",
        data() {
            return {
                name: '',
                email: '',
                password: null,
                country: null,
                city: null,
                heroImage: null
            }
        },
        mounted() {
            if (sessionStorage.getItem('token') !== null) {
                sessionStorage.clear();
            }
        },
        methods: {
            goToPage(page) {
                this.$router.push(page);
            },
            validateImageType(photo) {
                if (photo === null) {return false}
                let validTypes = ["image/jpeg", "image/gif", "image/png"];
                if (!validTypes.includes(photo.type)) {
                    this.$refs['file-input'].reset;
                }
                return true
            },
            async removeHeroImage () {
                this.heroImage = null;
            },
            async registerUser() {
                // Save the data as a newUser object
                const newUser = {
                    name: this.name.trim(),
                    email: this.email.trim(),
                    password: this.password.trim(),
                    country: this.country.trim(),
                    city: this.city.trim(),
                    heroImage: "Loading"
                };

                // The HTTP Post Request
                await server.post('/api/v1/users/register',
                    newUser,
                    {
                        headers: {"content-type": "application/json"}
                    }
                ).then(async response => { //If successfully registered the response will have a status of 201
                    console.log('User Registered Successfully!');
                    sessionStorage.setItem('token', response.data['token']);
                    this.$buefy.snackbar.open({position: "is-bottom" ,message: `Registered successfully`, duration: 5000, type: "is-success"});
                }).catch(error => {
                    console.error(error);
                    this.$buefy.snackbar.open({position: "is-bottom" , message: `Error has occurred during registration, try again later`, duration: 5000, type: "is-danger"});
                });
                await server.post('/api/v1/users/login',
                    {email: this.email.trim(), password: this.password.trim()},
                    {
                        headers: {"content-type": "application/json"}
                    }
                ).then(response => { //If successfully logged the response will have a status of 201
                    if (response.status === 200) {
                        console.log('User Logged In Successfully!');
                        sessionStorage.setItem('token', response.data['token']);
                        sessionStorage.setItem('userId', response.data['userId']);
                    } else {
                        console.log(response.status);
                    }
                }).catch(error => { //If an error occurs during login (includes server side errors)
                    console.log(error);
                });

                let userId = sessionStorage.getItem('userId');
                let token = sessionStorage.getItem('token');

                if (this.validateImageType(this.heroImage)) {
                    await server.put(`/api/v1/users/${userId}/photo`,
                        this.heroImage,
                        {headers: {"content-type": this.heroImage.type, 'X-Authorization': token}
                        }).then(response => {
                        console.log(response);
                        })
                        .catch(error => {
                            console.error(error);
                        });
                }

                await this.$router.push("/profile"); //Route to profile screen on successful login
            }
        }
    }

</script>

<style>
</style>