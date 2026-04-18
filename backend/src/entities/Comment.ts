export interface Comment {
  id: string;
  text: string;
  itemId: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateCommentData = Pick<Comment, 'text' | 'itemId' | 'authorId'>;
export type UpdateCommentData = Pick<Comment, 'text'>;
