import { ListEntry } from "@/app/endpoints";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

/**
 * Swap order of items
 */
export async function POST(req: NextRequest) {
	const items: ListEntry[] = await req.json();
	const item1 = items[0];
	const item2 = items[1];

	const result1 = await prisma.listEntry.update({
		data: {
			order: item2.order,
		},
		where: {
			id: item1.id,
		},
	});

	const result2 = await prisma.listEntry.update({
		data: {
			order: item1.order,
		},
		where: {
			id: item2.id,
		},
	});

	return NextResponse.json({ result1, result2 });
}

/**
 * Update item
 */
export async function PUT(req: NextRequest) {
	const item: ListEntry = await req.json();

	const newItem = await prisma.item.upsert({
		where: { name: item.name },
		update: {},
		create: { name: item.name },
	});

	console.log(newItem);
	console.log(item);
	const result1 = await prisma.listEntry.update({
		data: {
			listId: item.listId,
			itemName: newItem.name,
			completed: item.completed,
			order: item.order,
			description: item.description,
		},
		where: {
			id: item.id,
		},
	});

	return NextResponse.json({ result1 });
}
