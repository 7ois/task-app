import pool from "@/lib/db";
import { NextResponse } from "next/server";
// import { tasks } from "../../../lib/tasks";

// let taskData = [...tasks]

export async function GET() {
  // return NextResponse.json(tasks)
  try {
    const result = await pool.query("SELECT * FROM tasks ORDER BY id DESC");
    return NextResponse.json(result.rows);
  } catch (err) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  // const body = await req.json()

  // const newTask = {
  //     id: Date.now(),
  //     title: body.title,
  //     status: 'todo'
  // }

  // taskData.push(newTask)
  // return NextResponse.json(newTask, {status: 201})
  try {
    const { title } = await req.json();
    const result = await pool.query(
      "INSERT INTO tasks (title) VALUES ($1) RETURNING *",
      [title],
    );

    return NextResponse.json(result.rows[0]);
  } catch (err) {
    return NextResponse.json({ error: "Insert failed" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  // const {id} = await req.json()
  // taskData = taskData.filter(task => task.id !== id)
  // return NextResponse.json({success: true})
  try {
    const { id } = await req.json();

    await pool.query("DELETE FROM tasks WHERE id = $1", [id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  // const {id} = await req.json()

  // taskData = taskData.map(task => {
  //     if(task.id === id) {
  //         let nextStatus = task.status

  //         if(task.status === "todo") nextStatus = "doing"
  //         else if(task.status === "doing") nextStatus = "done"
  //         else nextStatus = "todo"

  //         return {...task, status: nextStatus}
  //     }
  //     return task
  // })

  // const updateTask = taskData.find(task => task.id === id)
  // return NextResponse.json(updateTask)
  try {
    const { id, status } = await req.json();

    const result = await pool.query(
      "UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *",
      [status, id],
    );
    return NextResponse.json(result.rows[0]);
  } catch (err) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
