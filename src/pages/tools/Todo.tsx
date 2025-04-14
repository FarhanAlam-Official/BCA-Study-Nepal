import React from 'react';
import TodoList from '../../components/tools/TodoList';
import TodoComponents from '../../components/tools/TodoList/TodoContext';
import NotificationComponents from '../../components/tools/TodoList/NotificationContext';

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
