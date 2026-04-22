import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ fullPage = false, size = 32, className = "" }) => {
    const content = (
        <div className={`flex items-center justify-center ${className}`}>
            <Loader2 className={`animate-spin text-primary-600`} size={size} />
        </div>
    );

    if (fullPage) {
        return (
            <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
                {content}
            </div>
        );
    }

    return content;
};

export default Loader;
