import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { NextRequest, NextResponse } from "next/server";
import { ListEntry, PrismaClient } from "@prisma/client";

import { parseParams } from "@/lib/utils";
import { ListOverview } from "@/app/endpoints";

const prisma = new PrismaClient();

export async function GET() {
	const lists = await prisma.list.findMany({
		select: {
			id: true,
			name: true,
			order: true,
			ListEntry: { select: { completed: true } },
		},
		orderBy: {
			order: "asc",
		},
	});

	const result = lists.map((list) => ({
		id: list.id,
		name: list.name,
		totalItems: list.ListEntry.length,
		completedItems: list.ListEntry.filter((listItem) => listItem.completed).length,
		uncompletedItems: list.ListEntry.filter((listItem) => !listItem.completed).length,
		order: list.order,
	}));

	return NextResponse.json(result);
}

/**
 * Swap order of lists
 */
export async function POST(req: NextRequest) {
	const lists: ListOverview[] = await req.json();
	// Swap the order of the two lists by updating their records
	const list1 = lists[0];
	const list2 = lists[1];

	// Update the order of the first list with the order of the second list
	const result1 = await prisma.list.update({
		data: {
			order: list2.order,
		},
		where: {
			id: list1.id,
		},
	});

	// Update the order of the second list with the order of the first list
	const result2 = await prisma.list.update({
		data: {
			order: list1.order,
		},
		where: {
			id: list2.id,
		},
	});
	return NextResponse.json({ result1, result2 });
}
