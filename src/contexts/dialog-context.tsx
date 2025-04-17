"use client"

import React from "react";

interface DialogContextProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const DialogContext = React.createContext<DialogContextProps>({
    open: false,
    setOpen: () => { }
})

export const useDialog = () => {
    const context = React.useContext(DialogContext);
    if (!context) {
        throw new Error("useDialog must be used within a DialogProvider");
    }
    return context;
};

export function DialogProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = React.useState(false)

    return <DialogContext.Provider value={{ open, setOpen }}>
        {children}
    </DialogContext.Provider>
}