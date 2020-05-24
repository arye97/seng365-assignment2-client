<template>
    <div :key="this.signatureCount">
        <section>
            <b-navbar>
                <template slot="brand">
                    <b-navbar-item tag="router-link" :to="{ path: '/about' }">
                        <h1>About Petitions</h1>
                    </b-navbar-item>
                </template>
                <template slot="start">
                    <b-navbar-item  v-if="this.userId" v-on:click="goToPage('/profile')">
                        My Profile
                    </b-navbar-item>
                    <b-navbar-item  v-if="this.userId" v-on:click="goToPage('/profile/edit')">
                        Edit Profile
                    </b-navbar-item>
                    <b-navbar-item v-on:click="goToPage('/petitions')">
                        View Petitions
                    </b-navbar-item>
                </template>

                <template slot="end">
                    <b-navbar-item tag="div">
                        <div class="buttons" v-if="this.userId">
                            <a class="button is-primary"  v-on:click="logout">
                                <strong>Logout</strong>
                            </a>
                        </div>
                        <div class="buttons" v-else>
                            <a class="button is-primary"  v-on:click="goToPage('/register')">
                                <strong>Sign Up</strong>
                            </a>
                            <a class="button is-light"  v-on:click="goToPage('/login')">
                                <strong>Login</strong>
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
                    <strong>Petition Details:</strong> <hr/>
                    <strong>Petition ID:</strong> {{this.petitionId}}<br/>
                    <strong>Name:</strong> {{this.petition.title}}<hr/>
                    <strong>Description:</strong> <br/>{{this.petition.description}}<br/><br/>
                    <strong>Petition Author Details:</strong><br/>
                    <template>
                        <b-table :data="authorData">
                            <template slot-scope="props">
                                <template v-for="column in authorColumns">
                                    <b-table-column :key="column.authorName" v-if="column.isImage" v-bind="column">
                                        <template>
                                            <img :src="props.row.heroImage" height="100" width="100" alt="No Hero Image"/>
                                        </template>
                                    </b-table-column>
                                    <b-table-column v-else :key="column.petitionId" v-bind="column">
                                        {{ props.row[column.field] }}
                                    </b-table-column>
                                </template>
                            </template>
                        </b-table>
                    </template><hr/>
                    <strong>Created Date:</strong> <br/>{{this.petition.createdDate}}<br/><br/>
                    <strong>Closing Date:</strong> <br/>{{this.petition.closingDate}}<br/><br/>
                    <Strong>Hero Image:</strong><br/>
                    <img :src="this.heroImage" alt="No Hero Image"/>
                    <hr/>
                    <a class="button is-primary-outlined" size="larger" v-on:click="this.signPetition">
                        <strong>Sign Petition</strong>
                    </a><br/><br/>
                    <strong>Signature Count:</strong> <br/> {{this.petition.signatureCount}}<br/><br/>

                    <template>
                        <b-table :data="signatoryData">
                            <template slot-scope="props">
                                <template v-for="column in signatoryColumns">
                                    <b-table-column :key="column.name" v-if="column.isImage" v-bind="column">
                                        <template>
                                            <img :src="props.row.signatoryId" height="100" width="100" alt="No Hero Image"/>
                                        </template>
                                    </b-table-column>
                                    <b-table-column v-else :key="column.name" v-bind="column">
                                        {{ props.row[column.field] }}
                                    </b-table-column>
                                </template>
                            </template>
                        </b-table>
                    </template><hr/>


                    <b-button v-if="isMyPetition" type="is-danger"
                              icon-right="delete">
                        Delete
                    </b-button>

                </div>

            </div>
        </section>
    </div>
</template>

<script>
    import server from "../Api";
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
                        value: "No Image Provided",
                        isImage: true
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
                        field: 'profileImage',
                        label: 'Profile Image',
                        centered: true,
                        isImage: true
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
                isLoggedIn: (sessionStorage.getItem('token') !== null),
                petitionId: null,
                //for buefy functionality
                profileViewing: "petition-profile",
                open: true,
                fullheight: true,
                toUpdate: false,
                heroImage: null,
                //get user data here
                petition: null,
                isMyPetition: null,
                userId: null,
                signatureCount: 0
            };
        },
        async mounted() {
            let token = sessionStorage.getItem('token');
            let userId = sessionStorage.getItem('userId');
            if (token !== null) {
                this.userId = userId;
            }
            console.log(this.userId);
            let url = window.location.pathname;
            this.petitionId = url.substring(url.lastIndexOf('/') + 1);
            await server.get('/api/v1/petitions/'.concat(this.petitionId)).then(response => {
                if (response.status === 200) {
                    this.petition = response.data;
                    this.signatureCount = this.petition.signatureCount;
                } else {
                    console.log(response);
                }
            }).catch(error => {
                console.error(error);
            });

            await server.get(`/api/v1/petitions/${this.petitionId}/photo`, {responseType : 'blob'}).then(response => {

                this.heroImage = URL.createObjectURL(response.data);

            }).catch(error => {console.error(error)});

            await server.get(`/api/v1/petitions/${this.petitionId}/signatures`)
                .then(response => {
                    this.signatoryData = response.data
                    console.log(this.signatoryData)
                }).catch(error => {
                    console.error(error);
                });


            await server.get(`/api/v1/users/${this.petition.authorId}`)
                .then(response => {
                    let author = {
                        'name' : response.data.name,
                        'heroImage' : "No profile photo",
                        'city' : response.data.city,
                        'country' : response.data.country
                    };
                    this.authorData.push(author);

                }).catch(error => {
                    console.error(error);
                });
            //need to get signatories user profile pictures too urgh
            let j = 0;
            while (j < this.signatoryData.length) {
                let signerId = this.signatoryData[j]['signatoryId'];
                await server.get('api/v1/petitions/'.concat(signerId) + '/photo',
                    {responseType : 'blob'})
                    .then(response => {
                        this.signatoryData[j]['profileImage'] = URL.createObjectURL(response.data);
                    })
                    .catch(error => {
                        console.log(error)
                    });
                j++;
            }
            console.log(this.signatoryData);

            await server.get(`/api/v1/users/${this.petition.authorId}/photo`, {responseType : 'blob'})
                .then(response => {
                    this.authorData[0].heroImage = URL.createObjectURL(response.data);
                }).catch(error => {
                    console.error(error);
                });

            this.isMyPetition = (this.petition.authorId === this.userId);
        },
        methods: {
            goToPage(endpoint) {
                this.$router.push(endpoint);
            },
            async signPetition() {
                let token = sessionStorage.getItem('token');
                if (token === null) {
                    this.$buefy.snackbar.open({position: "is-bottom" ,message: `You must be logged in to sign a petititon!`, duration: 5000, type: "is-danger"});
                    this.goToPage('/login');
                }
                await server.post(`/api/v1/petitions/${this.petitionId}/signatures`, null,
                    {headers: {'X-Authorization': token}})
                    .then(response => {
                        console.log(response);
                        this.signatureCount += 1;
                        console.log("Petition Signed");
                        this.$buefy.snackbar.open({position: "is-bottom" ,message: `Petition Signed!`, duration: 5000, type: "is-success"});
                    })
                    .catch(error => {
                        console.error(error);
                        this.$buefy.snackbar.open({position: "is-bottom" ,message: `Petition Already Signed!`, duration: 5000, type: "is-danger"});
                    });
                this.goToPage('/profile')
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
<style scoped>
</style>