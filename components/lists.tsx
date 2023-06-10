"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { List } from "@/types/list"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function Lists() {
    const [lists, setLists] = useState([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const getLists = async () => {
            const response = await fetch("/api/list", { method: "GET" })

            return response.json()
        }
        getLists().then((res) => {
            setLists(res.data)
            setLoading(false)
        })
    }, [])

    if (loading) return <></>
    if (lists.length < 1)
        return (
            <h1 className="text-xl font-extrabold leading-tight tracking-tighter md:text-4xl">
                You do not have any lists at the moment
            </h1>
        )

    return (
        <>
            {lists.map((list: List) => {
                return (
                    <Card key={list.id} onClick={() => router.push(`list/${list.id}`)}>
                        <CardHeader>
                            <CardTitle>{list.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col">
                                <Progress
                                    value={(list.completedItems / list.totalItems) * 100}
                                />
                                <div className="flex flex-row mt-2">
                                    {list.completedItems} / {list.totalItems}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </>
    )
}
