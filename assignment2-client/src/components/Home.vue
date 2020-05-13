<template>
    <div id="app">
        <div class="container">
            <div class="row">
                <div class="col-sm-12 ">
                    <Header />
                    <h1>
                        <br/><br/>
                    </h1>
                    <div class="col-sm-12 text-center">
                        <h1 class="font-weight-light">Welcome to Hakinakina!</h1>
                        <section v-if="errored">
                            <p class="font-weight-light">{{this.error}}</p>
                            <p class="font-weight-light">Sorry, please log in to access your profile, or try again later.</p>
                        </section>

                        <section v-else>
                            <div v-if="loading"> Loading...</div>
                            <div v-else class="form-group font-weight-light">
                                <h1 class="font-weight-light">Hi {{this.user.firstname}}!</h1>
                                <p>You're logged in to your Hakinakina Account</p>
                                <h3 class="font-weight-light">All about you: </h3>
                                <span class="accordion">
                                        <span v-if="this.user.nickname">Nickname: {{ this.user.nickname }}</span><br/>
                                        <span >Name: {{ this.user.name }}</span><br/>
                                        <span>Email: {{ this.user.email }}</span><br/>
                                        <span>Country: {{ this.user.country }}</span><br/>
                                        <span>City: {{ this.user.city }}</span><br/>

                                    </span>
                                <button type="submit" class="btn btn-link" v-on:click="logout" >Logout</button>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>


    </div>
</template>


<script>
    export default {
        name: "Home"
    }
</script>

<style scoped>

</style>