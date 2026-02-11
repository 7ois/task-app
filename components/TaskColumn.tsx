import TaskList from "./TaskList";

type Task = {
    id: number
    title: string;
    status: string;
}

type props = {
    title: string,
    loading: boolean,
    error: string | null,
    groupedTasks: Task[],
    toggleStatus: (id: number) => void,
    deleteTask: (id: number) => void
}

export default function TaskColumn({ title, loading, error, groupedTasks, toggleStatus, deleteTask }: props) {
    return (
        <div className="flex flex-col gap-5 rounded-md w-full h-125 px-5 shadow-lg">
            <div className="w-full flex items-center justify-center border-b">
                <h1 className="font-bold">{title}</h1>
            </div>
            <TaskList loading={loading} error={error} tasks={groupedTasks} toggleStatus={toggleStatus} onDelete={deleteTask} />
        </div>

    )
}