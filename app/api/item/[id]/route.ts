import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

import { Params } from "@/types/params"
import { parseParams } from "@/lib/utils"
import { ListEntry } from "@/app/endpoints"

const prisma = new PrismaClient()

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const listId = Number(params.id)
  const item: ListEntry = await req.json()

  await prisma.item.upsert({
    where: { name: item.name },
    update: {},
    create: { name: item.name },
  })

  const listEntry = await prisma.listEntry.create({
    data: {
      list: {
        connect: { id: listId },
      },
      item: {
        connect: { name: item.name },
      },
    },
  })

  const response: ListEntry = {
    id: listEntry.id,
    name: listEntry.itemName,
    listId: listEntry.listId,
    completed: listEntry.completed,
  }

  return NextResponse.json(response)
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const itemId = Number(params.id)

  const item = await prisma.listEntry.delete({ where: { id: itemId } })

  return NextResponse.json(item)
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { id, name } = parseParams(params)

  const item = await prisma.listEntry.update({
    where: { id: id as number },
    data: { completed: name as boolean },
  })

  return NextResponse.json(item)
}
