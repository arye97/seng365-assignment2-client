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
                                <b-input v-model="title" placeholder="E.g bring back $2 noodles"></b-input>
                            </b-field>

                            <b-field label="Description">
                                <b-input v-model="description" type="textarea" placeholder="Eg: the noodles were pretty cool"></b-input>
                            </b-field>

                            <b-field label="Category">
                                <b-select expanded v-model="categoryId">
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
                                <b-upload v-model="heroImage">
                                    <a class="button is-primary">
                                        <b-icon icon="upload"></b-icon>
                                        <span>Click to upload</span>
                                    </a>
                                </b-upload>
                                <span class="file-name" v-if="heroImage">
                                    {{ heroImage.name }}
                                </span>
                            </b-field>
                            <b-field label="Select Closing Date and Time">
                                <b-datetimepicker v-model="closingDate"
                                                  placeholder="Click to select...">
                                    <template slot="left">
                                        <button class="button is-primary"
                                                @click="closingDate = new Date().getUTCDate">
                                            <b-icon icon="clock"></b-icon>
                                            <span>Now</span>
                                        </button>
                                    </template>
                                    <template slot="right">
                                        <button class="button is-danger"
                                                @click="closingDate = null">
                                            <b-icon icon="close"></b-icon>
                                            <span>Clear</span>
                                        </button>
                                    </template>
                                </b-datetimepicker>
                            </b-field>

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
    import {tokenStore} from "../main";
    export default {
        name: "CreatePetition",
        data() {
            return {
                //for updating user details
                isLoggedIn: (tokenStore !== undefined),
                petitionId: null,
                title: null,
                description: null,
                categoryId: null,
                closingDate: new Date().getUTCDate,
                heroImage: null,
                categories: [],
                //for buefy functionality
                open: true,
                fullheight: true,
                toUpdate: false,
                //get user data here
                petition: null

            };
        },
        async mounted() {
            if (tokenStore === undefined) {
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

            async signPetition() {
                await server.post(`/api/v1/petitions/${this.petitionId}/signatures`, null,
                    {headers: {'X-Authorization': tokenStore.state.token}})
                    .then(response => {
                        console.log(response);
                        console.log("Petition Signed");
                    })
                    .catch(error => {
                        console.error(error);
                    });
            },
            async createPetition() {

                let newPetition = {
                    "title": this.title,
                    "description": this.description,
                    "categoryId": this.categoryId.categoryId,
                    "closingDate": this.closingDate.getUTCDate,
                    "heroImage": "No hero image!"
                };
                console.log(newPetition);
                //create basic petition

                await server.post('/api/v1/petitions', newPetition,
                    {headers: {"content-type": "application/json", 'X-Authorization': tokenStore.state.token}
                }).then(response => {
                    this.petitionId = response.data.petitionId;
                    this.goToPage(`/petitions/${this.petitionId}`);
                }).catch(error => {
                    console.error(error);
                });

                if (this.validateImageType(this.heroImage)) {
                    await server.put(`/api/v1/petitions/${this.petitionId}/photo`,
                        this.heroImage,
                        {headers: {"content-type": this.heroImage.type, 'X-Authorization': tokenStore.state.token}
                        }).then(response => {
                        console.log(response);
                        response.resolve();
                    })
                        .catch(error => {
                            console.error(error)
                        });
                }
                this.signPetition();
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