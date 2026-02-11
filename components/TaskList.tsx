import TaskItem from "./TaskItem"

type Task = {
    id: number
    title: string;
    status: string;
}

type props = {
    loading: boolean,
    error: string | null,
    tasks: Task[],
    toggleStatus: (id: number) => void,
    onDelete: (id: number) => void
}

export default function TaskList({ loading, error, tasks, toggleStatus, onDelete }: props) {
    return (
        <div className="overflow-y-auto no-scrollbar">
            {loading ? (
                <p>Loading...</p>
            ) : (
                <ul>
                    {!error && tasks.length === 0 ? (<p className="text-gray-400 text-center">ยังไม่มี task</p>)
                        : tasks.map(item => (
                            <li key={item.id}>
                                <TaskItem task={item} onToggleStatus={toggleStatus} onDelete={onDelete} />
                            </li>
                        ))}
                </ul>
            )}
            {error && <p className="text-red-500 text-center">{error}</p>}
        </div>
    )
}