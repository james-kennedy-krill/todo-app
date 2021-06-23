import { FormEvent, useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import { GetStaticProps } from 'next'

const APIURL = 'http://localhost:3004/todos'

type Todo = {
  id: number
  title: string
  completed: boolean
  owner: string
}

interface ApiProps {
  todos?: Todo[]
}

interface ComponentProps {
  todo: Todo
  fetchTodos: () => Promise<void>
}

const Todo = ({
  todo: initialTodo,
  fetchTodos,
}: ComponentProps): JSX.Element => {
  const [todo, setTodo] = useState(initialTodo)
  const [editable, setEditable] = useState(false)

  const updateTodo = async (): Promise<void> => {
    await fetch(`${APIURL}/${todo.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todo),
    })

    fetchTodos()
  }

  const deleteTodo = async (): Promise<void> => {
    await fetch(`${APIURL}/${todo.id}`, {
      method: 'DELETE',
    })
    fetchTodos()
  }

  const usePrevious = (value: Todo): Todo | undefined => {
    const ref: { current: Todo | undefined } = useRef()
    useEffect(() => {
      ref.current = value
    })
    return ref.current
  }

  const previousTodo = usePrevious(todo)

  useEffect(() => {
    if (!editable && previousTodo && todo.id) {
      updateTodo()
    }
  }, [editable, todo])

  return (
    <tr className="bg-white border-b-2 border-gray-500 hover:bg-gray-300">
      <td className="p-1 text-base text-left">
        <input
          type="checkbox"
          name={`completed-${todo.id}`}
          checked={todo.completed}
          onChange={() => setTodo({ ...todo, completed: !todo.completed })}
        />
      </td>
      <td className="p-1 text-base text-left">
        {editable ? (
          <input
            type="text"
            name={`todo-${todo.id}`}
            id={`todo-${todo.id}`}
            value={todo.title}
            onChange={(e) => setTodo({ ...todo, title: e.target.value })}
            onBlur={() => setEditable(false)}
          />
        ) : (
          <span
            onClick={() => setEditable(true)}
            className={`block cursor-pointer ${
              todo.completed && `line-through`
            }`}
          >
            {todo.title}
          </span>
        )}
      </td>
      <td className="p-1 text-base text-left">
        <span onClick={() => deleteTodo()} className="text-xs cursor-pointer">
          ✖
        </span>
      </td>
    </tr>
  )
}

const Todos = ({ todos: initialTodos = [] }: ApiProps = {}): JSX.Element => {
  const [todos, setTodos] = useState(initialTodos)
  const [todo, setTodo] = useState('')
  const [showCompleted, setShowCompleted] = useState(false)

  const fetchTodos = async (): Promise<void> => {
    const res: Response = await fetch(APIURL)
    const newTodos: Todo[] = await res.json()
    return setTodos(newTodos)
  }

  const addTodoItem = async (e: FormEvent<HTMLFormElement>): Promise<JSON> => {
    e.preventDefault()
    const newTodo = await fetch(APIURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: todo,
        completed: false,
        owner: 'typicode',
      }),
    })
    setTodo('')
    fetchTodos()
    return await newTodo.json()
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Todos</title>
        <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
      </Head>
      <table className="w-full max-w-prose">
        <thead>
          <tr>
            <th className="text-lg font-bold text-left">✔</th>
            <th className="text-lg font-bold text-left">Title</th>
            <th className="text-lg font-bold text-left"></th>
          </tr>
        </thead>
        <tbody>
          {todos.map(
            (todo: Todo) =>
              (!todo.completed || showCompleted) && (
                <Todo
                  key={`todo-${todo.id}`}
                  todo={todo}
                  fetchTodos={fetchTodos}
                />
              )
          )}
        </tbody>
        <tfoot>
          <tr>
            <td className="pt-2">
              <span role="img" aria-label="plus">
                ➕
              </span>
            </td>
            <td className="pt-2">
              <form onSubmit={addTodoItem}>
                <input
                  type="text"
                  name="new-todo"
                  id="new-todo"
                  onChange={(e) => setTodo(e.target.value)}
                  value={todo}
                  placeholder="Add a new todo here..."
                  className="w-full p-1 border-2 border-gray-500"
                />
              </form>
            </td>
            <td></td>
          </tr>
          <tr>
            <td colSpan={3} className="pt-2 text-center">
              <label htmlFor="showCompleted">
                <input
                  type="checkbox"
                  name="showCompleted"
                  id="showCompleted"
                  checked={showCompleted}
                  onChange={() => setShowCompleted(!showCompleted)}
                />{' '}
                Show Completed
              </label>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const res: Response = await fetch(APIURL)
  const todos: JSON = await res.json()

  return {
    props: {
      todos,
    },
  }
}

export default Todos
