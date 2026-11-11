import { useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react'; 
export type PaneResizeDirection = 'horizontal' | 'vertical'; // defines valid directions of pane resizing, and exporting so App can use for it's own state

// defining the shape of the SplitPaneProps object, accepted by the SplitPane component
interface SplitPaneProps {
    first: ReactNode; // (required) first pane content 
    second: ReactNode; // (required) second pane content
    direction?: PaneResizeDirection; // (optional) direction of pane resizing, default is horizontal
    initialSize?: number; // (optional) initial size of the first pane in percent, default is 50%
    minSize?: number; // (optional) min size of the first pane in percent, default is 10%
}

const KEY_STEP = 2; // percentage resized per arrow key press

export default function SplitPane({first, second, direction = 'horizontal', initialSize = 50, minSize = 10}: SplitPaneProps) {
    const containerRef = useRef<HTMLDivElement>(null);  // reference to the container div 
    const [size, setSize] = useState(initialSize);      // state that holds the size of the first pane
    const [dragging, setDragging] = useState(false);    // state indicating whether or not user is currently dragging divider

    const isHorizontal = direction === 'horizontal';    // boolean indicating if the direction is horizontal
    const clamp = (n: number) => Math.min(100 - minSize, Math.max(minSize, n)); // function to restrict size of first pane between minSize and 100 - minSize

    // event handler to capture mouseDown (start click) events on the divider
    const onPointerDown = (e: PointerEvent<HTMLDivElement>) => { 
        e.currentTarget.setPointerCapture(e.pointerId); // sets mouse target to divider, capturing events even when mouse is outside of divider
        setDragging(true);      // switches UI into dragging mode
    };

    // event handler to capture mouseMove events on the divider
    const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
        if (!dragging || !containerRef.current) return;     // returns early if not dragging or if containerRef is null
        const rect = containerRef.current.getBoundingClientRect();  // returns container's position and size in pixels relative to viewport
        const pct = isHorizontal    // calculates the pctg of the screen that the divider is currently along
                ? ((e.clientX - rect.left) / rect.width) * 100 
                : ((e.clientY - rect.top) / rect.height) * 100; 
        setSize(clamp(pct));    // sets size of the container dynamically using the clamp function defined outside of function
    };

    // event handler to capture mouseUp (release click) events on the divider
    const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
        // if statement that releases the current 'captured' element (the divider) if it is being held
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId); 
        }
        setDragging(false); // resets dragging state to false
    };

    // event handler to capture keyboard events on the divider
    const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        const decrease = isHorizontal ? "ArrowLeft" : "ArrowUp";    // defines decrease direction depending on pane resize direction
        const increase = isHorizontal ? "ArrowRight" : "ArrowDown"; // defines increase direction depending on pane resize direction

        // if statement that defines how the size state should be changed depending on what key was pressed
        if (e.key === decrease) setSize((s) => clamp(s - KEY_STEP)); 
        else if (e.key === increase) setSize((s) => clamp(s + KEY_STEP)); 
        else if (e.key === "Home") setSize(minSize); 
        else if (e.key === "End") setSize(100 - minSize); 
        else return;    // handles any other keypress that isn't listed above
        e.preventDefault(); // prevents the default action of the handled keypresses from happening
    };

    return (
        /* ref={containerRef} connects the ref to this DOM node. anything styled inline is done so because their value changes constantly */ 
        <div ref={containerRef} className={`split ${direction}${dragging ? "is-dragging" : ""}`}> 
            {/* div representing first (left/top) pane. the flex styling centers the pane on the cursor */}
            <div className="pane" style={{ flex : `0 0 calc(${size}% - 3px)` }}>
                {first}
            </div>

            {/* represents the divider between panes
                - role="separator" and tabIndex={0} makes the divider focusable by keyboard 
                - aria-orientation defines the bar's orientation (opposite of layout's)
                - aria-valuenow/min/max defines position as a percentage
                - onDoubleClick{} resets size of panes to half-half
                - title is the hover tooltip
            */}
            <div 
                className="divider"     
                role="separator"        
                aria-orientation={isHorizontal ? "vertical" : "horizontal"} 
                aria-valuenow={Math.round(size)}    
                aria-valuemin={minSize}             
                aria-valuemax={100 - minSize}       
                tabIndex={0}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                onKeyDown={onKeyDown}
                onDoubleClick={() => setSize(50)}
                title="drag to resize, double-click to reset (half-half)"
            />

            {/* div representing second (right/bottom) pane. the flex styling dynamically takes up remaining space leftover by first pane */}
            <div className="pane" style={{ flex: "1 1 0"}}>
                {second}
            </div>
        </div>
    );
}