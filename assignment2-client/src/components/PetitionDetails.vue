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
                    <b-navbar-item  v-if="this.isLoggedIn" v-on:click="goToPage('/profile')">
                        My Profile
                    </b-navbar-item>
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
                    <strong>Petition Details:</strong> <hr/>
                    <strong>Petition ID:</strong> {{this.petitionId}}<br/>
                    <strong>Petition Author Details:</strong>
                    <template>
                        <b-table :data="authorData" :columns="authorColumns"></b-table>
                    </template><hr/>
                    <strong>Name:</strong> {{this.petition.title}}<hr/>
                    <strong>Description:</strong> <br/>{{this.petition.description}}<br/><br/>
                    <strong>Signature Count:</strong> <br/> {{this.petition.signatureCount}}<br/><br/>
                    <strong>Created Date:</strong> <br/>{{this.petition.createdDate}}<br/><br/>
                    <strong>Closing Date:</strong> <br/>{{this.petition.closingDate}}<br/><br/>
                    <Strong>Hero Image:</strong><br/>
                        <img :src="this.heroImage" alt="No Hero Image"/>
                    <hr/>
                    <template>
                        <b-table :data="signatoryData" :columns="signatoryColumns"></b-table>
                    </template><hr/>
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
                authorData: [],
                authorColumns: [
                    {
                        field: 'name',
                        label: 'Author Name',
                        centered: true
                    },
                    {
                        field: 'heroImage',
                        label: 'Hero Image',
                        centered: true,
                        value: "No Image Provided"
                    },
                    {
                        field: 'city',
                        label: 'City',
                        centered: true,
                        value: "No City Provided"
                    },
                    {
                        field: 'country',
                        label: 'Country',
                        centered: true,
                        value: "No Country Provided"
                    }
                ],

                signatoryData: [],
                signatoryColumns: [
                    {
                        field: 'signatoryId',
                        label: 'Signatory ID',
                        width: '40',
                        numeric: true,
                        centered: true
                    },
                    {
                        field: 'name',
                        label: 'Name',
                        centered: true
                    },
                    {
                        field: 'city',
                        label: 'City',
                        centered: true
                    },
                    {
                        field: 'country',
                        label: 'Country',
                        centered: true
                    },
                    {
                        field: 'signedDate',
                        label: 'Date Signed',
                        centered: true
                    }
                ],
                //have petitionId start off as the full url pathname
                isLoggedIn: (tokenStore !== undefined),
                petitionId: null,
                //for buefy functionality
                profileViewing: "petition-profile",
                open: true,
                fullheight: true,
                toUpdate: false,
                heroImage: null,
                //get user data here
                petition: null

            };
        },
        async mounted() {
            this.userId = tokenStore.state.userId;
            let url = window.location.pathname;
            this.petitionId = url.substring(url.lastIndexOf('/') + 1);
            await server.get('/api/v1/petitions/'.concat(this.petitionId)).then(response => {
                if (response.status === 200) {
                    this.petition = response.data;
                    console.log(response.data);
                } else {
                    console.log(response);
                }
            }).catch(error => {
                console.error(error);
            });

            await server.get(`/api/v1/petitions/${this.petitionId}/photo`, {responseType : 'blob'}).then(response => {
                console.log(response.data);
                this.heroImage = URL.createObjectURL(response.data);
                console.log(response.data.heroImage);
            }).catch(error => {console.error(error)});

            await server.get(`/api/v1/petitions/${this.petitionId}/signatures`)
                .then(response => {
                    console.log(response.data);
                    this.signatoryData = response.data
                }).catch(error => {
                    console.error(error);
            });
            console.log(this.petition.authorId);

            await server.get(`/api/v1/users/${this.petition.authorId}`)
                .then(response => {
                    console.log(response.data);
                    if (response.data.heroImage === null) {
                        response.data.push({"heroImage": "No Profile Image"});
                    }
                    this.authorData.push(response.data);

                }).catch(error => {
                console.error(error);
            });
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