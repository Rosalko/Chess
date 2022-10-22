import {useState} from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import Board from "./Board";
import {ChessContext, ChessProvider} from "./ChessContext";
import {DndProvider} from 'react-dnd'
import {HTML5Backend} from 'react-dnd-html5-backend'

function App() {
    const [count, setCount] = useState(0)

    return (
        <div className="App">
            <DndProvider backend={HTML5Backend}>
                <ChessProvider>
                    <Board/>
                </ChessProvider>
            </DndProvider>
        </div>
    )
}

export default App
