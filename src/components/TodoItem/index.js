import React, { useState } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPencil } from '@fortawesome/free-solid-svg-icons';

import styles from './TodoItem.module.scss';
let cx = classNames.bind(styles);

const TodoItem = ({
  data,
  handleUpdateTodo,
  handleRemoveTodo,
  onClickToEditing,
  todoEditingId
}) => {
  const { id, title, isCompleted } = data;
  const [checked, setChecked] = useState(isCompleted);

  const onCheckCompleted = () => {
    setChecked(prevValue => {
      const newTodo = {
        ...data,
        isCompleted: !prevValue
      };
      handleUpdateTodo(newTodo);
      return !prevValue;
    });
  };

  return (
    <div className={cx('todo-item', { 'todo-item__editing': todoEditingId === id })}>
      <div className={cx('todo-item__content')}>
        <input type="checkbox" id={`todo-${id}`} checked={checked} onChange={onCheckCompleted} />
        <label htmlFor={`todo-${id}`} className={cx({ 'todo-checked': checked })}>
          {title}
        </label>
      </div>
      <div className={cx('todo-item__setting')}>
        <button className={cx('edit-btn')} onClick={onClickToEditing}>
          <FontAwesomeIcon icon={faPencil} size="sm" />
        </button>
        <button className={cx('remove-btn')} onClick={() => handleRemoveTodo(id)}>
          <FontAwesomeIcon icon={faTrash} size="sm" />
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
