const React = require('react')

const TodoItem = React.createClass({
  getInitialState(){
    return({
      editText: this.props.todo.title
    })
  },
  handleEdit(){
    this.props.onEdit()
  },
  handleChange(e){
    this.setState({editText: e.target.value})
  },
  handleSubmit(e){
    this.props.onSave(this.state.editText)
  },
  render () {
    let id = this.props.todo.id
    const todoState = () => {
      if(this.props.todo.complete) {return 'completed'}
      if(this.props.editing === this.props.todo.id) {return 'editing'}
      return ''
    }
    const itemState = () => {
      if (this.props.todo.completed) {
        return 'completed'
      }
      if(this.props.editing === this.props.todo.id){
        return 'editing'
      }
      return ''
    }
    return (
      <li className={itemState()}>
        <div className="view">
          <input type="checkbox" checked={false} onChange={this.props.toggleCheckbox} className="toggle"/>
          <label onDoubleClick={this.handleEdit} htmlFor="" >{this.props.todo.title}</label>
          <button className="destroy" onClick={this.props.delete(id)}></button>
        </div>
        <input type="text" onChange={this.handleChange} onBlur={this.handleSubmit} className="edit" value={this.state.editText}/>
      </li>
    )
  }
})

module.exports = TodoItem
