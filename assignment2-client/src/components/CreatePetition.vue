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
                    <b-navbar-item  v-if="this.isLoggedIn" v-on:click="goToPage('/profile/edit')">
                        Edit Profile
                    </b-navbar-item>
                    <b-navbar-item v-on:click="goToPage('/petitions')">
                        View Petitions
                    </b-navbar-item>

                </template>
                <template slot="end">
                    <b-navbar-item tag="div">
                        <div class="buttons">
                            <a class="button is-primary" v-on:click="logout">Logout</a>
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
                    Create a Petition
                </div>
            </div><br/>
            <div class="container">
                <div class="notification">
                    <div class="content">

                        <section>
                            <b-field label="Title">
                                <b-input v-model="title" placeholder="E.g bring back $2 noodles" required></b-input>
                            </b-field>

                            <b-field label="Description">
                                <b-input v-model="description" type="textarea" placeholder="Eg: the noodles were pretty cool" required></b-input>
                            </b-field>

                            <b-field label="Category">
                                <b-select expanded v-model="categoryId" required>
                                    <option
                                            v-for="(category, id) in categories"
                                            :value="category"
                                            :key="id">
                                        {{ category.name }}
                                    </option>
                                </b-select>
                            </b-field>
                            <b-field label="Upload a Hero Image"></b-field>
                            <b-field  class="file">
                                <b-upload v-model="heroImage" required>
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
                                Remove Selected Image
                            </b-button>

                                <b-field label="Date">
                                    <b-datetimepicker
                                            placeholder="Select Date"
                                            v-model="closingDate"
                                            icon="calendar"
                                            >
                                    </b-datetimepicker>
                                </b-field>
                            <hr/>
                            <b-button type="is-primary" outlined v-on:click="createPetition">Create</b-button>
                        </section>
                    </div>
                </div>

            </div>
        </section>
    </div>
</template>

<script>
    import server from "../Api";
    export default {
        name: "CreatePetition",
        data() {
            return {
                //for updating user details
                isLoggedIn: (sessionStorage.getItem('token') !== null),
                petitionId: null,
                title: null,
                description: null,
                categoryId: null,
                closingDate: null,
                heroImage: null,
                categories: [],
                //for buefy functionality
                open: true,
                fullheight: true,
                toUpdate: false,
                //get user data here
                petition: null,
                newClosingDate: null

            };
        },
        async mounted() {
            if (sessionStorage.getItem('token') === null) {
                this.goToPage('/login');
            }
            await server.get('api/v1/petitions/categories').then(response => {
                let i;
                for (i = 0; i < response.data.length; i++) {
                    let newCategory = {
                        'categoryId' : response.data[i]['categoryId'],
                        'name' : response.data[i]['name']
                    };
                    this.categories.push(newCategory);
                }
            }).catch(error => {
                console.error(error);
            });
        },
        methods: {
            removeHeroImage () {
                this.heroImage = null;
            },
            goToPage(endpoint) {
                this.$router.push(endpoint);
            },
            validateImageType(photo) {
                if (photo === null) {return false}
                let validTypes = ["image/jpeg", "image/gif", "image/png"];
                if (!validTypes.includes(photo.type)) {
                    this.$refs['file-input'].reset;
                }
                return true
            },
            async createPetition() {
                let token = sessionStorage.getItem('token');
                if (this.closingDate !== null) {
                    this.newClosingDate = this.closingDate;
                    let year = this.newClosingDate.getFullYear();
                    let month = this.newClosingDate.getMonth() + 1;
                    let day = this.newClosingDate.getDate();
                    let hour = this.newClosingDate.getHours();
                    let minutes = this.newClosingDate.getMinutes();
                    let seconds = this.newClosingDate.getSeconds();
                    let mseconds = this.newClosingDate.getMilliseconds();

                    if (day < 10) {
                        day = '0' + day;
                    }
                    if (month < 10) {
                        month = '0' + month;
                    }

                    this.newClosingDate = (year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds + '.' + mseconds);
                }
                let newPetition = {
                    "title": this.title,
                    "description": this.description,
                    "categoryId": this.categoryId.categoryId,
                    "heroImage": "No hero image!"
                };
                if (this.closingDate != null) {
                    newPetition["closingDate"] = this.newClosingDate;
                }
                await server.post('/api/v1/petitions', newPetition,
                    {headers: {"content-type": "application/json", 'X-Authorization': token}
                }).then(response => {
                    this.petitionId = response.data.petitionId;
                    console.log(this.petitionId);
                    this.$buefy.snackbar.open({position: "is-bottom" ,message: `Petition Created!`, duration: 5000, type: "is-success"});
                    this.goToPage(`/petitions/${this.petitionId}`);
                }).catch(error => {
                    console.error(error);
                    this.$buefy.snackbar.open({message: `Error creating petition, try again later`, duration: 5000, type: "is-danger"});
                });

                if (this.validateImageType(this.heroImage)) {
                    await server.put(`/api/v1/petitions/${this.petitionId}/photo`,
                        this.heroImage,
                        {headers: {"content-type": this.heroImage.type, 'X-Authorization': token}
                        }).then(response => {
                        console.log(response);
                    })
                        .catch(error => {
                            console.error(error);
                        });
                }
                this.signPetition();
            },
            async signPetition() {
                await server.post(`/api/v1/petitions/${this.petitionId}/signatures`, null,
                    {headers: {'X-Authorization': sessionStorage.getItem('token')}})
                    .then(response => {
                        console.log(response);
                        console.log("Petition Signed");
                    })
                    .catch(error => {
                        console.error(error);
                    });
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

</style>