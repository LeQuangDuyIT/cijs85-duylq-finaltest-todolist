import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames/bind';
import { v4 as uuidv4 } from 'uuid';

import { todoListStorage } from '../../utils/local-storage';
import styles from './AddForm.module.scss';
let cx = classNames.bind(styles);

const AddForm = ({ handleAddTodo, handleUpdateTodo, todoEditingId, handleResetForm }) => {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState(false);

  const formRef = useRef(null);
  const inputRef = useRef(null);

  const getTodoTitleById = () => {
    const data = todoListStorage.load();
    const editingTodo = data.find(todo => todo.id === todoEditingId);
    setInputValue(editingTodo.title);
    inputRef.current.focus();
  };

  useEffect(() => {
    if (!todoEditingId) return;
    getTodoTitleById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todoEditingId]);

  const handleSubmitAdd = () => {
    const newTodo = {
      id: uuidv4(),
      title: inputValue,
      isCompleted: false
    };
    handleAddTodo(newTodo);
  };

  const handleSubmitUpdate = () => {
    const data = todoListStorage.load();
    const editingTodo = data.find(todo => todo.id === todoEditingId);
    const updatedTodo = {
      ...editingTodo,
      title: inputValue
    };
    handleUpdateTodo(updatedTodo);
    handleResetForm();
  };

  const onSubmitForm = e => {
    e.preventDefault();
    if (inputValue.length === 0) {
      setError(true);
      return;
    }
    if (!todoEditingId) {
      handleSubmitAdd();
    } else {
      handleSubmitUpdate();
    }
    setInputValue('');
    inputRef.current.focus();
  };

  return (
    <form ref={formRef} className={cx('add-form')} onSubmit={onSubmitForm}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Add Todo"
        className={cx({ 'input-error': error })}
        value={inputValue}
        onInput={() => setError(false)}
        onChange={e => setInputValue(e.target.value)}
        autoFocus
      />
      <button type="submit">{todoEditingId ? 'Edit' : 'Add'}</button>
    </form>
  );
};

export default AddForm;
