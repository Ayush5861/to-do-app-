import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import { setTodo , addTodoAction, removeTodo, editTodo } from "../redux/todoSlice";
import {  getToDoData } from "../services/todoService";
// import TodoCard from "./TodoCard";
import type { todo } from "../types/todo";

const TodoList = () => {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [newToDoName , setNewToDoName] = useState<string>("");
  const [newToDoStatus, setNewToDoStatus] = useState<boolean>(false);
  const [editedToDoName , setEditedToDoName] = useState<string>("");
  const [editedToDoStatus , setEditedToDoStatus] = useState<boolean>(false);
  const [currentPage , setCurrentPage] = useState<number>(1);
  const [editId , setEditId] = useState<number|null>(null);
  const todosInOnePage = 10;

  const dispatch = useDispatch<AppDispatch>();
  
  const todos = useSelector(
    (state: RootState) => state.todos.todos || []
  );

  const totalPage : number = Math.ceil((todos.length)/todosInOnePage);
  console.log(totalPage);
  const startIndex : number = (currentPage-1) * todosInOnePage
  const endIndex : number = startIndex + todosInOnePage
  const currentItems : todo[] = todos.slice(startIndex,endIndex)


  const handleAddTodo =   () =>{
     if (!newToDoName.trim()) return;
    let newTodo : todo = {
        id: Date.now(),
        todo : newToDoName,
        completed : newToDoStatus
    }
    // const data = await addTodo(newTodo)
    dispatch(addTodoAction(newTodo))
     setNewToDoName("");
    setNewToDoStatus(false);
  }

  //edit functionality
   
  const handleEdit = (id:number) =>{
    const todoEdit = todos.find((todo)=>todo.id === id)
    if(!todoEdit) return
    
      setEditId(id);
      setEditedToDoName(todoEdit.todo)
      setEditedToDoStatus(todoEdit.completed)
  }

  const handleEditSaveButton = () =>{
       
        if(editId===null) return;
        if (!editedToDoName.trim()) return;

        const updatedTodo = {
          id : editId,
          todo : editedToDoName,
          completed : editedToDoStatus
        }
        dispatch(editTodo(updatedTodo))

        setEditId(null);
        setEditedToDoName("");
  setEditedToDoStatus(false);
  }  


  useEffect(() => {
    const getTodos = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getToDoData();
       
        dispatch(setTodo(data));
      } catch (error) {
        setError(String(error));
      } finally {
        setLoading(false);
      }
    };

    getTodos();
  }, [dispatch]);

  if (loading === true) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <>
     <table className="border">
  <thead>
    <tr>
      <th>ID</th>
      <th>Todo</th>
      <th>Completed</th>
      <th>Action</th>
    </tr>
  </thead>

  <tbody>
    {currentItems.map((todo) => (
      <tr key={todo.id}>
        <td>{todo.id}</td>
        <td>{todo.todo}</td>
        <td>
          {todo.completed ? "Completed" : "Not Completed"}
        </td>
        <td>
          <button
            onClick={() => dispatch(removeTodo(todo.id))}
            className="cursor-pointer"
          >
            Delete
          </button>
          <button onClick={()=>handleEdit(todo.id)} className="cursor-pointer ml-3">
            Edit
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
<div className="flex justify-end gap-7 m-5"> 
<button className="cursor-pointer" onClick={()=>{
  setCurrentPage((prev)=>{
    if(prev-1 === 0 ) return totalPage;
    return prev-1;
  })
}}>Previous</button>
<p>{currentPage}</p>
<button className="cursor-pointer" onClick={()=>{
  setCurrentPage((prev)=>{
    
   if(prev+1 > totalPage) return 1;
    return prev+1;
}
  )
}}>Next</button>
</div>
{editId ? (
  <>
  
         <p>Edit data</p><div>
            <label>Add what's in your mind</label>
            <input type="text" value={editedToDoName} onChange={(e)=>setEditedToDoName(e.target.value)} />
            <label>Completed
              <input
                type="checkbox" checked={editedToDoStatus} onChange={(e)=>setEditedToDoStatus(e.target.checked)}
               />
            </label>
            <button onClick={handleEditSaveButton}>Save</button>
          </div>
          </>
)
:(
 <><p>Add new data</p><div>
            <label>Add what's in your mind</label>
            <input type="text" value={newToDoName} onChange={(e) => setNewToDoName(e.target.value)} />
            <label>Completed
              <input
                type="checkbox"
                checked={newToDoStatus}
                onChange={(e) => setNewToDoStatus(e.target.checked)} />
            </label>
            <button onClick={handleAddTodo}>Add to do</button>
          </div></>
)}
   
    </>
  );
};

export default TodoList;