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
                    <b-navbar-item  v-if="this.isLoggedIn" v-on:click="goToPage('/profile/edit')">
                        Edit Profile
                    </b-navbar-item>
                    <b-navbar-item v-on:click="goToPage('/petitions')">
                        View Petitions
                    </b-navbar-item>
                </template>

                <template slot="end" v-if="this.isLoggedIn">
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
                Petition Details: <br/>
                <div class="notification text-center">
                    Petition Details: <br/>
                    Petition ID: {{this.petitionId}}<br/>
                    Name: {{this.petition.title}}<br/>
                    Description: <br/>{{this.petition.description}}<br/><br/>
                    Author: {{this.petition.authorName}}<br/> <!--put in a table for author details-->

                    <!--Need also, HERO IMAGE, NUM SIGNATURES,
                    CATEGORY, CREATED DATE, CLOSING DATE, LIST OF SIGNATORIES-->

                </div>

            </div>
        </section>
    </div>
</template>

<script>
    import server from "../Api";
    import {tokenStore} from "../main";
    export default {
        name: "PetitionDetails",
        data() {
            return {
                //have petitionId start off as the full url pathname
                isLoggedIn : (tokenStore.state.token !== null),
                petitionId: null,
                //for buefy functionality
                profileViewing: "petition-profile",
                open: true,
                fullheight: true,
                toUpdate: false,

                //get user data here
                petition: null

            };
        },
        mounted() {
            let url = window.location.pathname;
            this.petitionId = url.substring(url.lastIndexOf('/') + 1);
            server.get('/api/v1/petitions/'.concat(this.petitionId)).then(response => {
                if (response.status === 200) {
                    this.petition = response.data;
                    console.log(response.data);
                } else {
                    console.log(response);
                }
            }).catch(error => {
                console.error(error);
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
<style scoped>
</style>