import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: any, { params }: any) {
    const listId = parseInt(params.id, 10)
    const list = await prisma.list.findUnique({
        where: { id: listId },
        include: { ListItem: { include: { item_id: true } } },
    })

    if (!list) {
        return NextResponse.error()
    }

    const data = {
        id: list.id,
        name: list.name,
        items: list.ListItem.map((listItem) => ({
            id: listItem.id,
            name: listItem.item_id.name,
            completed: listItem.completed,
        })),
    }

    return NextResponse.json(data)
}

export async function POST(request: any, { params }: any) {
    const listName = params.id
    const list = await prisma.list.create({ data: { name: listName } })

    return NextResponse.json({ list })
}
