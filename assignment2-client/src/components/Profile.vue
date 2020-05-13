<template>
    <section>
        <b-sidebar
                type="is-light"
                :fullheight="fullheight"
                :open.sync="open"
        >
            <div class="p-1">

                <b-menu>
                    <b-menu-list label="Menu">
                        <b-menu-item icon="information-outline" label="Info"></b-menu-item>
                        <b-menu-item icon="settings">
                            <template slot="label" slot-scope="props">
                                Administrator
                                <b-icon class="is-pulled-right" :icon="props.expanded ? 'menu-down' : 'menu-up'"></b-icon>
                            </template>

                        </b-menu-item>
                        <b-menu-item icon="petitions" label="My Petitions">
                            <b-menu-item label="I've Signed"></b-menu-item>
                            <b-menu-item label="I've Created"></b-menu-item>
                        </b-menu-item>
                    </b-menu-list>
                    <b-menu-list label="Actions">
                        <b-menu-item label="Logout" v-on:click="logout"></b-menu-item>
                    </b-menu-list>
                </b-menu>
            </div>
        </b-sidebar>

    </section>
</template>

<script>
    import server from "../Api";
    import {tokenStore} from "../main";
    export default {
        name: "Profile",
        data() {
            return {
                profileViewing: "user-profile",
                open: true,
                fullheight: true,
            };
        },
        mounted() {

            if (tokenStore === undefined) { //then there's no stored token
                this.$router.push('/'); //routes back to login
            }
        },
        methods: {
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
<style lang="scss">
    .p-1 {
        padding: 1em;
    }
    .sidebar-page {
        display: flex;
        flex-direction: column;
        width: 100%;
        min-height: 100%;
        // min-height: 100vh;
        .sidebar-layout {
            display: flex;
            flex-direction: row;
            min-height: 100%;
            // min-height: 100vh;
        }
    }
    @media screen and (max-width: 1023px) {
        .b-sidebar {
            .sidebar-content {
                &.is-mini-mobile {
                    &:not(.is-mini-expand),
                    &.is-mini-expand:not(:hover) {
                        .menu-list {
                            li {
                                a {
                                    span:nth-child(2) {
                                        display: none;
                                    }
                                }
                                ul {
                                    padding-left: 0;
                                    li {
                                        a {
                                            display: inline-block;
                                        }
                                    }
                                }
                            }
                        }
                        .menu-label:not(:last-child) {
                            margin-bottom: 0;
                        }
                    }
                }
            }
        }
    }
    @media screen and (min-width: 1024px) {
        .b-sidebar {
            .sidebar-content {
                &.is-mini {
                    &:not(.is-mini-expand),
                    &.is-mini-expand:not(:hover) {
                        .menu-list {
                            li {
                                a {
                                    span:nth-child(2) {
                                        display: none;
                                    }
                                }
                                ul {
                                    padding-left: 0;
                                    li {
                                        a {
                                            display: inline-block;
                                        }
                                    }
                                }
                            }
                        }
                        .menu-label:not(:last-child) {
                            margin-bottom: 0;
                        }
                    }
                }
            }
        }
    }
</style>