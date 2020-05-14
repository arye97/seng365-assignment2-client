<template>
    <div>
        <section>
            <b-navbar>
                <template slot="brand">
                    <b-navbar-item tag="router-link" :to="{ path: '/about' }">
                        <h1>About Petitions</h1>
                    </b-navbar-item>
                </template>
                <template slot="start">
                    <b-navbar-item v-on:click="goToPage('/profile')">
                        My Profile
                    </b-navbar-item>
                    <b-navbar-item v-on:click="goToPage('/petitions')">
                        View Petitions
                    </b-navbar-item>
                </template>

                <template slot="end">
                    <b-navbar-item tag="div">
                        <div class="buttons">
                            <a class="button is-primary" v-on:click="logout">
                                <strong>Logout</strong>
                            </a>
                        </div>
                    </b-navbar-item>
                </template>
            </b-navbar>
        </section>
        <!--Beginning the actual user profile-->
        <br/><br/>
        <section>
            <div class="container">
                <div class="notification text-center">
                    Edit your account details
                </div>
            </div><br/>
            <div class="container">
                    <div class="notification">
                        <div class="content">

                            <section>
                                <b-field label="Name">
                                    <b-input v-model="name" placeholder="Barry Berkman"></b-input>
                                </b-field>

                                <b-field label="Email">
                                    <b-input v-model="email" type="email" placeholder="barry@block.com"></b-input>
                                </b-field>

                                <b-field label="New Password">
                                    <b-input v-model="password" placeholder="Your new password" ></b-input>
                                </b-field>

                                <b-field label="Current Password">
                                    <b-input v-model="currentPassword" placeholder="Your current password"></b-input>
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
                                </b-field><br/>
                                <b-button type="is-primary" outlined v-on:click="updateDetails">Update Details</b-button>
                            </section>
                        </div>
                    </div>

                </div>
        </section>
    </div>
</template>

<script>
    import server from "../Api";
    import {tokenStore} from "../main";
    export default {
        name: "EditProfile",
        data() {
            return {
                //for updating user details
                name: null,
                email: null,
                country: null,
                city: null,
                password: null,
                currentPassword: null,
                updatedDetails: {},
                //for buefy functionality
                profileViewing: "user-profile",
                open: true,
                fullheight: true,
                toUpdate: false,

                //get user data here
                user: null

            };
        },
        methods: {

            goToPage(endpoint) {
                this.$router.push(endpoint);
            },
            async updateDetails () {
                console.log(tokenStore.state.token);
                if (this.name !== null) {this.updatedDetails['name'] = this.name}
                if (this.email !== null) {this.updatedDetails['email'] = this.email}
                if (this.password !== null) {this.updatedDetails['password'] = this.password}
                if (this.currentPassword !== null) {this.updatedDetails['currentPassword'] = this.currentPassword}
                if (this.city !== null) {this.updatedDetails['city'] = this.city}
                if (this.country !== null) {this.updatedDetails['country'] = this.country}
                await server.patch('/api/v1/users/'.concat(tokenStore.state.userId), this.updatedDetails,
                    {headers: {"content-type": "application/json", 'X-Authorization': tokenStore.state.token}}
                ).then(response => {
                    Promise.resolve(response);
                    this.toUpdate = true;
                    this.$buefy.snackbar.open({position: "is-bottom" ,message: `User details saved successfully`, duration: 3500, type: "is-success"});
                    this.$router.push('/profile');
                }).catch(error => {
                    console.error(error);
                    this.$buefy.snackbar.open({message: `Error saving changes, could not update`, duration: 2000, type: "is-danger"});

                })
            },
            async logout() {
                await server.post('/api/v1/users/logout', null,
                    {headers: {"content-type": "application/json", 'X-Authorization': tokenStore.state.token}
                    }
                ).then(response => {
                    console.log(response);
                    console.log('User logged out successfully!');
                    tokenStore.setToken(null);
                    this.$router.push('/'); //routes back to login
                }).catch(error => {
                    console.error(error);
                    console.log("User already logged out.");
                    tokenStore.setToken(null);
                    this.$router.push('/'); //still get them out
                })
            }
        }
    };
</script>

<style scoped>

</style>