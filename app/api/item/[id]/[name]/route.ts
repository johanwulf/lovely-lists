import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

import { Params } from "@/types/params"
import { parseParams } from "@/lib/utils"
import { ListEntry } from "@/app/endpoints"

const prisma = new PrismaClient()

export async function POST(req: NextRequest, { params }: Params) {
  const { id, name } = parseParams(params)

  const item = await prisma.item.upsert({
    where: { name: name as string },
    update: {},
    create: { name: name as string },
  })

  const listEntry = await prisma.listEntry.create({
    data: {
      list: {
        connect: { id: id as number },
      },
      item: {
        connect: { name: item.name as string },
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

export async function PUT(req: NextRequest, { params }: Params) {
  const { id, name } = parseParams(params)

  const item = await prisma.listEntry.update({
    where: { id: id as number },
    data: { completed: name as boolean },
  })

  return NextResponse.json(item)
}
