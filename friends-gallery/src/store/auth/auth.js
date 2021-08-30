import { Auth } from "aws-amplify";

export const auth = {
    namespaced: true,
    state: { user: null },
    mutations: {
        setUser(state, payload) {
            state.user = payload;
        }
    },

    actions: {
        //Logs out
        async logout({ commit }) {
            commit("setUser", null);
            return await Auth.signOut();
        },

        //Login handler
        async login({ commit }, { username, password }) {
            try {
                await Auth.signIn({
                    username,
                    password
                });
                const userInfo = await Auth.currentUserInfo();
                commit("setUser", userInfo);
                return Promise.resolve("Success");
            } catch (error) {
                console.log(error);
                return Promise.reject(error);
            }
        },

        //Email confirmation
        async confirmSignUp(_, { username, code }) {
            try {
                await Auth.confirmSignUp(username, code);
                return Promise.resolve();
            } catch (error) {
                console.log('confirmSignUp error:', error);
                return Promise.reject(error);
            }
        },

        //Create new user on AWS Cognito
        async signUp(_, { username, password, email }) {
            try {
                await Auth.signUp({
                    username,
                    password,
                    attributes: {
                        email
                    }
                })
                return Promise.resolve();
            } catch (error) {
                console.log('signUP error:', error);
                return Promise.reject();
            }
        },

        //Set current user info on state
        async authAction({ commit }) {
            const userInfo = await Auth.currentUserInfo();
            commit("setUser", userInfo);
        }
    },

    getters: {
        user: (state) => state.user
    }
}