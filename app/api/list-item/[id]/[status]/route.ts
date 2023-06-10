import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(
    request: any,
    { params }: { params: { id: string; status: string } }
) {
    const itemId = parseInt(params.id, 10)
    const completed = params.status === "true"

    const updatedListItems = await prisma.listItem.updateMany({
        where: { itemId: itemId },
        data: { completed: completed },
    })

    return NextResponse.json(updatedListItems)
}
