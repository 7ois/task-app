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

  const [taskList, setTaskList] = useState<Task[]>([])
  const [filter, setFilter] = useState<'all' | 'todo' | 'doing' | 'done'>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  const toggleStatus = (id: number) => {
    const newTaskList = taskList.map(item => {
      let newStatus = item.status
      if (item.id === id) {
        if (item.status === 'todo') {
          newStatus = 'doing'
        } else if (item.status === 'doing') {
          newStatus = 'done'
        } else {
          newStatus = 'todo'
        }
        return { ...item, status: newStatus }
      }
      return item
    })

    setTaskList(newTaskList)
  }

  // const filteredTasks = taskList.filter(item => {
  //   if (filter === 'all') return true
  //   return item.status === filter
  // })

  const filteredTasks = useMemo(() => {
    if (filter === 'all') return taskList
    return taskList.filter(task => task.status === filter)
  }, [taskList, filter])

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main>
        <h1>My Task App</h1>
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
                <TaskItem task={item} onToggleStatus={toggleStatus} />
              </li>
            ))}
          </ul>
        )}
        {error && <p className="text-red-500">{error}</p>}
      </main>
    </div>
  );
}
