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
                    <b-navbar-item v-on:click="goToPage('/')">
                        Create
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
        <section>
            <div class="container">
                <div class="notification text-center">
                    Edit your account details
                </div>
            </div><br/>
            <div class="container">
                    <div class="notification">
                        <div class="content">

                            <section >
                                <b-field label="Name">
                                    <b-input v-model="name" placeholder="Barry Berkman"></b-input>
                                </b-field>

                                <b-field label="Email">
                                    <b-input v-model="email" type="email" placeholder="barry@block.com"></b-input>
                                </b-field>

                                <b-field label="New Password">
                                    <b-input type="password" v-model="password" placeholder="Your new password" ></b-input>
                                </b-field>

                                <b-field label="Current Password">
                                    <b-input type="password" v-model="currentPassword" placeholder="Your current password"></b-input>
                                </b-field>

                                <b-field label="City">
                                    <b-input type="text"
                                             v-model="city"
                                             placeholder="Christchurch">
                                    </b-input>
                                </b-field>
                                <b-field label="Set a new profile photo"></b-field>
                                <b-field class="file">
                                    <b-upload v-model="heroImage">
                                        <a class="button is-primary"><br/><br/>
                                            <b-icon icon="upload"></b-icon>
                                            <span>Click to upload</span>
                                        </a>
                                    </b-upload>
                                    <span class="file-name" v-if="heroImage">
                                    {{ heroImage.name }}
                                </span>
                                </b-field>
                                <b-field label="Country">
                                    <b-input type="text"
                                             v-model="country"
                                             placeholder="New Zealand">
                                    </b-input>
                                </b-field><br/>
                                <b-button type="is-primary" outlined v-on:click="updateDetails">Update Details</b-button>
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
        name: "EditProfile",
        data() {
            return {
                //for updating user details
                name: null,
                email: null,
                country: null,
                city: null,
                password: null,
                currentPassword: null,
                heroImage: null,
                updatedDetails: {},
                //for buefy functionality
                profileViewing: "user-profile",
                open: true,
                fullheight: true,
                toUpdate: false,

                //get user data here
                user: null

            };
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
            async updateDetails () {

                let token = sessionStorage.getItem('token');
                let userId = sessionStorage.getItem('userId');
                if (this.name !== null) {this.updatedDetails['name'] = this.name}
                if (this.email !== null) {this.updatedDetails['email'] = this.email}
                if (this.password !== null) {this.updatedDetails['password'] = this.password}
                if (this.currentPassword !== null) {this.updatedDetails['currentPassword'] = this.currentPassword}
                if (this.city !== null) {this.updatedDetails['city'] = this.city}
                if (this.country !== null) {this.updatedDetails['country'] = this.country}


                if ((this.password === null && this.currentPassword !== null) || (this.currentPassword === null && this.password !== null)) {
                    this.$buefy.snackbar.open({message: `Both password fields must be filled in, not just one!`, duration: 2500, type: "is-danger"});
                    return;
                }
                if (this.updatedDetails.length > 0) {
                    await server.patch('/api/v1/users/'.concat(userId), this.updatedDetails,
                        {headers: {"content-type": "application/json", 'X-Authorization': token}}
                    ).then(response => {
                        console.log(response);
                        this.toUpdate = true;
                        this.$buefy.snackbar.open({position: "is-bottom" ,message: `User details saved successfully`, duration: 5000, type: "is-success"});
                        this.$router.push('/profile');
                    }).catch(error => {
                        console.error(error);
                        this.$buefy.snackbar.open({message: `Error saving changes, could not update`, duration: 2500, type: "is-danger"});
                    });
                }
                if (this.validateImageType(this.heroImage)) {
                    await server.put(`/api/v1/users/${userId}/photo`,
                        this.heroImage,
                        {headers: {"content-type": this.heroImage.type, 'X-Authorization': token}
                        }).then(response => {
                        this.$buefy.snackbar.open({position: "is-bottom-left" ,message: `User profile image saved successfully`, duration: 5000, type: "is-success"});
                        console.log(response);
                    })
                        .catch(error => {
                            console.error(error)
                            this.$buefy.snackbar.open({message: `Error saving profile photo`, duration: 2500, type: "is-danger"});
                        });
                }
                await server.put
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