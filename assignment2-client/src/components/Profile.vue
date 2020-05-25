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
                <h1>Welcome to your Petitions Account <strong> {{this.user.name}} </strong></h1><hr/>
                <img :src="this.heroImage" alt="No Hero Image" onerror="setDefaultProfile" /><br/>
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
                                <b-table-column :key="column.petitionId" v-bind="column" v-if="column.isImage" slot="sortable">
                                    <template>
                                        <img :src="getColumnImage(props.row.heroImage)" height="100" width="100" alt="No Hero Image"/>
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
            });
            //get my petitions
            server.get(`/api/v1/users/${this.profileId}/photo`,
                {responseType : 'blob', headers: {'X-Authorization' : token}})
                .then(response => {
                    this.heroImage = URL.createObjectURL(response.data);
                }).catch(error => {
                this.heroImage = "https://i.imgur.com/QKN0RVE.png";
                console.error(error)
            });

            server.get(`/api/v1/petitions?authorId=${this.profileId}`)
                .then(response => {
                    if (response.data.length > 0) {
                        this.iHavePetitions = true;
                        this.myPetitionsData = response.data;
                    }
            }).catch(error => {
                this.iHavePetitions = false;
                console.error(error);
            });
            if (this.iHavePetitions) {
                let i = 0;
                while (i < this.myPetitionsData.length) {
                    let petitionId = this.myPetitionsData[i]['petitionId'];
                    server.get(`api/v1/petitions/${petitionId}/photo`,
                        {responseType : 'blob'})
                        .then(response => {
                            this.myPetitionsData[i]['heroImage'] = URL.createObjectURL(response.data);
                        })
                        .catch(error => {
                            console.log(error)
                        });
                    i++;
                }
            }

        },
        methods: {
            getColumnImage(image) {
                if (image === undefined) {
                    return "https://i.imgur.com/QKN0RVE.png";
                }
                return image;
            },
            goToPetition(id) {
                this.$router.push(`/petitions/${id}`)
            },
            setDefaultProfile(){
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
    h1 {
        text-align: center;
        font-size: x-large;
    }
    .text-center {
        text-align: center;
    }
</style>