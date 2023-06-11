import { Params } from "next/dist/shared/lib/router/utils/route-matcher"
import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

import { parseParams } from "@/lib/utils"

const prisma = new PrismaClient()

export async function GET() {
    const lists = await prisma.list.findMany({
        select: {
            id: true,
            name: true,
            ListEntry: { select: { completed: true } },
        },
    })

    const result = lists.map((list) => ({
        id: list.id,
        name: list.name,
        totalItems: list.ListEntry.length,
        completedItems: list.ListEntry.filter((listItem) => listItem.completed)
            .length,
        uncompletedItems: list.ListEntry.filter((listItem) => !listItem.completed)
            .length,
    }))

    return NextResponse.json(result)
}
