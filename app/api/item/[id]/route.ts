import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

import { Params } from "@/types/params"
import { parseParams } from "@/lib/utils"
import { ListEntry } from "@/app/endpoints"

const prisma = new PrismaClient()

export async function DELETE(req: NextRequest, { params }: Params) {
    const { id } = parseParams(params)

    const item = await prisma.listEntry.delete({ where: { id: id as number } })

    return NextResponse.json(item)
}
