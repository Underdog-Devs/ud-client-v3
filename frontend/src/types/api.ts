// API Response Types
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

// Health Check Response
export interface HealthCheck {
  status: string
  timestamp: string
  version: string
}

// API Info Response
export interface ApiInfo {
  name: string
  version: string
  environment: string
  debug: boolean
  cors_origins: string[]
}

// User Types
export interface User {
  id: number
  email: string
  is_active: boolean
  is_verified: boolean
  created_at: string
  updated_at: string
  last_login?: string
  role_id?: number
}

export interface UserProfile {
  id: number
  user_id: number
  first_name?: string
  last_name?: string
  bio?: string
  location?: string
  website?: string
  github_username?: string
  linkedin_url?: string
  avatar_url?: string
  timezone?: string
  created_at: string
  updated_at: string
}

export interface UserRole {
  id: number
  name: string
  description?: string
  created_at: string
}

// Content Types
export interface Post {
  id: number
  title: string
  slug: string
  content: string
  excerpt?: string
  image_url?: string
  published: boolean
  featured: boolean
  view_count: number
  author_id: number
  created_at: string
  updated_at: string
  published_at?: string
}

export interface Quiz {
  id: number
  title: string
  slug: string
  description?: string
  is_active: boolean
  passing_score: number
  time_limit_minutes?: number
  max_attempts?: number
  created_by_id: number
  created_at: string
  updated_at: string
}

export interface QuizQuestion {
  id: number
  quiz_id: number
  question_text: string
  question_type: string
  options?: string
  correct_answer: string
  explanation?: string
  points: number
  order_index: number
  created_at: string
}

export interface Article {
  id: number
  title: string
  slug: string
  content: string
  summary?: string
  category?: string
  tags?: string
  published: boolean
  order_index?: number
  author_id: number
  created_at: string
  updated_at: string
}

// Progress Types
export interface UserProgress {
  id: number
  user_id: number
  total_quizzes_completed: number
  total_quizzes_passed: number
  total_articles_read: number
  current_streak_days: number
  longest_streak_days: number
  total_points: number
  level: number
  last_activity_date?: string
  created_at: string
  updated_at: string
}

export interface QuizCompletion {
  id: number
  user_id: number
  quiz_id: number
  score: number
  total_questions: number
  correct_answers: number
  time_spent_minutes?: number
  passed: boolean
  attempt_number: number
  completed_at: string
}

// Auth Types
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  first_name?: string
  last_name?: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
  user: User
}