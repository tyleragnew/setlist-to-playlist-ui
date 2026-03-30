import React, { createContext, useCallback, useContext, useRef, useState } from 'react'

type StepContextType = {
    step: number
    setStep: (n: number) => void
}

const StepContext = createContext<StepContextType | undefined>(undefined)

export function StepProvider({ children }: { children: React.ReactNode }) {
    const [step, setStepRaw] = useState<number>(0)
    const prevStep = useRef(step)

    const setStep = useCallback((n: number) => {
        if (n !== prevStep.current) {
            prevStep.current = n
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
        }
        setStepRaw(n)
    }, [])

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
