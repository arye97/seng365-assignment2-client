<template>
    <div :key="this.signatureCount">
        <section>
            <b-navbar>
                <template slot="brand">
                    <b-navbar-item>
                        <h1>Petitions</h1>
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
                    <b-navbar-item  v-if="this.userId" v-on:click="goToPage('/petitions/create')">
                        Create Petition
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
            <div class="container" >
                <div class="notification text-center ">
                    <div v-if="this.petition !== null">
                        <h1><strong>{{this.petition.title}}</strong></h1><hr/>
                    </div>
                    <img class="main-photo" :src="this.heroImage" alt="No Hero Image"/><hr>
                </div>
                <div class="notification text-center" >
                    <strong>Description:</strong> <br/>{{this.petition.description}}<br/><br/>
                    <strong>Category:</strong> <br/>{{this.petition.category}}<br/><br/>
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
                    <strong>Created Date:</strong> <br/>{{this.createdDate}}<br/><br/>
                    <div v-if="this.closingDate">
                        <strong >Closing Date:</strong> <br/>{{this.closingDate}}<br/><br/>
                    </div>

                </div>
                <div class="notification text-center">
                    <label><strong>Share this petition:</strong></label>
                    <template >
                        <ShareNetwork
                                v-for="network in networks"
                                :network="network.network"
                                :key="network.key"
                                :url="sharing.url"
                                :title="sharing.title"
                                :description="sharing.description"
                        >
                            <i :class="network.icon"></i>
                            <br/><span>{{ network.name }}</span>
                        </ShareNetwork>
                    </template>
                </div><br/>
            </div>
        </section>


        <section>
            <div class="container">
                <div class="notification text-center">
                    <div v-if="!isMyPetition">
                        <br/>
                        <button class="button is-primary-outlined is-danger" v-if="unsign" @click="confirm">
                            Remove Signature
                        </button>
                        <a class="button is-primary-outlined" size="larger" v-else v-on:click="this.signPetition">
                            <strong>Sign Petition</strong>
                        </a>
                    </div>
                    <div v-else>
                        <h1>You can't remove your signature from a petition you created</h1>
                    </div>
                    <br/><br/>
                    <strong>This petition has {{this.petition.signatureCount}} signatories </strong> <br/>
                    <strong v-if="unsign">and you are one of them</strong><br/><br/>

                    <template>
                        <b-table :data="signatoryData">
                            <template slot-scope="props">
                                <template v-for="column in signatoryColumns">
                                    <b-table-column :key="column.signatoryId" v-if="column.isImage" v-bind="column">
                                        <template>
                                            <img :src="props.row.profileImage" height="100" width="100" alt="No Hero Image"/>

                                        </template>
                                    </b-table-column>
                                    <b-table-column v-else :key="column.name" v-bind="column">
                                        {{ props.row[column.field] }}
                                    </b-table-column>
                                </template>
                            </template>
                        </b-table>
                    </template><hr/>

                </div>

                <div  class="notification text-center" v-if="isMyPetition">
                    <label>Author's Options</label><br/><br/>
                    <button  class="button is-primary-outlined is-warning"  type="is-warning" v-on:click="editPetition"
                               icon-right="delete">
                        Edit Petition
                    </button><br/><br/>
                    <button class="button is-primary-outlined is-danger" type="is-danger" v-on:click="confirmDeletePetition"
                              icon-right="delete">
                        Delete Petition
                    </button>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
    import server from "../Api";
    export default {
        name: "PetitionDetails",
        modules: ['vue-social-sharing/nuxt'],
        data() {
            return {

                sharing: {
                    url: '',
                    title: 'Look at this cool petition!',
                    description: 'Look at this petition on this super cool website.'
                },
                networks: [
                    { network: 'email', name: 'Email', icon: 'far fah fa-lg fa-envelope', color: '#333333' },
                    { network: 'facebook', name: 'Facebook', icon: 'fab fah fa-lg fa-facebook-f', color: '#1877f2' },
                    { network: 'reddit', name: 'Reddit', icon: 'fab fah fa-lg fa-reddit-alien', color: '#ff4500' },
                    { network: 'twitter', name: 'Twitter', icon: 'fab fah fa-lg fa-twitter', color: '#1da1f2' },
                ],
                authorData: [],
                authorColumns: [
                    {
                        field: 'name',
                        label: 'Author Name',
                        centered: true
                    },
                    {
                        field: 'heroImage',
                        label: 'Author Profile Image',
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
                signatureCount: 0,
                unsign: false,
                createdDate : null,
                closingDate : null
            };
        },
        async mounted() {
            let token = sessionStorage.getItem('token');
            let userId = sessionStorage.getItem('userId');
            if (token !== null) {
                this.userId = userId;
            }
            let url = window.location.pathname;
            this.petitionId = url.substring(url.lastIndexOf('/') + 1);


            //need to get signatories user profile pictures too urgh
            this.sharing.url = 'https://canterbury.ac.nz' + url;

            await server.get(`/api/v1/petitions/${this.petitionId}/signatures`)
                .then(response => {
                    let i;
                    for (i = 0; i < response.data.length; i++) {
                        let newSignatory = {
                            'signatoryId': response.data[i]['signatoryId'],
                            'profileImage': 'Loading...',
                            'name': response.data[i]['name'],
                            'city': response.data[i]['city'],
                            'country': response.data[i]['country'],
                            'signedDate': response.data[i]['signedDate']
                        };
                        this.iHavePetitions = true;
                        if (newSignatory.signatoryId === parseInt(userId, 10)) {
                            this.unsign = true;
                        }
                        let date = newSignatory.signedDate;
                        newSignatory.signedDate = new Date(date).toDateString();
                        this.signatoryData.push(newSignatory);
                    }
                }).catch(error => {
                    console.error(error);
                });

            let i = 0;
            while (i < this.signatoryData.length) {
                let signatoryId = this.signatoryData[i]['signatoryId'];
                await server.get(`api/v1/users/${signatoryId}/photo`,
                    {responseType : 'blob'})
                    .then(response => {
                        this.signatoryData[i]['profileImage'] = URL.createObjectURL(response.data);
                    })
                    .catch(error => {
                        this.signatoryData[i]['profileImage'] = "https://i.imgur.com/QKN0RVE.png";
                        console.log(error)
                    });
                i++;
            }



            await server.get('/api/v1/petitions/'.concat(this.petitionId)).then(response => {
                this.createdDate = new Date(response.data.createdDate).toDateString();
                if (response.data.closingDate !== null && response.data.closingDate !== undefined) {
                    this.closingDate = new Date(response.data.closingDate).toDateString();
                } else {
                    this.closingDate = 'This Petition has no end date set'
                }
                this.petition = response.data;
                this.signatureCount = this.petition.signatureCount;

            }).catch(error => {
                console.error(error);
            });


            await server.get(`/api/v1/petitions/${this.petitionId}/photo`, {responseType : 'blob'})
                .then(response => {
                    this.heroImage = URL.createObjectURL(response.data);
                }).catch(error => {
                    console.error(error)
                    this.heroImage = "https://i.imgur.com/QKN0RVE.png";
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


            await server.get(`/api/v1/users/${this.petition.authorId}/photo`, {responseType : 'blob'})
                .then(response => {
                    this.authorData[0].heroImage = URL.createObjectURL(response.data);
                }).catch(error => {
                    this.authorData[0].heroImage = "https://i.imgur.com/QKN0RVE.png";
                    console.error(error);
                });



            this.isMyPetition = (this.petition.authorId === parseInt(this.userId,10));
        },
        methods: {
            setDefaultProfile(signerId){
                let i;
                for (i=0; i < this.signatureCount; i++) {
                    if (this.signatoryData[i]['signatoryId'] === signerId) {
                        this.signatoryData[i]['profileImage'] = "https://i.imgur.com/QKN0RVE.png";
                    }
                }
            },
            editPetition() {
                if (this.petition.closingDate == null) {
                    this.goToPage(`/petitions/${this.petitionId}/edit`);
                    return;
                }
                let now = Date.now();
                let rightNow = new Date(now * 1000);
                if (this.petition.closingDate < rightNow) {
                    this.$buefy.snackbar.open({position: "is-bottom" ,message: `Sorry this petition has closed!`, duration: 5000, type: "is-danger"});
                    return;
                }
                console.log(`/petitions/${this.petitionId}/edit`);
                this.goToPage(`/petitions/${this.petitionId}/edit`);
            },
            confirm() {
                this.$buefy.dialog.confirm({
                    message: 'Remove your signature?',
                    onConfirm: () => {
                        this.removeSignature();
                        this.$buefy.toast.open('Signature Removed');
                        this.goToPage('/petitions')
                    }
                })
            },
            confirmDeletePetition() {
                this.$buefy.dialog.confirm({
                    message: 'Delete this petition?',
                    onConfirm: () => {
                        this.deletePetition();
                        this.goToPage('/profile')
                    }
                })
            },
            deletePetition() {
                let token = sessionStorage.getItem('token');
                server.delete(`/api/v1/petitions/${this.petitionId}/`,
                    {headers: {'Content-Type' : 'application/json', 'X-Authorization' : token}})
                    .then(response => {
                        console.log(response);
                        this.$buefy.snackbar.open({position: "is-bottom", message: `Petition was deleted successfully`, duration: 5000, type: "is-success"});
                    })
                    .catch(error => {
                        console.error(error);
                        this.$buefy.snackbar.open({position: "is-bottom", message: `Could not delete petition`, duration: 5000, type: "is-danger"});
                    });
            },
            async removeSignature() {
                let token = sessionStorage.getItem('token');
                let now = Date.now();
                let rightNow = new Date(now * 1000);
                if (this.petition.closingDate < rightNow) {
                    this.$buefy.snackbar.open({position: "is-bottom" ,message: `Sorry this petition has closed!`, duration: 5000, type: "is-danger"});
                    return;
                }
                await server.delete(`/api/v1/petitions/${this.petitionId}/signatures`, {headers: {'X-Authorization' : token}})
                    .then(response => {
                        console.log(response);
                    })
                    .catch(error => {
                        console.error(error);
                    });
            },
            goToPage(endpoint) {
                this.$router.push(endpoint);
            },
            async signPetition() {
                let token = sessionStorage.getItem('token');
                if (token === null) {
                    this.$buefy.snackbar.open({position: "is-bottom" ,message: `You must be logged in to sign a petititon!`, duration: 5000, type: "is-danger"});
                    this.goToPage('/login');
                }

                let now = Date.now();
                let rightNow = new Date(now * 1000);
                if ((this.petition.closingDate < rightNow) && (this.petition.closingDate !== null)) {
                    this.$buefy.snackbar.open({position: "is-bottom" ,message: `Sorry this petition has closed!`, duration: 5000, type: "is-danger"});
                    return;
                }

                await server.post(`/api/v1/petitions/${this.petitionId}/signatures`, null,
                    {headers: {'X-Authorization': token}})
                    .then(() => {
                        this.signatureCount += 1;
                        this.$buefy.snackbar.open({position: "is-bottom" ,message: `Petition Signed!`, duration: 5000, type: "is-success"});
                    })
                    .catch(error => {
                        console.error(error);
                        this.$buefy.snackbar.open({position: "is-bottom" ,message: `Petition Already Signed!`, duration: 5000, type: "is-danger"});
                    });
                this.goToPage('/petitions')
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
                    sessionStorage.clear();
                    this.$router.push('/'); //routes back to login
                }).catch(error => {
                    console.error(error);
                    console.log("User already logged out.");
                    sessionStorage.setItem('token', null);
                    sessionStorage.clear();
                    this.$router.push('/'); //still get them out
                })
            }
        }
    };
</script>
<style scoped>
    h1 {
        text-align: center;

    }

    .main-photo {
        display: block;
        margin-left: auto;
        margin-right: auto;
        width: 50%;
    }
</style>