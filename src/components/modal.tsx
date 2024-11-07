import React, { ReactNode } from 'react';

interface ModalComponentProps {
    children: ReactNode;
}

export const ModalComponent: React.FC<ModalComponentProps> = ({ children }) => {
    return (
        <div className="absolute top-0 left-0 bg-slate-700/75 dark:bg-inherit w-full h-dvh z-10 backdrop-blur flex justify-center items-center">
            <div className="border relative w-fit h-fit bg-white dark:bg-black rounded">
                {children}
            </div>
        </div>
    );
};

export default ModalComponent;
