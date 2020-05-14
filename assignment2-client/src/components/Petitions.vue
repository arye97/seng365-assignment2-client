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
        <br/>
        <br/>
        <h1 class="text-center">Click to view</h1>
        <section class="petitionTable">

            <b-collapse
                    aria-id="contentIdForA11y3"
                    class="panel"
                    animation="slide"
                    :open.sync="isOpen">
                <div
                        slot="trigger"
                        class="panel-heading"
                        role="button"
                        aria-controls="contentIdForA11y3">
                    <strong>Petition Categories</strong>
                </div>

                <div class="panel-block"> <!-- Table of all petitions -->
                    <b-table :data="categoriesData" :columns="categoryColumns"></b-table>
                </div>
            </b-collapse>

        </section>
        <br/>
        <section class="petitionTable">
            <br/>
            <b-collapse
                    aria-id="contentIdForA11y2"
                    class="panel"
                    animation="slide"
                    :open.sync="allPetitionsIsOpen">
                <div
                        slot="trigger"
                        class="panel-heading"
                        role="button"
                        aria-controls="contentIdForA11y2">
                    <strong>All Petitions</strong>
                </div>

                <div class="panel-block"> <!-- Table of all petitions -->
                    <b-table :data="allPetitionsData" :columns="petitionColumns"></b-table>
                </div>
            </b-collapse>

        </section>
        <br/>
        <section class="petitionTable">
            <br/>
            <b-collapse
                    aria-id="contentIdForA11y4"
                    class="panel"
                    animation="slide"
                    :open.sync="searchPetitionsIsOpen">
                <div
                        slot="trigger"
                        class="panel-heading"
                        role="button"
                        aria-controls="contentIdForA11y4">
                    <strong>Sort and Search Petitions</strong>
                </div>
                <div class="panel-block">
                    <div class="panel-list"> <!-- Search for a petition, or sort them -->
                        <br/>
                        <b-field label="Keyword">
                            <b-input v-model="q" placeholder="e.g: the"></b-input>
                        </b-field><br/>

                        <b-field label="Category ID">
                            <b-input v-model="categoryId"></b-input>
                        </b-field><br/>

                        <b-field label="Author ID">
                            <b-input v-model="authorId"></b-input>
                        </b-field><br/>

                        <b-field label="Sort By">
                            <b-select expanded>
                                <option
                                        v-for="option in sortByPossible"
                                        :value="option"
                                        :key="option">
                                    {{ option }}
                                </option>
                            </b-select>
                        </b-field>


                        <b-field label="Count">
                            <b-input v-model="count" placeholder="From StartIndex, how many do you want to see?"></b-input>
                        </b-field><br/>

                        <b-field label="Start Index">
                            <b-input v-model="startIndex" placeholder="From StartIndex, how many do you want to see?"></b-input>
                        </b-field><br/>

                        <b-button type="is-primary" outlined v-on:click="searchForPetitions">Search</b-button>
                    </div>
                </div>

            </b-collapse>

        </section>
    </div>
</template>

<style scoped>
    .panel-list {
        width: 90%;
        position: center;
        padding-left: 10%;
    }
    .petitionTable {
        width: 75%;
        position: center;
        padding-left: 25%;
    }
    h1 {
        font-size: x-large;

        text-align: center;
    }
</style>

<script>
    import server from "../Api";
    import {tokenStore} from "../main";

    export default {
        name: "Petitions",
        data () {
            return {
                //for searching and sorting petitions
                q: null,
                categoryId: null,
                authorId: null,
                count: null,
                startIndex: null,
                sortByPossible: [
                    'SIGNATURES_ASC',
                    'SIGNATURES_DESC'
                ],
                sortBy: null,

                //for displaying data
                allPetitionsIsOpen: false,
                isOpen: false,
                searchPetitionsIsOpen: false,
                allPetitionsData: [],
                categoriesData: [],
                categoryColumns: [
                    {
                        field: 'categoryId',
                        width: '40',
                        label: 'Category ID'
                    },
                    {
                        field: 'name',
                        width: '40',
                        label: 'Name'
                    }
                ],
                petitionColumns: [
                    {
                        field: 'petitionId',
                        label: 'Petition ID',
                        width: '40',
                        numeric: true
                    },
                    {
                        field: 'title',
                        label: 'Title',
                    },
                    {
                        field: 'category',
                        label: 'Category',
                    },
                    {
                        field: 'authorName',
                        label: 'Author Name',
                        centered: true
                    },
                    {
                        field: 'signatureCount',
                        label: 'Num of Signatures',
                    }
                ]
            }

        },
        beforeMount() {
            //get the data for the categories
            server.get('api/v1/petitions/categories').then(response => {
                let i;
                for (i = 0; i < response.data.length; i++) {
                    let newCategory = {
                        'categoryId' : response.data[i]['categoryId'],
                        'name' : response.data[i]['name']
                    };
                    this.categoriesData.push(newCategory);
                }
            }).catch(error => {
                console.error(error);
            })

            //get the data for the petitions columns
            server.get('api/v1/petitions').then(response => {
                let i;
                for (i = 0; i < response.data.length; i++) {
                    let newPetition = {
                        'petitionId' : response.data[i]['petitionId'],
                        'title' : response.data[i]['title'],
                        'category' : response.data[i]['category'],
                        'authorName' : response.data[i]['authorName'],
                        'signatureCount' : response.data[i]['signatureCount']
                    };
                    this.allPetitionsData.push(newPetition);
                }

            }).catch(error => {
                console.error(error);
            })
        },
        methods: {
            goToPage(endpoint) {
                this.$router.push(endpoint);
            },
            async searchForPetitions() {},
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
    }
</script>

