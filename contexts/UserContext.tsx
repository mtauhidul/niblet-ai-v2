"use client";

import React, { createContext, useContext, useEffect, useReducer, useCallback } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  Unsubscribe,
  doc,
  deleteDoc,
  addDoc 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { MealLog, WeightLog } from '@/lib/schemas';
import { useAuth } from './AuthContext';

interface UserState {
  mealLogs: MealLog[];
  weightLogs: WeightLog[];
  loading: boolean;
  error: string | null;
}

type UserAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_MEAL_LOGS'; payload: MealLog[] }
  | { type: 'SET_WEIGHT_LOGS'; payload: WeightLog[] }
  | { type: 'RESET_STATE' };

const initialState: UserState = {
  mealLogs: [],
  weightLogs: [],
  loading: false,
  error: null,
};

function userReducer(state: UserState, action: UserAction): UserState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_MEAL_LOGS':
      return { ...state, mealLogs: action.payload };
    case 'SET_WEIGHT_LOGS':
      return { ...state, weightLogs: action.payload, loading: false };
    case 'RESET_STATE':
      return initialState;
    default:
      return state;
  }
}

interface UserContextType extends UserState {
  refreshData: () => void;
  addMealLog: (mealData: Omit<MealLog, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  addWeightLog: (weight: number) => Promise<void>;
  deleteMealLog: (mealId: string) => Promise<void>;
  deleteWeightLog: (weightId: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | null>(null);

export const useUserData = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserData must be used within a UserProvider');
  }
  return context;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(userReducer, initialState);

  const refreshData = useCallback(() => {
    if (user) {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
    }
  }, [user]);

  const deleteMealLog = useCallback(async (mealId: string) => {
    if (!user?.uid) {
      throw new Error('User not authenticated');
    }
    
    try {
      await deleteDoc(doc(db, 'meal_logs', mealId));
    } catch (error) {
      console.error('Error deleting meal log:', error);
      throw new Error('Failed to delete meal log');
    }
  }, [user?.uid]);

  const deleteWeightLog = useCallback(async (weightId: string) => {
    if (!user?.uid) {
      throw new Error('User not authenticated');
    }
    
    try {
      await deleteDoc(doc(db, 'weight_logs', weightId));
    } catch (error) {
      console.error('Error deleting weight log:', error);
      throw new Error('Failed to delete weight log');
    }
  }, [user?.uid]);

  const addWeightLog = useCallback(async (weight: number) => {
    if (!user?.uid) {
      throw new Error('User not authenticated');
    }
    
    try {
      const now = new Date();
      const weightLogData = {
        userId: user.uid,
        weight: weight,
        recordedAt: now,
        createdAt: now,
        updatedAt: now,
      };
      
      await addDoc(collection(db, 'weight_logs'), weightLogData);
    } catch (error) {
      console.error('Error adding weight log:', error);
      throw new Error('Failed to add weight log');
    }
  }, [user]);

  const addMealLog = useCallback(async (mealData: Omit<MealLog, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user?.uid) {
      throw new Error('User not authenticated');
    }
    
    try {
      const now = new Date();
      const mealLogData = {
        ...mealData,
        userId: user.uid,
        createdAt: now,
        updatedAt: now,
      };
      
      await addDoc(collection(db, 'meal_logs'), mealLogData);
    } catch (error) {
      console.error('Error adding meal log:', error);
      throw new Error('Failed to add meal log');
    }
  }, [user]);

  useEffect(() => {
    if (!user?.uid) {
      dispatch({ type: 'RESET_STATE' });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    
    const unsubscribers: Unsubscribe[] = [];

    try {
      // Subscribe to meal logs
      const mealLogsQuery = query(
        collection(db, 'meal_logs'),
        where('userId', '==', user.uid),
        orderBy('consumedAt', 'desc')
      );

      const unsubscribeMealLogs = onSnapshot(
        mealLogsQuery,
        (snapshot) => {
          const logs: MealLog[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            logs.push({
              id: doc.id,
              ...data,
              consumedAt: data.consumedAt?.toDate() || new Date(),
              createdAt: data.createdAt?.toDate() || new Date(),
              updatedAt: data.updatedAt?.toDate() || new Date(),
            } as MealLog);
          });
          dispatch({ type: 'SET_MEAL_LOGS', payload: logs });
        },
        (error) => {
          console.error('Error fetching meal logs:', error);
          dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch meal logs' });
        }
      );

      unsubscribers.push(unsubscribeMealLogs);

      // Subscribe to weight logs
      const weightLogsQuery = query(
        collection(db, 'weight_logs'),
        where('userId', '==', user.uid),
        orderBy('recordedAt', 'desc')
      );

      const unsubscribeWeightLogs = onSnapshot(
        weightLogsQuery,
        (snapshot) => {
          const logs: WeightLog[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            logs.push({
              id: doc.id,
              ...data,
              recordedAt: data.recordedAt?.toDate() || new Date(),
              createdAt: data.createdAt?.toDate() || new Date(),
              updatedAt: data.updatedAt?.toDate() || new Date(),
            } as WeightLog);
          });
          dispatch({ type: 'SET_WEIGHT_LOGS', payload: logs });
        },
        (error) => {
          console.error('Error fetching weight logs:', error);
          dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch weight logs' });
        }
      );

      unsubscribers.push(unsubscribeWeightLogs);

    } catch (error) {
      console.error('Error setting up data subscriptions:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to initialize data subscriptions' });
    }

    // Cleanup function
    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [user?.uid]);

  const value: UserContextType = {
    ...state,
    refreshData,
    addMealLog,
    addWeightLog,
    deleteMealLog,
    deleteWeightLog,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};