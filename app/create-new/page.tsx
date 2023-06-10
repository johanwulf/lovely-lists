"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function CreateNew() {
    const [listName, setListName] = useState("")
    const router = useRouter()

    const onCreateClick = () => {
        fetch(`/api/list/${listName}/`, {
            method: "POST",
        })
            .then((res) => res.json())
            .then((data) => router.push(`list/${data.list.id}`))
    }

    return (
        <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
            <div className="flex max-w-[980px] flex-col items-start gap-2">
                <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
                    Create new list
                </h1>
                <Input
                    type="text"
                    placeholder="List name"
                    onChange={(e) => setListName(e.target.value)}
                />
                <Button
                    className="w-full"
                    disabled={listName.length === 0}
                    onClick={onCreateClick}
                >
                    Create
                </Button>
            </div>
        </section>
    )
}
