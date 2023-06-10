import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(request: any, { params }: any) {
    const itemName = params.name
    const item = await prisma.item.findMany({
        where: { name: itemName },
    })

    if (item.length === 0) {
        const item = await prisma.item.create({ data: { name: itemName } })
        return NextResponse.json(item)
    }

    return NextResponse.json(item)
}
