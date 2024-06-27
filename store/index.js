export const state = () => ({
  token: 'bg-buronov',
  podrazdeleniye_name: 'Рудник "Мурунату"'
});

export const mutations = {
  set_token(state, newValue) {
    state.token = newValue;
  },

  set_podrazdeleniye_name(state, newValue) {
    state.podrazdeleniye_name = newValue;
  },

};

export const actions = {
  update_token({ commit }, newValue) {
    commit('set_token', newValue);
  },

  update_podrazdeleniye_name({ commit }, newValue) {
    commit('set_podrazdeleniye_name', newValue);
  },
};


/*

обновление переменной: vm.$store.dispatch('update_podrazdeleniye_name', 'aaaaaaaaaaaa');

*/
