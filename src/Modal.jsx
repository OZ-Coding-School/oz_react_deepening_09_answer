import { useEffect, useRef, useState } from 'react';

const Modal = ({ onClose, onEdit, currentEdit }) => {
    const [text, setText] = useState(currentEdit.text);
    const modalRef = useRef(null);

    useEffect(() => {
        if (modalRef.current) {
            modalRef.current.focus();
            modalRef.current.setSelectionRange(text.length, text.length);
            modalRef.current.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    onClose();
                }
            });
        }
    });

    function handleEditSubmit(e) {
        e.preventDefault();
        onEdit(text);
        onClose();
    }
    return (
        <div
            onClick={onClose}
            className="fixed top-0 left-0 w-full h-full bg-black/50 backdrop-blur-sm flex justify-center items-center"
        >
            <form
                onSubmit={(e) => handleEditSubmit(e)}
                onClick={(e) => e.stopPropagation()}
                className="animate-popup absolute bg-white p-8 rounded-sm flex flex-col gap-2"
            >
                <h1 className="text-lg font-bold">일정 수정</h1>
                <textarea
                    defaultValue={text}
                    onChange={(e) => setText(e.target.value)}
                    tabIndex={1}
                    maxLength={100}
                    ref={modalRef}
                    className=" resize-none w-[400px] h-[180px] border border-gray-300 p-[4px_8px] rounded-sm placeholder:text-sm text-sm"
                    type="text"
                    placeholder="Edit Todo"
                />
                <div className="flex">
                    <button className="w-full cursor-pointer bg-stone-800 hover:bg-stone-200 p-[4px_8px] text-stone-100 hover:text-stone-800 transition-all rounded-[2px]">
                        저장
                    </button>
                </div>
                <button title="닫기" onClick={onClose} className="absolute top-1 right-2.5 cursor-pointer">
                    X
                </button>
            </form>
        </div>
    );
};

export default Modal;
