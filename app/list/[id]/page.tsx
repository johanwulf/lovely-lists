"use client"

import { useEffect, useState } from "react"
import { PopoverContent } from "@radix-ui/react-popover"
import { SlidersHorizontal, Trash2, Plus, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverTrigger } from "@/components/ui/popover"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"


import { endpoints, List, ListEntry } from "@/app/endpoints"
import { useRouter } from "next/navigation"
import { DndContext, closestCenter, DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import SortableItem from "@/components/sortable-item"

export default function List({ params }: { params: { id: number } }) {
    const [data, setData] = useState<List | null>(null)
    const [item, setItem] = useState<string>("")
    const [description, setDescription] = useState<string>("")
    const [open, setOpen] = useState(false)
    const router = useRouter();
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                delay: 80,
                tolerance: 20,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )


    useEffect(() => {
        endpoints.getList(params.id).then((res) => {
            setData(res)
        })
    }, [])

    if (!data) return <></>


    const onRowClick = async (id: number) => {
        const item = data.items.find((item) => item.id === id)
        if (!item) return;
        const updatedItem = { ...item, completed: !item.completed }
        setData({ ...data, items: data.items.map((item) => item.id === id ? updatedItem : item) })

        await endpoints.completeItem(id, updatedItem)
    }

    const onDeleteItem = async (id: number) => {
        await endpoints.deleteItem(id).then(() => {
            setData({ ...data, items: [...data.items].filter((e) => e.id !== id) })
        })
    }

    const onEditItem = async (id: number) => {
    }

    const onCreateItem = async (event: any) => {
        event.preventDefault();
        await endpoints.createItem(params.id, { name: item, completed: false, listId: params.id, description: description }).then((res) => {
            setData({ ...data, items: [...data.items, res] })
        })
        setItem("");
        setDescription("");
        setOpen(false);
    }

    const onDeleteList = async () => {
        await endpoints.deleteList(params.id).then(() => {
            router.push(`/`)
        })
    }

    async function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event

        if (over && active.id !== over.id && data) {
            const firstItem = data.items.find((item: any) => item.id === over.id)
            const secondItem = data.items.find((item: any) => item.id === active.id)

            if (!firstItem || !secondItem) return

            const oldIndex = data.items.findIndex((item) => item.id === active.id)
            const newIndex = data.items.findIndex((item) => item.id === over.id)
            const newItems = [...arrayMove([...data.items], oldIndex, newIndex)]
            setData({ ...data, items: [...newItems] })

            await endpoints.reorderItems(firstItem, secondItem)
        }

    }

    return (
        <div className="ml-auto mr-auto max-w-3xl grid items-center overflow-hidden">
            <header className="p-4 flex flex-row justify-between items-center">
                <h1 className="text-xl font-extrabold leading-tight tracking-tighter md:text-4xl">
                    {data.name}
                </h1>

                <div className="flex flex-row">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" className="w-10 rounded-full p-0">
                                <SlidersHorizontal />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-50 mt-2 mr-2 p-4 bg-background border radius-5">
                            <div className="grid gap-4">This does nothing currently</div>
                        </PopoverContent>
                    </Popover>
                    <Button variant="ghost" className="w-10 rounded-full p-0" onClick={onDeleteList}>
                        <Trash2 />
                    </Button>
                </div>
            </header>
            <div className="flex flex-col">
                <div className="flex flex-row justify-between border-b pb-2 pl-4 pr-4">
                    <h1 className="mb-4 text-sm text-muted-foreground font-medium">
                        Item
                    </h1>
                    <h1 className="mb-4 text-sm text-muted-foreground font-medium">
                        Actions
                    </h1>
                </div>

                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={data.items.map((item) => item.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {data.items.sort((a, b) => a.completed === b.completed ? 0 : a.completed ? 1 : -1).map((item) => (
                            <SortableItem id={item.id} key={item.id}>
                                <div className="flex flex-row hover:bg-muted/50 justify-between border-b p-4 cursor-pointer items-center" onClick={() => onRowClick(item.id)}>
                                    <div className="flex flex-col">
                                        <p className={`font-bold text-sm ${item.completed ? "line-through" : ""}`}>{item.name}</p>
                                        <p className="text-sm">{item.description}</p>
                                    </div>
                                    <div>
                                        <Button variant="ghost" className="w-10 h-10 rounded-full p-0 z-50" onClick={() => onEditItem(item.id)}>
                                            <Pencil />
                                        </Button>
                                        <Button variant="ghost" className="w-10 h-10 rounded-full p-0 z-50" onClick={() => onDeleteItem(item.id)}>
                                            <Trash2 />
                                        </Button>
                                    </div>
                                </div>
                            </SortableItem>
                        ))}
                    </SortableContext>
                </DndContext>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button
                        variant="ghost"
                        className="border border-2 rounded-full p-4 absolute right-12 bottom-12 w-16 h-16 rounded-full p-0"
                    >
                        <Plus />
                    </Button>
                </DialogTrigger>
                <DialogContent className="rounded top-1/3 w-[80%]">
                    <DialogHeader>
                        <DialogTitle>Add new item</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={onCreateItem}>
                        <Input
                            type="text"
                            placeholder="Item name"
                            onChange={(e) => setItem(e.target.value)}
                        />
                        <Input
                            className="mt-4"
                            type="text"
                            placeholder="Description (optional)"
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <DialogFooter className="mt-4">
                            <Button type="submit" disabled={item.length < 1}>Save changes</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
