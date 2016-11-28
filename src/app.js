const React = require('react')
const {reject,filter} = require('ramda')
const uuid = require('uuid')

const TodoItem = require('./todo-item')

const App = React.createClass({
  getInitialState(){
    return ({
      newTodo: {
        title: ''
      },
      todos: [{
        title: 'Alex',
        completed: false,
        id: uuid()
      }],
      completedTodos: [],
      show: 'all',
      editing: null,
      viewState: 'all'
    })
  },
  handleChange(e){
   let newTodo = {
     id: uuid(),
     title: e.target.value,
     completed: false
   }
   this.setState({newTodo})
  },
  handleSubmit(e){
     e.preventDefault()
     let newItem = this.state.newTodo
     let currentTodos = [
         ...this.state.todos,
         newItem
       ]
      this.setState({
        todos: currentTodos,
        newTodo: {
          title: ''
        },
     })
  },
  handleToggle(id){
    const toggleState = (id) => {
      return item => {
        if(item.id === id){
          item.completed = !item.completed
        }
        return item
      }
    }

    return e => {
      e.preventDefault()
      let todos = this.state.todos.map(toggleState(id))
      console.log('todos',todos)
      this.setState({todos})
      this.updateTodos()
    }
  },
  onFocus(e){
    console.log('focus')
  },
  deleteItem(id){
    return e => {
      e.preventDefault()
      console.log('deleteid',id)
      let filteredTodos = reject( item => item.id === id ,this.state.todos)
      this.setState({
        todos: filteredTodos
      })
    }
  },
  updateTodos(){
    let completedTodos = filter(item => item.completed,this.state.todos)
    this.setState({
      completedTodos,
    })
  },
  show(view){
    return e => {
      e.preventDefault()
      this.setState({
        viewState: view
      })
    }
  },
  clearCompleted(e){
    e.preventDefault()

    const todos = filter(item => !item.completed ,this.state.todos)
    this.setState({todos})
  },
  editTodo(todo){
    return e => {
      this.setState({
        editing: todo.id
      })
    }
  },
  saveTodo(todo){
    return title => {
      const todos = this.state.todos.map(
        item => {
          if (item.id === todo.id){
            item.title = title
          }
          return item
        }
      )
      this.setState({
        editing: null,
        todos
      })
    }
  },
  render() {
    console.log(this.state)

    const li = item => {
      return <TodoItem key={item.id}
                       toggleCheckbox={this.handleToggle(item.id)}
                       onFocus={this.onFocus}
                       delete={this.deleteItem}
                       completed={item.completed}
                       todo={item}
                       handleBlur={this.handleBlur}
                       onEdit={this.editTodo(item)}
                       editing={this.state.editing}
                       onSave={this.saveTodo(item)}
                      />
    }
    var showTodos

    let activeCount = this.state.todos.reduce((acc,v) => {
      if(!v.completed){
        return ++acc
      }else {
        return acc
      }
    }, 0)

    return (
      <section className="todoapp">
        <header className="header">
          <h1>Todos</h1>
          <form onSubmit={this.handleSubmit}>
            <input className="new-todo" value={this.state.newTodo.title} onChange={this.handleChange} type="text" placeholder="What needs to be done?" autoFocus />
          </form>
        </header>
        <section id="main">
          <input type="checkbox" className="toggle-all" />
          <label htmlFor="toggle-all">Mark all as complete</label>
          <ul className="todo-list">
            {this.state.todos.filter(item => {
              if(this.state.viewState === 'active'){
                return !item.completed
              }else if(this.state.viewState === 'completed'){
                return item.completed
              }else {
                return true
              }
            }).map(li)}
          </ul>
        </section>
        <footer className="footer">
          <span className="todo-count"><strong>{activeCount}</strong> item(s) left</span>
          <ul className="filters">
            <li><a href="/" onClick={this.show('all')}>All</a></li>
            <li>
              <a onClick={this.show('active')} href="/active">Active</a>
            </li>
            <li><a onClick={this.show('completed')} href="/completed">Completed</a></li>
          </ul>
          <button onClick={this.clearCompleted} className="clear-completed">Clear completed</button>
        </footer>
      </section>
    )
  }
})

module.exports = App
