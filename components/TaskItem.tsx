type Task = {
    id: number
    title: string;
    status: string;
}

type TaskItemProps = {
    task: Task;
    onToggleStatus: (id: number) => void;
    onDelete: (id: number) => void;
}

export default function TaskItem({ task, onToggleStatus, onDelete }: TaskItemProps) {
    return (
        <>
            <div className="flex items-center justify-center gap-3 mb-2">
                <p>{task.title}  :  {task.status}</p>
                <button
                    className="border p-2"
                    onClick={() => onToggleStatus(task.id)}
                >
                    Toggle
                </button>
                <button
                    className="border p-2"
                    onClick={() => onDelete(task.id)}>Delete</button>
            </div>
        </>
    )
}