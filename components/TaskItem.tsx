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
        <div className="flex items-center justify-between gap-3 mb-2 p-2 shadow-md">
            <p>{task.title}</p>
            <div className="flex gap-2">
                <button
                    className="border border-[#6155F5] bg-[#6155F5] rounded-md p-2 cursor-pointer"
                    onClick={() => onToggleStatus(task.id)}
                >
                    Toggle
                </button>
                <button
                    className="border border-[#f55555] bg-[#f55555] rounded-md p-2 cursor-pointer"
                    onClick={() => onDelete(task.id)}>
                    Delete
                </button>
            </div>
        </div>
    )
}