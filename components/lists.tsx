"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ListOverview, endpoints } from "@/app/endpoints"

export default function Lists() {
  const [loading, setLoading] = useState(true)
  const [list, setList] = useState<ListOverview[]>([]) // added here
  const router = useRouter()

  useEffect(() => {
    endpoints.getAllLists().then((res) => {
      setList(res) // changed here
      setLoading(false)
    })
  }, [])

  if (loading) return <></>
  if (list.length < 1)
    return (
      <h1 className="text-xl font-extrabold leading-tight tracking-tighter md:text-4xl">
        You do not have any lists at the moment
      </h1>
    )

  // Get the index of an item by its id
  const getIndex = (id: number) => list.findIndex((item) => item.id === id)

  const moveItem = (from: number, to: number) => {
    setList((prevList) => {
      const newList = [...prevList]
      const [removed] = newList.splice(from, 1)
      newList.splice(to, 0, removed)
      return newList
    })
  }

  const handleDragStart = (e: React.DragEvent, id: number) => {
    e.dataTransfer.setData("id", id.toString())
  }

  const handleDragOver = (e: React.DragEvent, id: number) => {
    e.preventDefault()
    const draggedId = e.dataTransfer.getData("id")
    if (draggedId !== id.toString()) {
      const draggedIndex = getIndex(Number(draggedId))
      const droppedIndex = getIndex(id)
      moveItem(draggedIndex, droppedIndex)
    }
  }

  const handleDrop = (e: React.DragEvent, id: number) => {
    e.preventDefault()
    const draggedId = e.dataTransfer.getData("id")
    if (draggedId) {
      const draggedIndex = getIndex(Number(draggedId))
      const droppedIndex = getIndex(id)
      if (draggedIndex !== droppedIndex) {
        moveItem(draggedIndex, droppedIndex)
      }
    }
  }

  return (
    <>
      {list.map((list: ListOverview) => {
        return (
          <Card
            key={list.id}
            onDragStart={(e) => handleDragStart(e, list.id)}
            onDragOver={(e) => handleDragOver(e, list.id)}
            onDrop={(e) => handleDrop(e, list.id)}
            onClick={() => router.push(`list/${list.id}`)}
            draggable
          >
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
