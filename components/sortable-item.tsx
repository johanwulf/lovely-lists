import React from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

const SortableItem = (props: any) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id })

  const { children, onClick } = props

  const itemStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: "none",
  }

  return (
    <div
      ref={setNodeRef}
      onClick={onClick}
      style={itemStyle}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  )
}

export default SortableItem
