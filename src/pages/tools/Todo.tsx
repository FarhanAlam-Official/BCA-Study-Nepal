/**
 * Todo Page Component
 * 
 * Main container for the Todo application that provides necessary context providers
 * and renders the todo list interface.
 * 
 * Features:
 * - Integrated notification system through NotificationContext
 * - Todo state management through TodoContext
 * - Centralized context provider setup
 * - Clean component hierarchy
 * 
 * Context Providers:
 * - NotificationComponents.Provider: Manages notification state and display
 * - TodoComponents.Provider: Manages todo items state and operations
 */
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
