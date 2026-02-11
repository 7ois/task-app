type props = {
    value: string,
    onChange: (e: string) => void,
    onSubmit: () => void,
    loading: boolean
}

export default function TaskSearch({ value, onChange, onSubmit, loading }: props) {
    return (
        <div className="flex items-center gap-5 p-5">
            <h1 className="text-[#6155F5]">New task : </h1>
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
                className="col-span-2 pl-2 w-1/4 outline-none" />
            <button
                disabled={loading}
                className="border border-[#6155F5] bg-[#6155F5] rounded-md cursor-pointer w-28 h-10"
                onClick={onSubmit}
            >{loading ? "Adding..." : "ADD"}</button>
        </div>
    )
}