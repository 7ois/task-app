type props = {
    value: string,
    onChange: (listType: 'all' | 'todo' | 'doing' | 'done') => void
}

const filterList: { id: number, listType: 'all' | 'todo' | 'doing' | 'done' }[] = [
    { id: 1, listType: 'all' },
    { id: 2, listType: 'todo' },
    { id: 3, listType: 'doing' },
    { id: 4, listType: 'done' },
]

export default function TaskFilter({ value, onChange }: props) {
    return (
        <div className="flex gap-10">
            {filterList.map(item => (
                <button
                    key={item.id}
                    className={`cursor-pointer ${value === item.listType ? "border-b" : ""}`}
                    onClick={() => onChange(item.listType)}
                >
                    {item.listType}
                </button>
            ))}
        </div>
    )
}