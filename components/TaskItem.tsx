type Task = {
    id: number
    title: string;
    status: string;
}

type TaskItemProps = {
    task: Task;
    onToggleStatus: (id: number) => void;
}

export default function TaskItem({ task, onToggleStatus }: TaskItemProps) {
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
            </div>
        </>
    )
}