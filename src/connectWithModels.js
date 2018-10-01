import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { loadModels } from './models'

export default (
  models,
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
) => Component => {
  if (!models) models = []
  if (!Array.isArray(models)) {
    models = [models]
  }

  loadModels(models)

  const newMapStateToProps = state => {
    const returnObject = { models: {} }
    for (const model of models) {
      returnObject[model.namespace] = state[model.namespace] || model.state
      returnObject.models[model.namespace] = model
    }
    Object.assign(returnObject, mapStateToProps ? mapStateToProps(state) : {})
    return returnObject
  }

  Component.models = Component.models || {}

  for (const model of models) {
    Component.models[model.namespace] = model
  }

  // return withRouter(connect(mapStateToProps)(Component));
  return withRouter(
    connect(
      newMapStateToProps,
      mapDispatchToProps,
      mergeProps
    )(Component)
  )
}
