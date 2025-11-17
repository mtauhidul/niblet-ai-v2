import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc,
  getDocs, 
  query, 
  where, 
  orderBy,
  limit,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { 
  User, 
  MealLog, 
  WeightLog, 
  CreateUser, 
  CreateMealLog, 
  CreateWeightLog, 
  UpdateUser, 
  UpdateMealLog, 
  UpdateWeightLog 
} from '@/lib/schemas';

// User operations
export const createUser = async (userData: CreateUser): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'users'), {
      ...userData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const updateUser = async (userId: string, userData: Partial<UpdateUser>): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...userData,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// Complete onboarding with user data
export const completeOnboarding = async (
  userId: string, 
  onboardingData: {
    age: number;
    gender: 'male' | 'female' | 'other';
    height: number;
    currentWeight: number;
    bmi: number;
    activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
  }
): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...onboardingData,
      isOnboardingComplete: true,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error completing onboarding:', error);
    throw error;
  }
};

export const getUser = async (userId: string): Promise<User | null> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const data = userSnap.data();
      return {
        id: userSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as User;
    }
    return null;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

// Meal log operations
export const createMealLog = async (mealData: CreateMealLog): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'meal_logs'), {
      ...mealData,
      consumedAt: Timestamp.fromDate(mealData.consumedAt),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating meal log:', error);
    throw error;
  }
};

export const updateMealLog = async (mealLogId: string, mealData: Partial<UpdateMealLog>): Promise<void> => {
  try {
    const mealRef = doc(db, 'meal_logs', mealLogId);
    const updateData: Record<string, unknown> = {
      ...mealData,
      updatedAt: Timestamp.now(),
    };
    
    if (mealData.consumedAt) {
      updateData.consumedAt = Timestamp.fromDate(mealData.consumedAt);
    }
    
    await updateDoc(mealRef, updateData);
  } catch (error) {
    console.error('Error updating meal log:', error);
    throw error;
  }
};

export const deleteMealLog = async (mealLogId: string): Promise<void> => {
  try {
    const mealRef = doc(db, 'meal_logs', mealLogId);
    await deleteDoc(mealRef);
  } catch (error) {
    console.error('Error deleting meal log:', error);
    throw error;
  }
};

export const getMealLogs = async (userId: string, limitCount?: number): Promise<MealLog[]> => {
  try {
    let q = query(
      collection(db, 'meal_logs'),
      where('userId', '==', userId),
      orderBy('consumedAt', 'desc')
    );
    
    if (limitCount) {
      q = query(q, limit(limitCount));
    }
    
    const querySnapshot = await getDocs(q);
    const mealLogs: MealLog[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      mealLogs.push({
        id: doc.id,
        ...data,
        consumedAt: data.consumedAt?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as MealLog);
    });
    
    return mealLogs;
  } catch (error) {
    console.error('Error getting meal logs:', error);
    throw error;
  }
};

// Weight log operations
export const createWeightLog = async (weightData: CreateWeightLog): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'weight_logs'), {
      ...weightData,
      recordedAt: Timestamp.fromDate(weightData.recordedAt),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating weight log:', error);
    throw error;
  }
};

export const updateWeightLog = async (weightLogId: string, weightData: Partial<UpdateWeightLog>): Promise<void> => {
  try {
    const weightRef = doc(db, 'weight_logs', weightLogId);
    const updateData: Record<string, unknown> = {
      ...weightData,
      updatedAt: Timestamp.now(),
    };
    
    if (weightData.recordedAt) {
      updateData.recordedAt = Timestamp.fromDate(weightData.recordedAt);
    }
    
    await updateDoc(weightRef, updateData);
  } catch (error) {
    console.error('Error updating weight log:', error);
    throw error;
  }
};

export const deleteWeightLog = async (weightLogId: string): Promise<void> => {
  try {
    const weightRef = doc(db, 'weight_logs', weightLogId);
    await deleteDoc(weightRef);
  } catch (error) {
    console.error('Error deleting weight log:', error);
    throw error;
  }
};

export const getWeightLogs = async (userId: string, limitCount?: number): Promise<WeightLog[]> => {
  try {
    let q = query(
      collection(db, 'weight_logs'),
      where('userId', '==', userId),
      orderBy('recordedAt', 'desc')
    );
    
    if (limitCount) {
      q = query(q, limit(limitCount));
    }
    
    const querySnapshot = await getDocs(q);
    const weightLogs: WeightLog[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      weightLogs.push({
        id: doc.id,
        ...data,
        recordedAt: data.recordedAt?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as WeightLog);
    });
    
    return weightLogs;
  } catch (error) {
    console.error('Error getting weight logs:', error);
    throw error;
  }
};

// Helper functions for data aggregation
export const getTodaysMeals = async (userId: string): Promise<MealLog[]> => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  try {
    const q = query(
      collection(db, 'meal_logs'),
      where('userId', '==', userId),
      where('consumedAt', '>=', Timestamp.fromDate(today)),
      orderBy('consumedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const mealLogs: MealLog[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      mealLogs.push({
        id: doc.id,
        ...data,
        consumedAt: data.consumedAt?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as MealLog);
    });
    
    return mealLogs;
  } catch (error) {
    console.error('Error getting today\'s meals:', error);
    throw error;
  }
};

export const getLatestWeight = async (userId: string): Promise<WeightLog | null> => {
  try {
    const q = query(
      collection(db, 'weight_logs'),
      where('userId', '==', userId),
      orderBy('recordedAt', 'desc'),
      limit(1)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        recordedAt: data.recordedAt?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as WeightLog;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting latest weight:', error);
    throw error;
  }
};