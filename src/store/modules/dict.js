import { queryDictList } from '@/api/dict';

const getDefaultState = () => {
    return {
        dictMap: {},
        checkSts: []
    };
};

const state = getDefaultState();

const mutations = {
    SET_DICT: (state, info) => {
        state.dictMap[info.type] = info.data || [];
    }
};

const actions = {
    getDict ({ commit, state }, type) {
        return new Promise((resolve, reject) => {
            if (state.dictMap[type] && state.dictMap[type].length) {
                resolve(state.dictMap[type]);
            } else {
                queryDictList(type).then(response => {
                    const { data } = response;
                    commit('SET_DICT', {
                        type: type,
                        data: data
                    });
                    resolve(data);
                }).catch(error => {
                    reject(error);
                });
            }
        });
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions
};

