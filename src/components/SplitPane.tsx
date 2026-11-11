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
    const containerRef = useRef<HTMLDivElement>(null); // reference to the container div 
    
}