"use client"
import TaskItem from "@/components/TaskItem";
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
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    fetch("/api/tasks")
      .then(res => {
        if (!res.ok) throw new Error("Fetch failed!")
        return res.json()
      })
      .then(data => setTaskList(data))
      .catch(() => setError("โหลด task ไม่สำเร็จ"))
      .finally(() => setLoading(false))
  }, [])

  const toggleStatus = async (id: number) => {

    const prevTasks = taskList

    const currentTask = taskList.find(task => task.id === id)
    if (!currentTask) return

    const nextStatus = currentTask.status === "todo" ? "doing" : currentTask.status === "doing" ? "done" : "todo"
    setTaskList(prev => prev.map(task => (
      task.id === id ? { ...task, status: nextStatus } : task
    )))

    try {
      const res = await fetch("api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: nextStatus })
      })

      if (!res.ok) throw new Error("Update failed!")
      const updateTask = await res.json()
      setTaskList(prev => prev.map(task => task.id === id ? updateTask : task))
    } catch (err) {
      alert("อัปเดตสถานะไม่สำเร็จ")
      setTaskList(prevTasks)
    }
  }

  const filteredTasks = useMemo(() => {
    if (filter === 'all') return taskList
    return taskList.filter(task => task.status === filter)
  }, [taskList, filter])

  const tempId = Date.now()
  const optimistictask: Task = {
    id: tempId,
    title: newTaskTitle,
    status: "todo"
  }

  const handleAddTask = async () => {

    if (!newTaskTitle.trim() || isAdding) return

    setIsAdding(true)
    setTaskList(prev => [...prev, optimistictask])
    setNewTaskTitle("")

    try {
      const res = await fetch('/api/taskss', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: optimistictask.title })

      })

      if (!res.ok) throw new Error("Add failed")
      const savedTask = await res.json()
      setTaskList(prev => prev.map(task => task.id === tempId ? savedTask : task))
      setNewTaskTitle('')
    } catch {
      setTaskList(prev => prev.filter(task => task.id !== tempId))
      alert("Add task failed")
    } finally {
      setIsAdding(false)
    }
  }

  const deleteTask = async (id: number) => {
    const ok = confirm("ลบ task นี้แน่ใจไหม?")
    if (!ok) return

    const prevTasks = taskList
    setTaskList(prev => prev.filter(task => task.id !== id))

    try {
      const res = await fetch(`api/tasks?id=${id}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Delete failed!")
    } catch {
      alert("ลบไม่สำเร็จ!")
      setTaskList(prevTasks)
    }

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
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddTask()
              }
            }}
            className="border pl-2" />
          <button
            disabled={isAdding}
            className="border p-2 cursor-pointer"
            onClick={handleAddTask}
          >{isAdding ? "Adding..." : "ADD"}</button>
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
            {!error && filteredTasks.length === 0 ? (<p className="text-gray-400">ยังไม่มี task</p>)
              : filteredTasks.map(item => (
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
