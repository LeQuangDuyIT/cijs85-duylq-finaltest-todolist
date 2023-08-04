export const todoListStorage = {
  load: () => {
    const data = localStorage.getItem('todoList');
    return data ? JSON.parse(data) : [];
  },
  save: todoList => {
    const data = JSON.stringify(todoList);
    localStorage.setItem('todoList', data);
  },
  add: newTodo => {
    const data = todoListStorage.load();
    const newData = [...data, newTodo];
    todoListStorage.save(newData);
  },
  update: newTodo => {
    const data = todoListStorage.load();
    const newData = data.map(todo => (todo.id === newTodo.id ? newTodo : todo));
    todoListStorage.save(newData);
  },
  removeTodo: removeId => {
    const data = todoListStorage.load();
    const newData = data.filter(todo => todo.id !== removeId);
    todoListStorage.save(newData);
  },
  removeAll: () => localStorage.removeItem('todoList')
};
