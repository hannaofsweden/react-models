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

### Dynamic, HMR-powered, and transferrable

Models can be loaded and unloaded dynamically. They work with hot module reloading.
They can easily be transfered between projects - for instance, you could write an
auth module that can be used in all of your company's project.

### Subscriptions

In addition to the common Redux functions, react-models introduces Redux-aware
subscriptions. Subscriptions are functions that watch something for changes.
Common usages include watching for URL changes and dispatching Redux actions in
response to them, listening to keyboard events, and listening to Socket.io events.

## Installation

```$xslt
npm install --save react-models
```

## Tests

Please refer to the tests folder for examples and common usages.

