export interface IEmailService {
  sendPasswordResetEmail(input: {
    to: string;
    code: string;
    resetLink: string;
  }): Promise<void>;
}

