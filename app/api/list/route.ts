import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
    const lists = await prisma.list.findMany({
        include: { ListItem: { include: { item_id: true } } },
    })

    const result = lists.map((list) => ({
        id: list.id,
        name: list.name,
        totalItems: list.ListItem.length,
        completedItems: list.ListItem.filter((listItem) => listItem.completed)
            .length,
        listOfItems: list.ListItem.map((listItem) => ({
            id: listItem.itemId,
            name: listItem.item_id.name,
            completed: listItem.completed,
        })),
    }))

    return NextResponse.json({ data: result })
}
