import { List } from "@/app/endpoints";
import { parseParams } from "@/lib/utils";
import { Params } from "@/types/params";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

/**
 * Get list by ID
 */
export async function GET(req: NextRequest, { params }: Params) {
	const { id } = parseParams(params);

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
					order: true,
				},
				orderBy: {
					order: "asc",
				},
			},
		},
	});

	if (!list) return;

	const result: List = {
		id: list.id,
		name: list.name,
		items: list.ListEntry.map((item) => ({
			id: item.id,
			completed: item.completed,
			name: item.itemName,
			description: item.description,
			order: item.order,
		})),
	};

	return NextResponse.json(result);
}

/**
 * Create list by name
 */

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
	const listName = params.id;
	const currentMax = await prisma.list.aggregate({
		_max: {
			order: true,
		},
	});

	const order = currentMax._max.order ? currentMax._max.order + 1 : 1;

	const result = await prisma.list.create({
		data: { name: listName, order: order },
	});
	return NextResponse.json(result);
}

/**
 * Delete list by ID
 */
export async function DELETE(req: NextRequest, { params }: Params) {
	const { id } = parseParams(params);

	await prisma.listEntry.deleteMany({ where: { listId: id as number } });
	const result = await prisma.list.delete({ where: { id: id as number } });

	return NextResponse.json(result);
}
