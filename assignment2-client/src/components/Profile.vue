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
                <b-navbar-item v-on:click="goToPage('/profile/edit')">
                    Edit Profile
                </b-navbar-item>
                <b-navbar-item v-on:click="goToPage('/petitions')">
                    View Petitions
                </b-navbar-item>
                <b-navbar-item v-on:click="goToPage('/petitions/create')">
                    Create Petition
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
    <section :key="this.user.name" v-if="this.user">
        <div class="container">
            <div class="notification text-center">
                Welcome to your Petitions Account <strong> {{this.user.name}} </strong>
            </div>
        </div><br/>
        <div class="container">
            <div class="notification text-center">
                Your details: <br/>
                Your profile ID: {{this.profileId}}<br/>
                Name: {{this.user.name}}<br/>
                City: {{this.user.city}}<br/>
                Country: {{this.user.country}}<br/>
                <div class="text-center" v-if="this.user.email">
                    Email: {{this.user.email}}<br/>
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
        name: "Profile",
        data() {
            return {
                profileId: tokenStore.state.userId,
                //for buefy functionality
                profileViewing: "user-profile",
                open: true,
                fullheight: true,
                toUpdate: false,

                //get user data here
                user: null

            };
        },
        mounted() {

            if (tokenStore === undefined) { //then there's no stored token
                this.$router.push('/'); //routes back to login
            } else {
                console.log(tokenStore.state.token, tokenStore.state.userId)
            }
            //get user details

            server.get('/api/v1/users/'.concat(tokenStore.state.userId),
                {headers: {'X-Authorization' : tokenStore.state.token}
                }).then(response => {
                    if (response.status === 200) {
                        this.user = response.data;
                        console.log(response.data);
                    } else {
                        console.log(response);
                    }
            }).catch(error => {
                console.error(error);
                tokenStore.setUserId(null);
                tokenStore.setToken(null);
                this.$router.push('/login');
            })



        },
        methods: {

            goToPage(endpoint) {
                this.$router.push(endpoint);
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
<style lang="scss">
    .b-table-sticky-header {
        position: sticky;
    }

</style>