<template>
    <div>
        <section>
            <b-navbar>
                <template slot="brand">
                    <b-navbar-item tag="router-link" :to="{ path: '/about' }">
                        <h2>About Petitions</h2>
                    </b-navbar-item>
                </template>
                <template slot="start">
                    <template v-if="isLoggedIn">
                        <b-navbar-item v-on:click="goToPage('/profile')">
                            <h2>My Profile</h2>
                        </b-navbar-item>
                        <b-navbar-item  v-if="this.isLoggedIn" v-on:click="goToPage('/profile/edit')">
                            Edit Profile
                        </b-navbar-item>
                        <b-navbar-item  v-if="this.isLoggedIn" v-on:click="goToPage('/petitions/create')">
                            Create Petition
                        </b-navbar-item>
                    </template>
                </template>


                <template slot="end" v-if="isLoggedIn">
                    <b-navbar-item tag="div">
                        <div class="buttons">
                            <a class="button is-primary" v-on:click="logout">
                                <strong>Logout</strong>
                            </a>
                        </div>
                    </b-navbar-item>
                </template>
                <template slot="end" v-else>
                    <b-navbar-item tag="div">
                        <div class="buttons">
                            <a class="button is-primary" v-on:click="goToPage('/Register')">
                                <strong>Sign up</strong>
                            </a>
                            <a class="button is-light" v-on:click="goToPage('/login')">
                                Log in
                            </a>
                        </div>
                    </b-navbar-item>
                </template>
            </b-navbar>
        </section>
        <br/>
        <br/>
        <section class="petitionTable">
            <br/>
                <div
                        slot="trigger"
                        class="panel-heading"
                        role="button"
                        aria-controls="contentIdForA11y2">
                    <strong>All Petitions</strong>
                </div>

                <div class="panel-block"> <!-- Table of all petitions -->
                    <b-table :data="this.allPetitionsData" paginated per-page="10" >
                        <template slot-scope="props">
                            <b-table-column :key="props.row.petitionId" v-bind="props.row" >
                                <b-button v-bind="props.row"  :key="props.row.petitionId" v-on:click="goToPetition(props.row.petitionId)">Open</b-button>
                            </b-table-column>
                            <template v-for="column in petitionColumns">


                                <b-table-column :key="column.petitionId" v-bind="column" v-if="column.sortable" slot="sortable">
                                    <template
                                            v-if="column.searchable"
                                            slot="searchable"
                                            >
                                    </template>
                                    {{ props.row[column.field] }}
                                </b-table-column>
                                <b-table-column :key="column.petitionId" v-bind="column" v-else-if="column.isImage" slot="sortable">
                                    <template>
                                        <img :src="props.row.heroImage" height="100" width="100" alt="No Hero Image"/>
                                    </template>
                                </b-table-column>
                                <b-table-column :key="column.petitionId" v-bind="column" v-else>
                                    <template
                                            v-if="column.searchable"
                                            slot="searchable"
                                            slot-scope="props"
                                    >
                                        <b-input
                                                v-model="props.filters[props.column.field]"
                                                placeholder="Search..."
                                                icon="magnify"
                                                size="is-small">
                                        </b-input>
                                    </template>
                                    {{ props.row[column.field] }}
                                </b-table-column>
                            </template>
                        </template>
                    </b-table>


                </div>

        </section>
        <br/>
        <!--
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
                    <div class="panel-list">
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

        </section> <br/>
         -->
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

    export default {
        name: "Petitions",
        data () {
            return {
                isLoggedIn : (sessionStorage.getItem('token') !== null),
                //for pagination
                prevIcon : 'chevron-left',
                nextIcon : 'chevron-right',
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
                allPetitionsIsOpen: true,
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
                        centered: true,
                        numeric: true,
                        sortable: true
                    },
                    {
                        field: 'heroImage',
                        label: 'Hero Image',
                        isImage: true
                    },
                    {
                        field: 'title',
                        label: 'Title',
                        centered: true,
                        searchable: true,
                        sortable: true
                    },
                    {
                        field: 'category',
                        label: 'Category',
                        centered: true,
                        searchable: true,
                        sortable: true
                    },
                    {
                        field: 'authorName',
                        label: 'Author Name',
                        centered: true,
                        sortable: true
                    },
                    {
                        field: 'signatureCount',
                        label: 'Num of Signatures',
                        centered: true,
                        sortable: true
                    }
                ]
            }

        },
        async beforeMount() {


            //get the data for the petitions columns
            await server.get('api/v1/petitions').then(response => {
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
                    this.allPetitionsData.push(newPetition);
                }
            }).catch(error => {
                console.error(error);
                this.$buefy.snackbar.open({message: `Could not retrieve petition information, try again later`, duration: 5000, type: "is-danger"});
            });

            //get the data for the categories
            await server.get('api/v1/petitions/categories').then(response => {
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
            });

            let i = 0;
            while (i < this.allPetitionsData.length) {
                let petitionID = this.allPetitionsData[i]['petitionId'];
                await server.get('api/v1/petitions/'.concat(petitionID) + '/photo',
                    {responseType : 'blob'})
                    .then(response => {
                        this.allPetitionsData[i]['heroImage'] = URL.createObjectURL(response.data);
                    })
                    .catch(error => {
                        console.log(error)
                    });
                i++;
            }
        },
        methods: {
            goToPetition(id) {
                this.$router.push(`/petitions/${id}`)
            },
            goToPage(endpoint) {
                this.$router.push(endpoint);
            },
            async searchForPetitions() {},
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
    }
</script>

