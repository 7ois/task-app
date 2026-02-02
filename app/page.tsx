"use client"
import TaskItem from "@/components/TaskItem";
import { tasks } from "@/lib/tasks";

export default function Home() {

  const handleClick = (id: number) => {
    console.log(id)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main>
        <h1>My Task App</h1>
        <ul>
          {tasks.map(item => (
            <li key={item.id}>
              <TaskItem task={item} onToggleStatus={handleClick} />
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
