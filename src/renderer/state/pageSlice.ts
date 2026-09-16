import { createSelector, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import type { RootState } from './configureStore';

export interface ToastProps {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export interface PageState {
  isLoading: boolean;
  dbReady: boolean;
  toasts: ToastProps[];
  version: string | undefined;
  isAllowedToLeave: boolean;
}

const initialState: PageState = {
  isLoading: false,
  dbReady: false,
  toasts: [],
  version: undefined,
  isAllowedToLeave: true
};

export const pageSlice = createSlice({
  name: 'pageSlice',
  initialState,
  reducers: {
    enableLoading: state => {
      state.isLoading = true;
    },
    disableLoading: state => {
      state.isLoading = false;
    },
    setDbReady: (state, action: PayloadAction<boolean>) => {
      state.dbReady = action.payload;
    },
    setVersion: (state, action: PayloadAction<string>) => {
      state.version = action.payload;
    },
    setAllowedToLeave: (state, action: PayloadAction<boolean>) => {
      state.isAllowedToLeave = action.payload;
    },
    addToast: (state, action: PayloadAction<Omit<ToastProps, 'id'>>) => {
      state.toasts.push({ ...action.payload, id: uuidv4() });
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(t => t.id !== action.payload);
    }
  }
});

export const {
  enableLoading,
  disableLoading,
  setDbReady,
  setVersion,
  setAllowedToLeave,
  addToast,
  removeToast
} = pageSlice.actions;

const selectPageSlice = (state: RootState) => state[pageSlice.name];

export const selectIsLoading = createSelector(selectPageSlice, s => s.isLoading);
export const selectDbReady = createSelector(selectPageSlice, s => s.dbReady);
export const selectToasts = createSelector(selectPageSlice, s => s.toasts);
export const selectVersion = createSelector(selectPageSlice, s => s.version);
export const selectAllowed = createSelector(selectPageSlice, s => s.isAllowedToLeave);
