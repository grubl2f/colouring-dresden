import { useState, useEffect } from 'react';

export const useIsSsr = (): boolean => {
    const [isSsr, setIsSsr] = useState(true);

    useEffect(() => {
        setIsSsr(false);
    }, []);

    return isSsr;
}
