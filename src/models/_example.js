// @flow

export default {
  namespace: 'documentationPage',
  initialState: {
    loggedIn: false,
  },
  reducers: {
    signIn (state, { payload }) {
      // Set cookie here
      return { ...state, ...payload, loggedIn: true }
    },
    signOut (state) {
      // Clear any cookies here
      return this.state
    },
  },
  effects: {
    signIn: function * ({ payload }, { put, call }) {
      yield put({ type: 'update', payload: { test: true } })
    },
  },
  subscriptions: {
    url: ({ history }) => {
      history.listen(location => {
        console.log(`Location: ${location.pathname}`)
      })
    },
  },
}
