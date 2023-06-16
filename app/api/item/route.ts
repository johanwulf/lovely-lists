import { ListOverview } from "@/app/endpoints";
import { parseParams } from "@/lib/utils";
import { ListEntry, PrismaClient } from "@prisma/client";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

/**
 * Swap order of lists
 */
export async function POST(req: NextRequest) {
    const items: ListEntry[] = await req.json();
    // Swap the order of the two lists by updating their records
    const item1 = items[0];
    const item2 = items[1];
    console.log(items);

    // Update the order of the first list with the order of the second list
    const result1 = await prisma.listEntry.update({
        data: {
            order: item2.order,
        },
        where: {
            id: item1.id,
        },
    });

    // Update the order of the second list with the order of the first list
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
