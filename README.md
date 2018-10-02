# react-models

Beutiful boiler-plate-less Redux code.

## What is a model?

A model is a combination of Redux action creators (thunks), 
asyncronuous effects (sagas) and reducers, combined in 'models' that approximate the classes of an
object oriented development pattern. In other words, a model is the
combination of all the Redux code concerned with manipulating one part
of the store. A single model could handle, for instance, 
user authentication, a to-do-list, a shopping cart or anything else you
can imagine.

### Hello World: the old to-do-list example

Model:
```

export default{
    namespace: 'todo',
    reducers: {
        add: function(action, state){
            return { ...state, list: state.todo.list.concat([
                { 
                    id: state.todo.list.length,
                    title: action.payload
                }
            ]}
        },
        remove: function(action, state){
            return { ...state, list: state.todo.list.filter(
                item => item.id!==action.payload
        }
    }
    
```
To use this in a component:
```
import { connectWithModels } from 'react-models'

class TodoList extends React.Component{

    handleSubmit = e => {
        e.preventDefault()
        const title = ReactDOM.findDOMNode(this._title).value;
        this.models.todo.add(title)
    }
    
    render(){
        return (
            <div className={this.props.className}>
                <h1>Todo list</h1>
                <form onSubmit={this.handleSubmit}>
                    <input ref={nameInput => this._title }/>
                    <button onSubmit={handleSubmit}>Add</button>
                <form>
                <ul>
                { this.props.todo.list.map(item => (
                    <li>
                        <strong>{item.title}</strong>
                        <a onClick={this.props.model.todo.remove(item.id)}>
                            Remove
                        </a>
                    </li>
                )}
                </ul>
            </div>
        )
    }
}

export default connectWithModels(['todo'])(TodoList)
```
The connectWithModels higher order component is entirely optional. 

You can also dispatch actions using:
```
dispatch( { type: 'todo/add }, payload: 'Buy milk' } )
```
The todo list will live in state/todo and can be accessed using a regular mapStateToProps
if you do not use connectWithModels.

### Dynamic, HMR-powered, and reusable

Models can be loaded and unloaded dynamically. They work with hot module reloading.
They can easily be transfered between projects - for instance, you could write an
auth module that can be used in all of your company's project.

### Namespacing

Actions in models are namespaced, so that you can have an 'add' or 'remove' action
in all of your models without issues. The actions get the model namespace as a prefix - 
for instance, in the below example, the actions are `todo/add` and `todo/remove`.

Namespacing removes the need for constants to keep action type names constant between
different parts of the code.

### Implicit action creators

Action creators are created automatically for reducers or effects without an explicit action.
This removes the need for much of the boilerplate action creators that simply dispatch plain actions.

### Default 'update' reducer created automatically

Many reducers simply put the action payload in the store state. With react-models,
an 'update' reducer (and corresponding action creator) is created by default, thus
eliminating much boilerplate code.

## Installation

```$xslt
npm install --save react-models
```

## Redux store setup

```
import { loadModels, modelReducer, connectModelsToStore } from 'react-models'
import models from './models/index'

const store = createStore(
        combineReducers(modelReducer, otherReducers),
        initialState
        sagaMiddleware
    )
connectModelsToStore(store, sagaMiddleware, history)
loadModels(models)
```
* A modelReducer is exported that contains the reducers of all models
(updated as models are loaded and unloaded)
* connectModelsToStore can be called without sagaMiddleware or history too.
If sagaMiddleware is not specified, effects will not work.
If history is not specified, models will not have access to the history object.
* loadModels can be called later as well - however, be careful if components have dependencies on one another.

### Subscriptions

In addition to the common Redux functions, react-models introduces Redux-aware
subscriptions. Subscriptions are functions that watch something for changes.
Common usages include watching for URL changes and dispatching Redux actions in
response to them, listening to keyboard events, and listening to Socket.io events.

## Tests

Please refer to the tests folder for examples and common usages.

