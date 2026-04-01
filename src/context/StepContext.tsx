import React, { createContext, useContext, useState } from 'react'

type StepContextType = {
    step: number
    setStep: (n: number) => void
}

const StepContext = createContext<StepContextType | undefined>(undefined)

export function StepProvider({ children }: { children: React.ReactNode }) {
    const [step, setStep] = useState<number>(0)

    return (
        <StepContext.Provider value={{ step, setStep }}>
            {children}
        </StepContext.Provider>
    )
}

export function useStep(): number {
    const ctx = useContext(StepContext)
    if (!ctx) throw new Error('useStep must be used within a StepProvider')
    return ctx.step
}

export function useSetStep(): (n: number) => void {
    const ctx = useContext(StepContext)
    if (!ctx) throw new Error('useSetStep must be used within a StepProvider')
    return ctx.setStep
}

export default StepContext
