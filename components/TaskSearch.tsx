type props = {
    value: string,
    onChange: (e: string) => void,
    onSubmit: () => void,
    loading: boolean
}

export default function TaskSearch({ value, onChange, onSubmit, loading }: props) {
    return (
        <div className="my-2 flex gap-5">
            <input
                type="text"
                placeholder="เพิ่มงานใหม่..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        onSubmit()
                    }
                }}
                className="border pl-2" />
            <button
                disabled={loading}
                className="border p-2 cursor-pointer"
                onClick={onSubmit}
            >{loading ? "Adding..." : "ADD"}</button>
        </div>
    )
}