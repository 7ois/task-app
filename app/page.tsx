"use client"
import { useEffect, useMemo, useState } from "react";
import TaskSearch from "../components/TaskSearch";
import TaskFilter from "../components/TaskFilter";
import TaskList from "../components/TaskList";
import TaskColumn from "../components/TaskColumn";

type Task = {
  id: number
  title: string;
  status: string;
}

export default function Home() {

  const [taskList, setTaskList] = useState<Task[]>([])
  // const [filter, setFilter] = useState<'all' | 'todo' | 'doing' | 'done'>('all')
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

  const groupedTasks = useMemo(() => {
    return {
      todo: taskList.filter(t => t.status === "todo"),
      doing: taskList.filter(t => t.status === "doing"),
      done: taskList.filter(t => t.status === "done"),
    }
  }, [taskList])

  const tempId = Date.now()
  const optimistictask: Task = {
    id: tempId,
    title: newTaskTitle,
    status: "todo"
  }

  // const filteredTasks = useMemo(() => {
  //   if (filter === 'all') return taskList
  //   return taskList.filter(task => task.status === filter)
  // }, [taskList, filter])

  const handleAddTask = async () => {

    if (!newTaskTitle.trim() || isAdding) return

    setIsAdding(true)
    setTaskList(prev => [...prev, optimistictask])
    setNewTaskTitle("")

    try {
      const res = await fetch('/api/tasks', {
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
    <div className="flex flex-col min-h-screen font-sans bg-linear-to-b from-black to-[#6155F5]">
      <div className="m-30 flex flex-col gap-5">
        <div className="flex flex-col items-center justify-center gap-5 text-[#6155F5]">
          <h1 className="text-6xl font-bold">My Task App</h1>
          <p>Description</p>
        </div>
        <TaskSearch value={newTaskTitle} onChange={setNewTaskTitle} onSubmit={handleAddTask} loading={isAdding} />
        <main className="grid grid-cols-3 flex-1 gap-5">
          {/* <TaskFilter value={filter} onChange={setFilter} /> */}
          <TaskColumn title="Todo" loading={loading} error={error} groupedTasks={groupedTasks.todo} toggleStatus={toggleStatus} deleteTask={deleteTask} />
          <TaskColumn title="doing" loading={loading} error={error} groupedTasks={groupedTasks.doing} toggleStatus={toggleStatus} deleteTask={deleteTask} />
          <TaskColumn title="done" loading={loading} error={error} groupedTasks={groupedTasks.done} toggleStatus={toggleStatus} deleteTask={deleteTask} />
        </main>
      </div>
    </div>
  );
}
