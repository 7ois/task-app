import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM tasks ORDER BY id DESC");
    return NextResponse.json(result.rows);
  } catch (err) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
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
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Task id is required" },
        { status: 400 },
      );
    }

    const result = await pool.query("DELETE FROM tasks WHERE id = $1", [
      Number(id),
    ]);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
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
