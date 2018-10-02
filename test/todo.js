import {connectWithModels} from '../src/connectWithModels'

class TodoList extends React.Component {
    handleSubmit = e => {
        e.preventDefault()
        const title = ReactDOM.findDOMNode(this._title).value;
        this.models.todo.add(title)
    }

    render() {
        return (
            <div className={this.props.className}>
                <h1>Todo list</h1>
                <form onSubmit={this.handleSubmit}>
                    <input ref={nameInput => this._title}/>
                    <button onSubmit={handleSubmit}>Add</button>
                </form>
                <ul>
                    {this.props.todo.list.map(item => (
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
