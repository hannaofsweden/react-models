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

### Hello World: the old to-do-list example

```
// In model

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
    
// In component
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
                { props.todo.list.map(item => (
                    <li>
                        <strong>{item.title}</strong>
                        <a onClick={props.model.todo.remove(item.id)}>
                            Remove
                        </a>
                    </li>
                )}
                </ul>
            </div>
        )
    }
)

export default connectWithModels(['auth'])(TodoList)
```

### Dynamic, HMR-powered, and transferrable

Models can be loaded and unloaded dynamically. They work with hot module reloading.
They can easily be transfered between projects - for instance, you could write an
auth module that can be used in all of your company's project.

### Subscriptions

In addition to the common Redux functions, react-models introduces Redux-aware
subscriptions. Subscriptions are functions that watch something for changes.
Common usages include watching for URL changes and dispatching Redux actions in
response to them, listening to keyboard events, and listening to Socket.io events.

## Tests

Please refer to the tests folder for examples and common usages.

