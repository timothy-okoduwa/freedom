import { create } from 'zustand';

interface TourStore {
  isOpen: boolean;
  currentStepIndex: number;
  startTour: () => void;
  closeTour: () => void;
  nextStep: (totalSteps: number) => void;
  prevStep: () => void;
  goToStep: (index: number) => void;
}

export const useTourStore = create<TourStore>((set) => ({
  isOpen: false,
  currentStepIndex: 0,

  startTour: () => set({ isOpen: true, currentStepIndex: 0 }),
  closeTour: () => set({ isOpen: false }),

  nextStep: (totalSteps: number) =>
    set((state) => {
      if (state.currentStepIndex < totalSteps - 1) {
        return { currentStepIndex: state.currentStepIndex + 1 };
      }
      return { isOpen: false };
    }),

  prevStep: () =>
    set((state) => ({
      currentStepIndex: Math.max(0, state.currentStepIndex - 1),
    })),

  goToStep: (index: number) => set({ currentStepIndex: index }),
}));
