"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ListOverview, endpoints } from "@/app/endpoints"

export default function Lists() {
    const [lists, setLists] = useState<ListOverview[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        endpoints.getAllLists().then((res) => {
            setLists(res)
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
            {lists.map((list: ListOverview) => {
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
