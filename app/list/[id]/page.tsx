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

import { List, ListItem } from "@/types/list"

export default function List({ params }: { params: { id: string } }) {
    const [data, setData] = useState<List>()
    const [item, setItem] = useState<string>("")
    const [open, setOpen] = useState(false)

    useEffect(() => {
        const getData = async () => {
            const response = await fetch(`/api/list/${params.id}`, { method: "GET" })
            return response.json()
        }
        getData().then((res) => setData(res))
    }, [])

    if (!data) return <></>

    const onRowClick = (id: number) => {
        const item = data.items.find(item => item.id === id);
        if (!item) return;

        fetch(`/api/list-item/${id}/${!item.completed}`, {
            method: "POST"
        })
            .then(() =>
                setData({ ...data, items: data.items.map((item: ListItem) => item.id === id ? { ...item, completed: !item.completed } : item) })
            )
    }

    const onDeleteClick = (id: number) => {
        console.log("delete click")
        setData({ ...data, items: data.items.filter(item => item.id !== id) });
    }

    const onCreateItem = () => {
        const newItem: any = fetch(`/api/list/${params.id}/${item}`, {
            method: "PUT"
        }).then((res) => res.json()).then((d) => setData({ ...data, items: [...data.items, d] }));

        setItem("");
        setOpen(false)
    }

    return (
        <div>
            <header className="p-4 flex flex-row justify-between items-center">
                <h1 className="text-xl font-extrabold leading-tight tracking-tighter md:text-4xl">
                    {data.name}
                </h1>
                <div>{data.items.reduce((acc, item) => acc + +item.completed, 0)} / {data.items.length}</div>

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
                    <Button variant="ghost" className="w-10 rounded-full p-0">
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
                    {data.items.sort((a, b) => +a.completed - +b.completed).map((item) => (
                        <TableRow
                            key={item.name}
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
                            <Button type="submit" disabled={item.length < 1} onClick={onCreateItem}>Save changes</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
