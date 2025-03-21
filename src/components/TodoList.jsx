import React from 'react';

const TodoList = ({ todos, onCheck, onEdit, onDelete, onDragStart, onDragOver, onDrop }) => {
    return todos.map((todo, index) => (
        <div
            key={todo.id}
            className={`p-2 w-full h-full flex items-center gap-4 ${todo.completed ? 'bg-stone-300' : 'bg-stone-100'}`}
        >
            {todo.completed ? (
                <div
                    onClick={() => onCheck(todo.id)}
                    className="select-none cursor-pointer flex w-4 h-4 justify-center items-center bg-white border border-stone-200 shrink-0 text-rose-600"
                >
                    ✔
                </div>
            ) : (
                <div
                    onClick={() => onCheck(todo.id)}
                    className="cursor-pointer w-4 h-4 bg-white border border-stone-200 shrink-0"
                />
            )}

            <div className="flex-grow">{todo.text}</div>
            <button
                draggable
                onDragStart={() => onDragStart(index)}
                onDragOver={(e) => onDragOver(index, e)}
                onDrop={onDrop}
                className="select-none text-stone-400 cursor-grab"
            >
                =
            </button>
            <div className="flex items-center gap-1">
                <button
                    onClick={() => onEdit(todo.id)}
                    className="select-none cursor-pointer px-1 bg-stone-800 rounded-sm hover:bg-stone-600 text-stone-100"
                >
                    ✎
                </button>
                <button
                    className="select-none w-[24px] h-[24px] bg-rose-400 hover:bg-rose-600 transition-colors text-stone-100 rounded-sm cursor-pointer"
                    onClick={() => onDelete(todo.id)}
                >
                    ✖
                </button>
            </div>
        </div>
    ));
};

export default TodoList;
