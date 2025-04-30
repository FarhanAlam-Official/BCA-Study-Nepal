import React from 'react';
import TodoList from '../../components/tools/TodoList';
import TodoComponents from '../../context/TodoContext';
import NotificationComponents from '../../context/NotificationContext';

const TodoPage: React.FC = () => {
  return (
    <NotificationComponents.Provider>
      <TodoComponents.Provider>
        <TodoList />
      </TodoComponents.Provider>
    </NotificationComponents.Provider>
  );
};

export default TodoPage;
