import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import './App.css';
import Modal from './Modal';
import { debounce } from './util/debounce';
import TodoList from './components/TodoList';

//Reducer 정의
function todoReducer(state, action) {
    switch (action.type) {
        case 'add':
            return [...state, action.payload];
        case 'delete':
            return state.filter((todo) => todo.id !== action.payload);
        case 'check':
            return state.map((todo) => {
                if (todo.id === action.payload) {
                    return { ...todo, completed: !todo.completed };
                }
                return todo;
            });
        case 'edit':
            return state.map((todo) => {
                if (todo.id === action.payload.id) {
                    return { ...todo, text: action.payload.text };
                }
                return todo;
            });
        case 'load':
            return [...action.payload];
        default:
            return state;
    }
}

export default function App() {
    //State 정의
    const [text, setText] = useState('');
    const [currentEdit, setCurrentEdit] = useState({
        id: 0,
        text: '',
    });
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [filteredTodos, setFilteredTodos] = useState([]);
    const [filterType, setFilterType] = useState('all');

    //Reducer 사용
    const [todos, dispatch] = useReducer(todoReducer, []);
    //미입력 후 제출 시 입력창 포커스
    const inputRef = useRef(null);
    //요소 드래그 컨트롤 정의
    const [draggingIndex, setDraggingIndex] = useState(null);

    // 필터 타입의 따른 필터 함수
    // useCallback을 사용하여 함수 재사용
    // 이의 대한 개념은 추후에 배울 예정입니다. 지금은 참고만 해주세요! 꼭 사용하지 않아도 됩니다 :)
    const filterTodos = useCallback(() => {
        if (filterType === 'checked') {
            setFilteredTodos(todos.filter((todo) => todo.completed));
        } else if (filterType === 'unchecked') {
            setFilteredTodos(todos.filter((todo) => !todo.completed));
        } else {
            setFilteredTodos(todos);
        }
    }, [filterType, todos]);

    //검색 함수
    const searchTodos = (text) => {
        setFilterType('search');
        setFilteredTodos(todos.filter((todo) => todo.text.includes(text)));
    };

    //체크 필터 함수
    const filterCheckTodos = () => {
        setFilterType('checked');

        setFilteredTodos(todos.filter((todo) => todo.completed));
    };

    //언체크 필터 함수
    const filterUncheckTodos = () => {
        setFilterType('unchecked');
        setFilteredTodos(todos.filter((todo) => !todo.completed));
    };

    //필터 초기화 함수
    const resetFilter = () => {
        setFilterType('all');
        setFilteredTodos(todos);
    };

    // 드래그 시작
    const handleDragStart = (index) => {
        setDraggingIndex(index);
    };

    //드래그 중
    const handleDragOver = (index, e) => {
        e.preventDefault();
        if (index !== draggingIndex) {
            const newTodos = [...todos];
            const draggingItem = newTodos[draggingIndex];
            newTodos.splice(draggingIndex, 1);
            newTodos.splice(index, 0, draggingItem);
            dispatch({ type: 'load', payload: newTodos });
            filterTodos();
            setDraggingIndex(index);
        }
    };

    //드래그 종료
    const handleDrop = () => {
        setDraggingIndex(null);
    };

    //Action 정의
    function addTodoAction(todo) {
        dispatch({ type: 'add', payload: todo });
    }
    function deleteTodoAction(id) {
        dispatch({ type: 'delete', payload: id });
    }
    function checkTodoAction(id) {
        dispatch({ type: 'check', payload: id });
    }
    function editTodoAction(text) {
        dispatch({ type: 'edit', payload: { id: currentEdit.id, text: text } });
    }

    //모달창 관련 함수
    function handleEditModalOn(id) {
        const todoTextData = todos.find((todo) => todo.id === id).text;
        setCurrentEdit({ id, text: todoTextData });
        setEditModalOpen(true);
    }
    function handleEditModalClose() {
        setEditModalOpen(false);
    }

    //Submit 이벤트 함수
    const handleSubmit = (e) => {
        e.preventDefault();

        if (text.trim() === '') {
            return inputRef.current?.focus();
        }
        addTodoAction({ id: Date.now(), text, completed: false });

        setText('');
    };

    //로컬스토리지 최초 데이터 로드
    useEffect(() => {
        const savedData = JSON.parse(localStorage.getItem('todos'));
        if (savedData) {
            dispatch({ type: 'load', payload: savedData });
        }
    }, []);

    //로컬스토리지 데이터 저장, todos가 변경될 때마다 실행
    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
        setFilteredTodos(todos);
    }, [todos]);

    //todos가 변경될 때마다 필터링 함수 실행
    useEffect(() => {
        filterTodos();
    }, [todos, filterTodos]);

    return (
        <div className="font-pretendard">
            {/* 각 컴포넌트에 className이 많이 선언되어있는게 보이실 겁니다. */}
            {/* 이는 tailwindCSS라고 하는 클래스작성형 css라이브러리입니다. 지금은 신경 쓰지 않으셔도 무관합니다. */}
            <header className="fixed top-0 bg-gray-800 text-white text-center p-4 w-full">
                <h1 className="text-2xl font-semibold">Todo List Advanced Project</h1>
            </header>
            <div className="h-screen overflow-y-hidden pt-16 flex justify-center items-center">
                <main className="relative flex flex-col gap-4 w-[800px] h-[600px] bg-white rounded-sm p-4 justify-between">
                    <div className="flex flex-col items-center gap-1 pr-2 overflow-y-auto">
                        <div className="mb-[32px] w-full">
                            <header className="left-0 top-0 rounded-t-sm absolute w-full flex items-center gap-4 p-1 bg-indigo-200 text-stone-200"></header>
                            <input
                                onKeyUp={debounce((e) => searchTodos(e.target.value), 300)}
                                placeholder="🔎 Search..."
                                className="w-full p-[6px_12px] text-lg bg-stone-100 rounded-sm outline-none"
                            ></input>
                            <div className="flex items-center mt-2 gap-2">
                                <button
                                    onClick={filterCheckTodos}
                                    className="w-[90px] p-[2px_4px] text-sm bg-indigo-500 rounded-lg text-stone-100 hover:bg-indigo-700 cursor-pointer transition"
                                >
                                    Checked
                                </button>
                                <button
                                    onClick={filterUncheckTodos}
                                    className="w-[90px] p-[2px_4px] text-sm bg-stone-500 rounded-lg text-stone-100 hover:bg-stone-700 cursor-pointer transition"
                                >
                                    UnChecked
                                </button>
                                <button
                                    onClick={resetFilter}
                                    className="w-[90px] p-[2px_4px] text-sm bg-rose-500 rounded-lg text-stone-100 hover:bg-rose-700 cursor-pointer transition"
                                >
                                    All
                                </button>
                            </div>
                        </div>
                        {filteredTodos.length === 0 && <div className="text-stone-400">검색 결과가 없습니다.</div>}
                        {/* 컴포넌트 한개에 수많은 Props가 넘어가니 App에 함수가 너무 많습니다. 이러한 문제를 해결할 방법이 있을까요? */}
                        {/* 또한 많은 Props가 존재하여 컴포넌트 분리가 사실상 무의미 해졌습니다. */}
                        {/* 이러한 해결 방법은 추후 배우게 됩니다. 지금은 이런 불편함을 해결하는 방법이 있다는 것을 인지해두세요. */}
                        <TodoList
                            todos={filteredTodos}
                            onCheck={checkTodoAction}
                            onDelete={deleteTodoAction}
                            onEdit={handleEditModalOn}
                            onDragStart={handleDragStart}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                        />
                    </div>
                    <form onSubmit={handleSubmit} className="gap-2 flex items-center">
                        <input
                            ref={inputRef}
                            tabIndex={1}
                            className="flex-grow border border-stone-200 p-[4px_24px] rounded-sm"
                            type="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                        <button className="bg-indigo-400 hover:bg-indigo-600 transition-colors p-[4px_24px] rounded-sm text-stone-100 cursor-pointer">
                            Add
                        </button>
                    </form>
                </main>
            </div>
            <footer className="fixed bottom-0 w-full bg-gray-800 text-white text-center p-4">
                <p>&copy; 2025 OZ Coding School</p>
            </footer>
            {/* 모달을 제어하는 조건문입니다. useState를 활용해서 구현합니다. */}
            {editModalOpen && (
                <Modal onClose={handleEditModalClose} onEdit={editTodoAction} currentEdit={currentEdit} />
            )}
        </div>
    );
}
