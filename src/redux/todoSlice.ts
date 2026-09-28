import { createSlice, isAction } from "@reduxjs/toolkit";
import type { todo } from "../types/todo";

interface TodoState {
  todos: todo[];
}

const initialState: TodoState = {
  todos: [],
};

export const todoSlice = createSlice({
  name: "todos",
  initialState,

  reducers: {
    setTodo: (state, action) => {
      state.todos = action.payload;
    },

    addTodoAction: (state, action) => {
      state.todos.push(action.payload);
    },

    removeTodo: (state, action) => {
      state.todos = state.todos.filter(
        (todo) => todo.id !== action.payload
      );
    },
    editTodo : (state,action) => {
      const index = state.todos.findIndex((item)=>item.id===action.payload.id);
      if(index === -1){
      return;
      }
      state.todos[index] = action.payload
    }

    
  },
});

export const { addTodoAction, removeTodo, setTodo , editTodo } = todoSlice.actions;

export default todoSlice.reducer;