"use client";

import { ListOverview, endpoints } from "@/app/endpoints";
import SortableItem from "@/components/sortable-item";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DndContext, DragEndEvent, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Lists() {
	const [loading, setLoading] = useState(true);
	const [list, setList] = useState<ListOverview[]>([]);
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
	);

	async function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;

		if (over && active.id !== over.id) {
			const firstList = list.find((item) => item.id === over.id);
			const secondList = list.find((item) => item.id === active.id);

			if (!firstList || !secondList) return;

			setList((list) => {
				const oldIndex = list.findIndex((item) => item.id === active.id);
				const newIndex = list.findIndex((item) => item.id === over.id);
				return arrayMove(list, oldIndex, newIndex);
			});

			await endpoints.reorderLists(firstList, secondList);
		}
	}
	useEffect(() => {
		endpoints.getAllLists().then((res) => {
			setList(res);
			setLoading(false);
		});
	}, []);

	if (loading) return <></>;
	if (list.length < 1)
		return <h1 className="text-xl font-extrabold leading-tight tracking-tighter md:text-4xl">You do not have any lists at the moment</h1>;

	return (
		<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
			<SortableContext items={list.map((item) => item.id)} strategy={verticalListSortingStrategy}>
				{list.map((list: ListOverview) => {
					return (
						<SortableItem key={list.id} id={list.id} onClick={() => router.push(`/list/${list.id}`)}>
							<Card key={list.id}>
								<CardHeader>
									<CardTitle>{list.name}</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="flex flex-col">
										<Progress value={(list.completedItems / list.totalItems) * 100} />
										<div className="flex flex-row mt-2">
											{list.completedItems} / {list.totalItems}
										</div>
									</div>
								</CardContent>
							</Card>
						</SortableItem>
					);
				})}
			</SortableContext>
		</DndContext>
	);
}
