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

                            <b-field label="Closing Date">
                                <b-datetimepicker
                                        v-model="closingDate"
                                        placeholder="Type or select a date..."
                                        icon="calendar-today"
                                        editable>
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
            createPetition() {},
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