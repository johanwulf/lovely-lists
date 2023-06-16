import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

import { Params } from "@/types/params"
import { parseParams } from "@/lib/utils"
import { List } from "@/app/endpoints"

const prisma = new PrismaClient()

/**
 * Get list by ID
 */
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
          description: true,
        },
      },
    },
  })

  if (!list) return

  const result: List = {
    id: list.id,
    name: list.name,
    items: list.ListEntry.map((item) => ({
      id: item.id,
      completed: item.completed,
      name: item.itemName,
      description: item.description,
    })),
  }

  return NextResponse.json(result)
}

/**
 * Create list by name
 */
export async function POST(req: NextRequest, { params }: Params) {
  const { id } = parseParams(params)

  const result = await prisma.list.create({ data: { name: id as string } })
  return NextResponse.json(result)
}

/**
 * Delete list by ID
 */
export async function DELETE(req: NextRequest, { params }: Params) {
  const { id } = parseParams(params)

  await prisma.listEntry.deleteMany({ where: { listId: id as number } })
  const result = await prisma.list.delete({ where: { id: id as number } })

  return NextResponse.json(result)
}
