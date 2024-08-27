import type { ReactNode } from 'react';
import React, { useState, useEffect } from 'react';
import { Loading } from '../loading';

interface WaitForDisplayProps {
    children: ReactNode;
    delay?: number; // delay in milliseconds
    height?: string;
}

export const WaitForDisplay: React.FC<WaitForDisplayProps> = ({ children, height, delay = 3000 }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, delay);

        // Cleanup the timer if the component unmounts
        return () => clearTimeout(timer);
    }, [delay]);

    return (
        <>
        <div className="relative" style={{height}}>
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"><Loading /></div>
              {isVisible ? children : null}
        </div>
        </>
    );
}