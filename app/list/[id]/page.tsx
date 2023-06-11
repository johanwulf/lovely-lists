"use client"

import { useEffect, useState } from "react"
import { PopoverContent } from "@radix-ui/react-popover"
import { SlidersHorizontal, Trash2, Plus } from "lucide-react"
import { v4 as uuidv4 } from "uuid"
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


import { endpoints, List } from "@/app/endpoints"
import { useRouter } from "next/navigation"

export default function List({ params }: { params: { id: string } }) {
    const [data, setData] = useState<List | null>(null)
    const [item, setItem] = useState<string>("")
    const [open, setOpen] = useState(false)
    const router = useRouter();


    useEffect(() => {
        endpoints.getList(params.id).then((res) => {
            setData(res)
        })
    }, [])

    if (!data) return <></>

    const onRowClick = (id: number) => {
    }

    const onDeleteClick = (id: number) => {
    }

    const onCreateItem = async (event: any) => {
        event.preventDefault();
        const newItem = await endpoints.createItem(item, params.id).then((res) => {
            return res;
        })
        console.log(newItem)
        setItem("");
        setOpen(false);
        // Use JSON.parse(JSON.stringify(data.items)) to create a deep copy of the items array
        const newItems = JSON.parse(JSON.stringify(data.items));
        // Push the newItem to the newItems array
        newItems.push(newItem);
        // Update the data object with the newItems array
        setData({ ...data, items: newItems })
        console.log(data.items)
    }

    const onDeleteListClick = () => {
    }

    return (
        <div>
            <header className="p-4 flex flex-row justify-between items-center">
                <h1 className="text-xl font-extrabold leading-tight tracking-tighter md:text-4xl">
                    {data.name}
                </h1>
                <div>{}</div>

                <div className="flex flex-row gap-4">
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
                    <Button variant="ghost" className="w-10 rounded-full p-0" onClick={onDeleteListClick}>
                        <Trash2 />
                    </Button>
                </div>
            </header>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Item</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.items.map((item) => (
                        <TableRow
                            key={item.id}
                        >
                            <TableCell className={`font-medium w-max ${item.completed ? "line-through" : ""}`} onClick={() => onRowClick(item.id)}>{item.name}</TableCell>
                            <TableCell className="font-medium text-right w-1">
                                <Button variant="ghost" className="rounded-full p-0 z-50" onClick={() => onDeleteClick(item.id)}>
                                    <Trash2 />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
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
                        <DialogFooter className="mt-4">
                            <Button type="submit" disabled={item.length < 1}>Save changes</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
