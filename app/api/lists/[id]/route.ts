import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

import { Params } from "@/types/params"
import { parseParams } from "@/lib/utils"

const prisma = new PrismaClient()

export async function GET(req: NextRequest, { params }: Params) {
    const { id } = parseParams(params)

    // assume the original object is stored in a variable called data
    const data = await prisma.list.findUnique({
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
    if (!data) return
    // use map to transform the ListEntry array into the items array
    const items = data.ListEntry.map((entry) => {
        // rename the itemName field to name
        return {
            ...entry,
            name: entry.itemName,
        }
    })

    // use spread operator to create a new object with the items field
    const result = {
        ...data,
        items: items,
    }

    // return the result as JSON
    return NextResponse.json(result)
}

export async function POST(req: NextRequest, { params }: Params) {
    const { id } = parseParams(params)

    const result = await prisma.list.create({ data: { name: id as string } })
    return NextResponse.json(result)
}
