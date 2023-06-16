import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

import { ListEntry } from "@/app/endpoints"

const prisma = new PrismaClient()

/**
 * Create new listitem entry and attach it to list
 */
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
      description: item.description,
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
    description: item.description,
  }

  return NextResponse.json(response)
}

/**
 * Delete item from list
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const itemId = Number(params.id)

  const item = await prisma.listEntry.delete({ where: { id: itemId } })

  return NextResponse.json(item)
}

/**
 * Update status of item
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const itemId = Number(params.id)
  const item: ListEntry = await req.json()

  const res = await prisma.listEntry.update({
    where: { id: itemId },
    data: { completed: item.completed },
  })

  return NextResponse.json(item)
}
