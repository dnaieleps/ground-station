import { useState } from 'react'
import SplitPane, {type PaneResizeDirection} from "./components/SplitPane"; 

export default function App() {
    const [direction, setDirection] = useState<PaneResizeDirection>("horizontal"); 
    const toggle = () => setDirection((d) => d === "horizontal" ? "vertical" : "horizontal");

    return (
        <SplitPane 
            direction={direction}
            first={
                <section className="window"> 
                    <header>
                        <h1>Window A</h1>
                        <button type="button" onClick={toggle}>
                            {direction === "horizontal" ? "stack vertically" : "place side-by-side"}
                        </button>
                    </header>
                </section>
            }
            second={
                <section className="window"> 
                    <header>
                        <h1>Window B</h1>
                    </header>
                </section>
            }
        />
    )
}
