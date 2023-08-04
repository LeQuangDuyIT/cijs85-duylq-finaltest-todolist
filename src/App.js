import className from 'classnames/bind';

import AddForm from './components/AddForm';
import { useMemo, useState } from 'react';
import TodoItem from './components/TodoItem';
import { todoListStorage } from './utils/local-storage';
import styles from './styles/global.scss';
import { TODO_FILTER } from './utils/contants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
let cx = className.bind(styles);

function App() {
  const [todoList, setTodoList] = useState(() => todoListStorage.load());
  const [filterType, setFilterType] = useState(TODO_FILTER.ALL);
  const [todoEditingId, setTodoEditingId] = useState(null);

  const handleFilter = type => {
    setFilterType(type);
    const data = todoListStorage.load();
    let newTodoList = [];
    switch (type) {
      case TODO_FILTER.ALL:
        newTodoList = todoListStorage.load();
        break;
      case TODO_FILTER.ACTIVE:
        newTodoList = data.filter(todo => !todo.isCompleted);
        break;
      case TODO_FILTER.COMPLETED:
        newTodoList = data.filter(todo => todo.isCompleted);
        break;
      default:
        newTodoList = todoListStorage.load();
    }
    setTodoList(newTodoList);
  };

  const handleAddTodo = newTodo => {
    const newTodoList = [...todoList, newTodo];
    setTodoList(newTodoList);

    todoListStorage.add(newTodo);
  };

  const handleUpdateTodo = newTodo => {
    const newTodoList = todoList.map(todo => (todo.id === newTodo.id ? newTodo : todo));
    setTodoList(newTodoList);

    todoListStorage.update(newTodo);
  };

  const handleRemoveTodo = removeId => {
    const newTodoList = todoList.filter(todo => todo.id !== removeId);
    setTodoList(newTodoList);

    todoListStorage.removeTodo(removeId);
  };

  const handleRemoveAll = () => {
    setTodoList([]);
    setFilterType(TODO_FILTER.ALL);

    todoListStorage.removeAll();
  };

  const todoListElements = useMemo(
    () =>
      todoList.map(todo => (
        <TodoItem
          key={todo.id}
          data={todo}
          handleUpdateTodo={handleUpdateTodo}
          handleRemoveTodo={handleRemoveTodo}
          onClickToEditing={() => setTodoEditingId(todo.id)}
          todoEditingId={todoEditingId}
        />
      )),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [todoList, todoEditingId]
  );

  const isEmptyData = todoListStorage.load().length === 0;

  return (
    <div className={cx('site-container')}>
      <div className={cx('site-core')}>
        <h1 className={cx('app-title')}>#todo</h1>
        <div className={cx('filter-bar')}>
          <div
            className={cx('filter-option', { 'filter-selected': filterType === TODO_FILTER.ALL })}
            onClick={() => handleFilter(TODO_FILTER.ALL)}
          >
            All
          </div>
          <div
            className={cx('filter-option', {
              'filter-selected': filterType === TODO_FILTER.ACTIVE
            })}
            onClick={() => handleFilter(TODO_FILTER.ACTIVE)}
          >
            Active
          </div>
          <div
            className={cx('filter-option', {
              'filter-selected': filterType === TODO_FILTER.COMPLETED
            })}
            onClick={() => handleFilter(TODO_FILTER.COMPLETED)}
          >
            Completed
          </div>
        </div>
        <AddForm
          handleAddTodo={handleAddTodo}
          handleUpdateTodo={handleUpdateTodo}
          todoEditingId={todoEditingId}
          handleResetForm={() => setTodoEditingId(null)}
        />
        <div className={cx('todo-list')}>
          {todoListElements}
          {isEmptyData && <p className={cx('empty-noti')}>List is empty, please add todo.</p>}
        </div>
        {!isEmptyData && (
          <button className={cx('remove-all-btn')} onClick={handleRemoveAll}>
            <FontAwesomeIcon icon={faTrash} />
            Delete All
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
