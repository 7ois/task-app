import { NextResponse } from "next/server";
import { tasks } from "../../../lib/tasks";

export async function GET() {
    return NextResponse.json(tasks)
}