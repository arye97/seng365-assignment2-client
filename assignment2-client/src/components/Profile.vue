<template>
    <div>
    <section>
        <b-navbar>
            <template slot="brand">
                <b-navbar-item>
                    <h1>Petitions</h1>
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
                <h1>Welcome to your Petitions Account <strong> {{this.user.name}} </strong></h1><hr/>
                <img class="main-photo" :src="this.heroImage" alt="No Hero Image" onerror="setDefaultProfile" /><br/>
            </div>

        </div><br/>
        <div class="container">
            <div class="notification">
                Your details: <br/>
                Name: {{this.user.name}}<br/>
                City: {{this.user.city}}<br/>
                Country: {{this.user.country}}<br/>
                Email: {{this.user.email}}<br/>


            </div>
            <div class="notification" v-if="iHavePetitions">
                <label class="text-center">
                    <h1>My Petitions</h1><hr/>
                </label>
                    <b-table :data="this.myPetitionsData" paginated per-page="10" >
                        <template slot-scope="props">
                            <b-table-column :key="props.row.petitionId" v-bind="props.row" >
                                <b-button v-bind="props.row"  :key="props.row.petitionId" v-on:click="goToPetition(props.row.petitionId)">Open</b-button>
                            </b-table-column>

                            <template v-for="column in myPetitionsColumns">
                                <b-table-column :key="column.title" v-bind="column" v-if="column.isImage" slot="sortable">
                                    <template>
                                        <img :src="props.row.heroImage" height="100" width="100" alt="No Hero Image"/>
                                    </template>
                                </b-table-column>
                                <b-table-column :key="column.petitionId" v-else v-bind="column" >
                                    {{ props.row[column.field] }}
                                </b-table-column>
                            </template>
                        </template>
                    </b-table>
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
                heroImage: null,
                iHavePetitions: false,
                myPetitionsData: [],
                myPetitionsColumns: [
                    {
                        field: 'petitionId',
                        label: 'Petition ID',
                        width: '40',
                        centered: true,
                        numeric: true
                    },
                    {
                        field: 'heroImage',
                        label: 'Hero Image',
                        isImage: true
                    },
                    {
                        field: 'title',
                        label: 'Title',
                        centered: true
                    },
                    {
                        field: 'category',
                        label: 'Category',
                        centered: true
                    },
                    {
                        field: 'authorName',
                        label: 'Author Name',
                        centered: true
                    },
                    {
                        field: 'signatureCount',
                        label: 'Num of Signatures',
                        centered: true
                    }]
            };
        },
        async mounted() {
            let token = sessionStorage.getItem('token');
            if (token === null) { //then there's no stored token
                await this.$router.push('/'); //routes back to login
            }
            //get user details

            await server.get('/api/v1/users/'.concat(this.profileId),
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
            });
            //get my petitions
            await server.get(`/api/v1/users/${this.profileId}/photo`,
                {responseType : 'blob', headers: {'X-Authorization' : token}})
                .then(response => {
                    this.heroImage = URL.createObjectURL(response.data);
                }).catch(error => {
                    this.heroImage = "https://i.imgur.com/QKN0RVE.png";
                    console.error(error)
                });


            await server.get(`/api/v1/petitions?authorId=${this.profileId}`)
                .then(response => {
                let i;
                for (i = 0; i < response.data.length; i++) {
                    let newPetition = {
                        'petitionId' : response.data[i]['petitionId'],
                        'title' : response.data[i]['title'],
                        'category' : response.data[i]['category'],
                        'authorName' : response.data[i]['authorName'],
                        'signatureCount' : response.data[i]['signatureCount'],
                        'heroImage' : 'Loading...'
                    };
                    this.iHavePetitions = true;
                    this.myPetitionsData.push(newPetition);
                }
            }).catch(error => {
                console.error(error);
                this.iHavePetitions = true;
                this.$buefy.snackbar.open({message: `Could not retrieve petition information, try again later`, duration: 5000, type: "is-danger"});
            });


            if (this.iHavePetitions) {
                let i = 0;
                while (i < this.myPetitionsData.length) {
                    let petitionId = this.myPetitionsData[i]['petitionId'];
                    await server.get(`api/v1/petitions/${petitionId}/photo`,
                        {responseType : 'blob'})
                        .then(response => {
                            this.myPetitionsData[i]['heroImage'] = URL.createObjectURL(response.data);
                        })
                        .catch(error => {
                            this.myPetitionsData[i]['heroImage'] = "https://i.imgur.com/QKN0RVE.png";
                            console.log(error)
                        });
                    i++;
                }
            }


        },
        methods: {
            goToPetition(id) {
                this.$router.push(`/petitions/${id}`)
            },
            async setDefaultProfile(){
                this.heroImage = "https://i.imgur.com/QKN0RVE.png";
            },
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
<style lang="scss">
    .b-table-sticky-header {
        position: sticky;
    }
    h1 {
        text-align: center;
        font-size: x-large;
    }
    .text-center {
        text-align: center;
    }

    .main-photo {
        display: block;
        margin-left: auto;
        margin-right: auto;
        width: 50%;
    }
</style>