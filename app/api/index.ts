import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
    const allLists = await prisma.list.findMany()
    console.log(allLists)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
