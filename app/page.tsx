"use client"
import TaskItem from "@/components/TaskItem";
import { tasks } from "@/lib/tasks";
import { useEffect, useMemo, useState } from "react";

type Task = {
  id: number
  title: string;
  status: string;
}

const filterList: { id: number, listType: 'all' | 'todo' | 'doing' | 'done' }[] = [
  { id: 1, listType: 'all' },
  { id: 2, listType: 'todo' },
  { id: 3, listType: 'doing' },
  { id: 4, listType: 'done' },
]

export default function Home() {

  const [taskList, setTaskList] = useState<Task[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('tasks')
      return stored ? JSON.parse(stored) : tasks
    }
    return tasks
  })
  const [filter, setFilter] = useState<'all' | 'todo' | 'doing' | 'done'>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newTaskTitle, setNewTaskTitle] = useState('')

  useEffect(() => {
    fetch("/api/tasks")
      .then(res => {
        if (!res.ok) throw new Error("Fetch failed!")
        return res.json()
      })
      .then(data => setTaskList(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(taskList))
  }, [taskList])

  // const toggleStatus = (id: number) => {
  //   const newTaskList = taskList.map(item => {
  //     let newStatus = item.status
  //     if (item.id === id) {
  //       if (item.status === 'todo') {
  //         newStatus = 'doing'
  //       } else if (item.status === 'doing') {
  //         newStatus = 'done'
  //       } else {
  //         newStatus = 'todo'
  //       }
  //       return { ...item, status: newStatus }
  //     }
  //     return item
  //   })

  //   setTaskList(newTaskList)
  // }

  const toggleStatus = async (id: number) => {
    const res = await fetch("api/tasks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    })

    const updateTask = await res.json()

    setTaskList(prev => (
      prev.map(task => task.id === id ? updateTask : task)
    ))
  }

  const filteredTasks = useMemo(() => {
    if (filter === 'all') return taskList
    return taskList.filter(task => task.status === filter)
  }, [taskList, filter])

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return

    const res = await fetch('/api/tasks', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTaskTitle })
    })
    // const newTask: Task = {
    //   id: Date.now(),
    //   title: newTaskTitle,
    //   status: 'todo'
    // }
    const newTask = await res.json()
    setTaskList(prev => [...prev, newTask])
    setNewTaskTitle('')
  }

  const deleteTask = (id: number) => {
    setTaskList(prev => prev.filter(task => task.id !== id))
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main>
        <h1>My Task App</h1>
        <div className="my-2 flex gap-5">
          <input
            type="text"
            placeholder="เพิ่มงานใหม่..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="border pl-2" />
          <button
            className="border p-2 cursor-pointer"
            onClick={handleAddTask}
          >ADD</button>
        </div>
        <div className="flex gap-10">
          {filterList.map(item => (
            <button
              key={item.id}
              className={`cursor-pointer ${filter === item.listType ? "border-b" : ""}`}
              onClick={() => setFilter(item.listType)}
            >
              {item.listType}
            </button>
          ))}
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {filteredTasks.map(item => (
              <li key={item.id}>
                <TaskItem task={item} onToggleStatus={toggleStatus} onDelete={deleteTask} />
              </li>
            ))}
          </ul>
        )}
        {error && <p className="text-red-500">{error}</p>}
      </main>
    </div>
  );
}
