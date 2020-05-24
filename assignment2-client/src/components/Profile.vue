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
                <div class="text-center">
                    Hero Image: <img :src="this.heroImage" alt="No Hero Image" /><br/>
                </div>
            </div>

        </div>
    </section>
    </div>
</template>

<script>
    import server from "../Api";
    export default {
        name: "Profile",
        data() {
            return {
                profileId: sessionStorage.getItem('userId'),
                //for buefy functionality
                profileViewing: "user-profile",
                open: true,
                fullheight: true,
                toUpdate: false,
                //get user data here
                user: null,
                heroImage: null
            };
        },
        mounted() {
            let token = sessionStorage.getItem('token');
            if (token === null) { //then there's no stored token
                this.$router.push('/'); //routes back to login
            }
            //get user details

            server.get('/api/v1/users/'.concat(this.profileId),
                {headers: {'X-Authorization' : token}
                }).then(response => {
                    if (response.status === 200) {
                        this.user = response.data;
                    } else {
                        console.log(response);
                    }
            }).catch(error => {
                console.error(error);
                sessionStorage.setItem('userId', null);
                sessionStorage.setItem('token', null);
                this.$router.push('/login');
            })

            server.get(`/api/v1/users/${this.profileId}/photo`,
                {responseType : 'blob', headers: {'X-Authorization' : token}})
                .then(response => {
                    this.heroImage = URL.createObjectURL(response.data);
            }).catch(error => {console.error(error)});

        },
        methods: {

            goToPage(endpoint) {
                this.$router.push(endpoint);
            },
            async logout() {
                let token = sessionStorage.getItem('token');
                await server.post('/api/v1/users/logout', null,
                    {headers: {"content-type": "application/json", 'X-Authorization': token}
                    }
                ).then(response => {
                    console.log(response);
                    console.log('User logged out successfully!');
                    sessionStorage.setItem('token', null);
                    this.$router.push('/'); //routes back to login
                }).catch(error => {
                    console.error(error);
                    console.log("User already logged out.");
                    sessionStorage.setItem('token', null);
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