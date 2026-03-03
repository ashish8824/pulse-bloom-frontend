// src/features/habits/HabitList.tsx
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import { useReorderHabitsMutation } from "@/services/habitApi";
import HabitCard from "./HabitCard";
import type { Habit } from "@/types/habit.types";

interface HabitListProps {
  habits: Habit[];
  completedTodayIds: Set<string>;
  onEdit: (habit: Habit) => void;
  onCompleted: (id: string) => void;
  onUndone: (id: string) => void;
}

export default function HabitList({
  habits,
  completedTodayIds,
  onEdit,
  onCompleted,
  onUndone,
}: HabitListProps) {
  const [reorderHabits] = useReorderHabitsMutation();

  async function onDragEnd(result: DropResult) {
    if (!result.destination || result.destination.index === result.source.index)
      return;

    const reordered = Array.from(habits);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);

    const updates = reordered.map((h, i) => ({ id: h.id, sortOrder: i }));
    await reorderHabits({ habits: updates });
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="habits">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-3"
          >
            {habits.map((habit, index) => (
              <Draggable key={habit.id} draggableId={habit.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={
                      snapshot.isDragging
                        ? "opacity-80 scale-[1.02] shadow-2xl"
                        : ""
                    }
                  >
                    <HabitCard
                      habit={habit}
                      isCompletedToday={completedTodayIds.has(habit.id)}
                      onEdit={onEdit}
                      onCompleted={onCompleted}
                      onUndone={onUndone}
                      dragHandleProps={provided.dragHandleProps ?? {}}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
