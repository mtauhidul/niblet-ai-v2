// Firestore Collection Schemas

export interface User {
  id: string; // Firestore document ID (same as Firebase Auth UID)
  email: string;
  displayName?: string;
  photoURL?: string;
  
  // Onboarding Status
  isOnboardingComplete: boolean;
  
  // Basic Profile Info
  firstName: string;
  lastName: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  height?: number; // in cm
  currentWeight?: number; // in kg
  bmi?: number; // calculated BMI
  activityLevel?: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
  
  // Goal Info
  goalType?: 'weight_loss' | 'weight_gain' | 'maintain_weight' | 'muscle_gain';
  targetWeight?: number; // in kg
  targetCalories?: number; // daily calorie goal
  targetProtein?: number; // daily protein goal in grams
  targetCarbs?: number; // daily carbs goal in grams
  targetFat?: number; // daily fat goal in grams
  targetWater?: number; // daily water goal in ml
  goalTargetDate?: Date; // target date for reaching the goal
  goalCreatedAt?: Date; // when the goal was set
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface MealLog {
  id: string; // Firestore document ID
  userId: string; // Reference to user document
  
  // Meal Basic Info
  mealName: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'other';
  amount: number; // serving size
  unit: 'g' | 'ml' | 'oz' | 'cup' | 'piece' | 'serving';
  
  // Nutrition Information
  calories: number;
  protein: number; // in grams
  carbohydrates: number; // in grams
  fat: number; // in grams
  fiber?: number; // in grams
  sugar?: number; // in grams
  sodium?: number; // in mg
  
  // Additional Info
  brand?: string;
  barcode?: string; // for food scanning
  notes?: string;
  
  // Timestamps
  consumedAt: Date; // when the meal was consumed
  createdAt: Date; // when the log was created
  updatedAt: Date;
}

export interface WeightLog {
  id: string; // Firestore document ID
  userId: string; // Reference to user document
  
  // Weight Data
  weight: number; // in kg
  bodyFatPercentage?: number;
  muscleMass?: number; // in kg
  
  // Additional Measurements (optional)
  waistCircumference?: number; // in cm
  chestCircumference?: number; // in cm
  armCircumference?: number; // in cm
  thighCircumference?: number; // in cm
  
  // Notes
  notes?: string;
  
  // Timestamps
  recordedAt: Date; // when the weight was recorded
  createdAt: Date; // when the log was created
  updatedAt: Date;
}

// Type for creating new documents (without id, createdAt, updatedAt)
export type CreateUser = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
export type CreateMealLog = Omit<MealLog, 'id' | 'createdAt' | 'updatedAt'>;
export type CreateWeightLog = Omit<WeightLog, 'id' | 'createdAt' | 'updatedAt'>;

// Type for updating documents (optional fields except id)
export type UpdateUser = Partial<Omit<User, 'id' | 'createdAt'>> & { 
  id: string;
  updatedAt: Date;
};
export type UpdateMealLog = Partial<Omit<MealLog, 'id' | 'userId' | 'createdAt'>> & { 
  id: string;
  updatedAt: Date;
};
export type UpdateWeightLog = Partial<Omit<WeightLog, 'id' | 'userId' | 'createdAt'>> & { 
  id: string;
  updatedAt: Date;
};

// Validation schemas (you can use these with libraries like Zod)
export const MealTypes = ['breakfast', 'lunch', 'dinner', 'snack', 'other'] as const;
export const Units = ['g', 'ml', 'oz', 'cup', 'piece', 'serving'] as const;
export const GoalTypes = ['weight_loss', 'weight_gain', 'maintain_weight', 'muscle_gain'] as const;
export const ActivityLevels = ['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active'] as const;
export const GenderOptions = ['male', 'female', 'other'] as const;