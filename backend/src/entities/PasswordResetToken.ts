export interface PasswordResetToken {
  id: string;
  tokenHash: string;
  userId: string;
  expiresAt: Date;
  usedAt: Date | null;
  attempts: number;
  maxAttempts: number;
  createdAt: Date;
}

export interface CreatePasswordResetTokenData {
  tokenHash: string;
  userId: string;
  expiresAt: Date;
  maxAttempts?: number;
}

