import { combineReducers } from 'redux'
import { put, call, select, takeEvery, cancel } from 'redux-saga/effects'
import RouteParser from 'route-parser'

export let models = []
let combinedReducer = {}
let store = null
let sagaMiddleware = null
let history = null

// Sets up connection to the stores and the saga middleware. Needs to be run before anything else.
export const connectModelsToStore = (
  newStore,
  newSagaMiddleware,
  newHistory
) => {
  store = newStore
  sagaMiddleware = newSagaMiddleware
  history = newHistory
}

// Loads a "model" (a combination of Redux sagas, Redux reducers and subscriptions) into the Redux setup
export const loadModels = newModels => {
  let loadedModels = 0
  for (const model of newModels) {
    if (models[model.namespace] === model) continue
    loadedModels++
    unloadModel(model)

    model.reducers = model.reducers || {}
    model.effects = model.effects || {}
    model.state = model.state || {}
    model.subscriptions = model.subscriptions || {}
    model.runningSubscriptions = model.runningSubscriptions || {}
    model.state = model.state || {}

    // Models have 'update' reducer that can be overridden.
    if (!model.reducers.update) {
      model.reducers.update = function (state = this.state, { payload }) {
        return { ...state, ...payload }
      }
    }
    model.loaded = true
    models[model.namespace] = model
  }

  if (loadedModels === 0) return
  // Load all the reducers and update the setup
  const reducers = {}
  for (const m of Object.values(models)) {
    reducers[m.namespace] = (state = m.state, action) => {
      const [namespace, type] = action.type.split('/')
      if ((!namespace && !type) || namespace !== m.namespace) return state
      if (!m.reducers[type]) {
        return state
      }

      return m.reducers[type](state, action)
    }
  }

  combinedReducer = combineReducers(reducers)
  store.replaceReducer(combinedReducer)

  for (const model of newModels) {
    if (!model.loaded) continue
    if (model.effects) {
      model.runningSaga = sagaMiddleware.run(modelWatcherSaga, model, models)
    }

    const namespacedDispatch = action => {
      if (!action.type.includes('/')) {
        action.type = `${model.namespace}/${action.type}`
      }
      store.dispatch(action)
    }

    // Inject the action dependencies
    const newActions = {}
    for (const [fnName, fn] of Object.entries(model.actions || {})) {
      const newAction = action =>
        fn(action, {
          getState: store.getState,
          dispatch: namespacedDispatch,
          history,
          models
        })
      newActions[fnName] = newAction
      if (!model[fnName]) model[fnName] = newAction
    }

    // For convenience, create actions for reducers or effects that lack actions
    for (const reducerName of Object.keys(model.reducers)) {
      if (!model[reducerName]) {
        model[reducerName] = action => namespacedDispatch(action)
      }
    }
    for (const effectName of Object.keys(model.effects)) {
      if (!model[effectName]) {
        model[effectName] = action => namespacedDispatch(action)
      }
    }

    model.actions = newActions

    // Make new subscriptions
    for (const subscriptionName of Object.keys(model.subscriptions)) {
      model.runningSubscriptions[subscriptionName] = model.subscriptions[subscriptionName]({
        dispatch: namespacedDispatch,
        getState: store.getState,
        history,
        RouteParser
      })
    }
  }

  return models
}

export const unloadModel = model => {
  if (!models[model.namespace]) return

  // Cancel effects
  if (model.runningSaga) sagaMiddleware.run(cancelSaga, model.runningSaga)

  // Remove reducers
  if (combinedReducer[model.namespace]) {
    delete combinedReducer[model.namespace]
    store.replaceReducer(combinedReducer)
  }

  // Cancel any currently running subscriptions
  if (models[model.namespace]) {
    for (const subscriptionName of Object.keys(
      models[model.namespace].runningSubscriptions
    )) {
      models[model.namespace].runningSubscriptions[subscriptionName]()
    }
  }
}

// Saga to run the model's effects. Will cancel any earlier running saga for this model.
export function * modelWatcherSaga (model, models) {
  if (model.runningSaga) {
    yield cancel(model.runningSaga)
  }
  const putEffect = action => {
    if (!action.type.includes('/')) {
      action.type = `${model.namespace}/${action.type}`
    }
    return put(action)
  }
  for (const [name, effect] of Object.entries(model.effects || {})) {
    const workerSaga = function * (action) {
      yield effect(action, { put: putEffect, call, select, models })
    }
    yield takeEvery(`${model.namespace}/${name}`, workerSaga)
  }
}

export function * cancelSaga (saga) {
  yield cancel(saga)
}
