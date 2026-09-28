import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import {
  setTodo,
  addTodoAction,
  removeTodo,
  editTodo,
} from "../redux/todoSlice";
import { getToDoData } from "../services/todoService";
import type { todo } from "../types/todo";
import { useFormik } from "formik";

const TodoList = () => {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [editId, setEditId] = useState<number | null>(null);

  const todosInOnePage = 10;

  const dispatch = useDispatch<AppDispatch>();

  const todos = useSelector(
    (state: RootState) => state.todos.todos || []
  );

  const totalPage = Math.ceil(todos.length / todosInOnePage);
  const startIndex = (currentPage - 1) * todosInOnePage;
  const endIndex = startIndex + todosInOnePage;
  const currentItems: todo[] = todos.slice(startIndex, endIndex);

  const addFormik = useFormik({
    initialValues: {
      todo: "",
      completed: false,
    },
    onSubmit: (values, { resetForm }) => {
      if (!values.todo.trim()) return;

      const newTodo: todo = {
        id: Date.now(),
        todo: values.todo,
        completed: values.completed,
      };

      dispatch(addTodoAction(newTodo));
      resetForm();
    },
  });

  const editFormik = useFormik({
    initialValues: {
      todo: "",
      completed: false,
    },
    onSubmit: (values, { resetForm }) => {
      if (editId === null) return;
      if (!values.todo.trim()) return;

      const updatedTodo: todo = {
        id: editId,
        todo: values.todo,
        completed: values.completed,
      };

      dispatch(editTodo(updatedTodo));

      setEditId(null);
      resetForm();
    },
  });

  const handleEdit = (id: number) => {
    const todoEdit = todos.find((todo) => todo.id === id);

    if (!todoEdit) return;

    setEditId(id);

    editFormik.setValues({
      todo: todoEdit.todo,
      completed: todoEdit.completed,
    });
  };

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

  if (loading) {
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
                {todo.completed
                  ? "Completed"
                  : "Not Completed"}
              </td>

              <td>
                <button
                  onClick={() => dispatch(removeTodo(todo.id))}
                  className="cursor-pointer"
                >
                  Delete
                </button>

                <button
                  onClick={() => handleEdit(todo.id)}
                  className="cursor-pointer ml-3"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end gap-7 m-5">
        <button
          className="cursor-pointer"
          onClick={() => {
            setCurrentPage((prev) => {
              if (prev - 1 === 0) return totalPage;
              return prev - 1;
            });
          }}
        >
          Previous
        </button>

        <p>{currentPage}</p>

        <button
          className="cursor-pointer"
          onClick={() => {
            setCurrentPage((prev) => {
              if (prev + 1 > totalPage) return 1;
              return prev + 1;
            });
          }}
        >
          Next
        </button>
      </div>

      {editId !== null ? (
        <>
          <p>Edit data</p>

          <form onSubmit={editFormik.handleSubmit}>
            <label>
              Edit what's in your mind
            </label>

            <input
              type="text"
              name="todo"
              value={editFormik.values.todo}
              onChange={editFormik.handleChange}
            />

            <label>
              Completed
              <input
                type="checkbox"
                name="completed"
                checked={editFormik.values.completed}
                onChange={editFormik.handleChange}
              />
            </label>

            <button type="submit">
              Save
            </button>
          </form>
        </>
      ) : (
        <>
          <p>Add new data</p>

          <form onSubmit={addFormik.handleSubmit}>
            <label>
              Add what's in your mind
            </label>

            <input
              type="text"
              name="todo"
              value={addFormik.values.todo}
              onChange={addFormik.handleChange}
            />

            <label>
              Completed
              <input
                type="checkbox"
                name="completed"
                checked={addFormik.values.completed}
                onChange={addFormik.handleChange}
              />
            </label>

            <button type="submit">
              Add to do
            </button>
          </form>
        </>
      )}
    </>
  );
};

export default TodoList;