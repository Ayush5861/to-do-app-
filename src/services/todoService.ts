import type { todo } from "../types/todo";
import axios from "axios";

export async function getToDoData(): Promise<todo[]> {
  const response = await axios.get(import.meta.env.VITE_API_URL);

  return response.data.todos;
}

// export async function addTodo(toDoNewData : todo):Promise<todo>{
//     const response = await axios.post("https://dummyjson.com/todos/add",toDoNewData)
//     return response.data;
// }

// export async function deleteTodo(id:number) : Promise<todo>{

// const response = await axios.delete(`https://dummyjson.com/todos/${id}`)
// return response.data
// }