import { NextResponse } from "next/server";
import { tasks } from "../../../lib/tasks";

let taskData = [...tasks]

export async function GET() {
    return NextResponse.json(tasks)
}

export async function POST(req: Request) {
    const body = await req.json()

    const newTask = {
        id: Date.now(),
        title: body.title,
        status: 'todo'
    }

    taskData.push(newTask)
    return NextResponse.json(newTask, {status: 201})
}

export async function DELETE(req: Request) {
    const {id} = await req.json()
    taskData = taskData.filter(task => task.id !== id)
    return NextResponse.json({success: true})
}

export async function PATCH(req: Request) {
    const {id} = await req.json()

    taskData = taskData.map(task => {
        if(task.id === id) {
            let nextStatus = task.status

            if(task.status === "todo") nextStatus = "doing"
            else if(task.status === "doing") nextStatus = "done"
            else nextStatus = "todo"
            
            return {...task, status: nextStatus}
        }
        return task
    })

    const updateTask = taskData.find(task => task.id === id)
    return NextResponse.json(updateTask)
}