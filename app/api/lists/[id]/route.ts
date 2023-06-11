import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

import { Params } from "@/types/params"
import { parseParams } from "@/lib/utils"

const prisma = new PrismaClient()

export async function GET(req: NextRequest, { params }: Params) {
    const { id } = parseParams(params)

    const list = await prisma.list.findUnique({
        where: { id: id as number },
        select: {
            id: true,
            name: true,
            ListEntry: {
                select: {
                    id: true,
                    completed: true,
                    itemName: true,
                },
            },
        },
    })

    if (!list) return

    const result = {
        id: list.id,
        name: list.name,
        items: list.ListEntry.map((item) => ({
            id: item.id,
            completed: item.completed,
            name: item.itemName,
        })),
    }

    return NextResponse.json(result)
}

export async function POST(req: NextRequest, { params }: Params) {
    const { id } = parseParams(params)

    const result = await prisma.list.create({ data: { name: id as string } })
    return NextResponse.json(result)
}
