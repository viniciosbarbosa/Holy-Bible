import { create } from "zustand";

interface ModalState {
  isEditBookOpen: boolean;
  isAddPhaseOpen: boolean;
  isAddBookOpen: boolean;
  isResetModalOpen: boolean;
  
  activeBookId: string | null;
  activePhaseId: string | null;
  
  openEditBook: (bookId: string, phaseId: string) => void;
  openAddPhase: () => void;
  openAddBook: (phaseId: string) => void;
  openResetModal: () => void;
  
  closeAllModals: () => void;
  isAnyModalOpen: () => boolean;
}

export const useModalStore = create<ModalState>((set, get) => ({
  isEditBookOpen: false,
  isAddPhaseOpen: false,
  isAddBookOpen: false,
  isResetModalOpen: false,
  
  activeBookId: null,
  activePhaseId: null,
  
  isAnyModalOpen: () => {
    const state = get();
    return state.isEditBookOpen || state.isAddPhaseOpen || state.isAddBookOpen || state.isResetModalOpen;
  },
  
  openEditBook: (bookId, phaseId) =>
    set({ isEditBookOpen: true, activeBookId: bookId, activePhaseId: phaseId }),
  openAddPhase: () =>
    set({ isAddPhaseOpen: true }),
  openAddBook: (phaseId) =>
    set({ isAddBookOpen: true, activePhaseId: phaseId }),
  openResetModal: () =>
    set({ isResetModalOpen: true }),
  
  closeAllModals: () =>
    set({ 
      isEditBookOpen: false, 
      isAddPhaseOpen: false, 
      isAddBookOpen: false, 
      isResetModalOpen: false,
      activeBookId: null, 
      activePhaseId: null 
    }),
}));
