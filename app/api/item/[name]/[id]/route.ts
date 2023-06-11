import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

import { Params } from "@/types/params"
import { parseParams } from "@/lib/utils"

const prisma = new PrismaClient()

export async function POST(req: NextRequest, { params }: Params) {
    const { name, id } = parseParams(params)

    const item = await prisma.item.upsert({
        where: { name: name as string },
        update: {},
        create: { name: name as string },
    })

    const response = await prisma.listEntry.create({
        data: {
            list: {
                connect: { id: id as number },
            },
            item: {
                connect: { name: item.name as string },
            },
        },
    })

    return NextResponse.json(response)
}
