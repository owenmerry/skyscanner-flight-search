import React from "react";
import type { DraggableProvided, DropResult, DroppableProvided } from "react-beautiful-dnd";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

interface DradAndDropListProps {
  children: React.ReactNode;
  onItemsReorder?: (orderedItems: DropResult) => void;
}

export const DradAndDropList: React.FC<DradAndDropListProps> = ({ children, onItemsReorder }) => {
  const childArray = React.Children.toArray(children);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    if (onItemsReorder) {
      onItemsReorder(result);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable-list">
        {(provided: DroppableProvided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {childArray.map((child, index) => (
              <Draggable
                key={index}
                draggableId={index.toString()}
                index={index}
              >
                {(provided: DraggableProvided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      ...provided.draggableProps.style,
                    }}
                  >
                    {child}
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
};
