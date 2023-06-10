import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function PUT(request: any, { params }: any) {
    const listId = parseInt(params.id, 10)
    const itemName = params.item

    const item = await prisma.item.findMany({
        where: { name: itemName },
    })

    if (item.length === 0) {
        const item = await prisma.item.create({ data: { name: itemName } })
        const newItem = await prisma.listItem.create({
            data: {
                listId: listId,
                itemId: item.id,
                completed: false,
            },
        })
        return NextResponse.json({
            id: item.id,
            name: item.name,
            completed: false,
        })
    }

    const newItem = await prisma.listItem.create({
        data: {
            listId: listId,
            itemId: item[0].id,
            completed: false,
        },
    })

    return NextResponse.json({
        id: item[0].id,
        name: item[0].name,
        completed: false,
    })
}
