export type Role = 'survivor' | 'supporter' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  alias?: string; // For anonymous mode
}

export interface EvidenceItem {
  id: string;
  content: string;
  platform: 'twitter' | 'instagram' | 'facebook' | 'email' | 'whatsapp' | 'other';
  timestamp: string; // ISO String
  classification?: EvidenceAnalysis;
  hash: string; // SHA-256 simulation
}

export interface EvidenceAnalysis {
  category: 'threat' | 'doxxing' | 'stalking' | 'hate_speech' | 'defamation' | 'harassment' | 'unknown';
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  summary: string;
}

export interface Supporter {
  id: string;
  name: string;
  profession: 'lawyer' | 'therapist' | 'counselor' | 'ngo_worker' | 'digital_safety';
  specializations: string[];
  verified: boolean;
  rating: number;
  reviews: number;
  responseTime: string;
  bio: string;
  avatarUrl: string;
}

export interface Dossier {
  id: string;
  title: string;
  description: string;
  items: EvidenceItem[];
  generatedAt: string;
  severity: string;
  aiSummary?: string;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
}

export interface Connection {
  id: string;
  survivorId: string;
  supporterId: string;
  status: 'pending' | 'active' | 'closed';
  survivorAlias: string;
  messages: Message[];
  lastUpdated: string;
}