import Vue from 'vue'
import Vuex, {Store} from 'vuex'
import _ from 'lodash'

Vue.use(Vuex);

const initState = {
    role: '',
    total: 0,
    tableData: [],
    pager: {
        page: 1,
        perPage: 10,
    },
    userInfo: [],
    loginState: false
};
const getters = {
    userName: (state, getters, rootState) => {
        if (state.loginState.loginIn) {
            return state.loginState.user.userName
        }
    }
};
export default new Vuex.Store({
    state: _.clone(initState),
    mutations: {
        updateState(state, data) {
            _.mapKeys(data, function (value, key) {
                if (_.isPlainObject(value)) {
                    state[key] = _.extend(state[key], value)
                } else {
                    state[key] = value
                }
            });
        },
        loginIn(state, user) {
            state.loginState.loginIn = true;
            state.loginState.user = user;
            Cookies.set('loginState', state.loginState, {expires: 7});
        },
        //登出状态
        loginOut(state) {
            state.loginState.loginIn = false;
            state.loginState.user = {};
            Cookies.remove('loginState');
        },
        syncLoginState(state) {
            let cookieState = Cookies.getJSON('loginState');
            if (cookieState) {
                state.loginState = cookieState;
            }
        }
    },
    actions: {
        //从服务器端校验本地登录 Cookie 有效性
        authUser({state, commit}) {
            return AuthUser().then(res => {
                if (res.Success) {
                    commit('loginIn', {userName: res.Data.UserName});
                    return true;
                } else {
                    commit('loginOut');
                    return false;
                }
            });
        },
        changePager({commit}, data) {
            commit('updateState', {pager: data})
        },
        tableData({commit}, data) {
            commit('updateState', {tableData: data.data, total: data.total})
        },
        initiValue({commit}, data) {
            commit('updateState', {
                tableData: [],
                total: 0,
                pager: {
                    page: 1,
                    perPage: 10,
                }
            })
        },
    }
})
