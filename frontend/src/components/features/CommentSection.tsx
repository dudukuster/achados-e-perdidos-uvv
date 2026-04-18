import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { commentService } from "@/services/commentService";
import { useAuth } from "@/contexts/AuthContext";
import { Comment } from "@/types";

interface Props {
  itemId: string;
}

export function CommentSection({ itemId }: Props) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newText, setNewText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    commentService.getByItem(itemId).then(setComments).catch(() => {});
  }, [itemId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newText.trim()) return;
    setSubmitting(true);
    try {
      const comment = await commentService.create(itemId, newText.trim());
      setComments((prev) => [...prev, comment]);
      setNewText("");
    } catch {
      toast.error("Erro ao comentar", { description: "Tente novamente" });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdate(commentId: string) {
    if (!editText.trim()) return;
    try {
      const updated = await commentService.update(commentId, editText.trim());
      setComments((prev) => prev.map((c) => (c.id === commentId ? updated : c)));
      setEditingId(null);
      toast.success("Comentário atualizado");
    } catch {
      toast.error("Erro ao editar comentário");
    }
  }

  async function handleDelete(commentId: string) {
    try {
      await commentService.delete(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      toast.success("Comentário removido");
    } catch {
      toast.error("Erro ao apagar comentário");
    }
  }

  const isEdited = (c: Comment) =>
    new Date(c.updatedAt).getTime() - new Date(c.createdAt).getTime() > 2000;

  return (
    <div className="mt-6 space-y-4">
      <h2 className="font-heading text-lg font-semibold text-foreground">
        Comentários ({comments.length})
      </h2>

      <div className="space-y-3">
        {comments.length === 0 && (
          <p className="text-sm text-muted-foreground">Nenhum comentário ainda. Seja o primeiro!</p>
        )}

        {comments.map((c) => (
          <Card key={c.id} className="border border-border/60">
            <CardContent className="p-4">
              {editingId === c.id ? (
                <div className="space-y-2">
                  <Textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    rows={2}
                    maxLength={1000}
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleUpdate(c.id)}>Salvar</Button>
                    <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>Cancelar</Button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-sm text-foreground">{c.text}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {new Date(c.createdAt).toLocaleString("pt-BR")}
                      {isEdited(c) && (
                        <span className="ml-1 text-muted-foreground/60">· editado</span>
                      )}
                    </span>
                    {user?.id === c.authorId && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => { setEditingId(c.id); setEditText(c.text); }}
                          className="text-xs text-primary hover:underline"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="text-xs text-destructive hover:underline"
                        >
                          Apagar
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-2">
        <Textarea
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="Deixe um comentário..."
          rows={3}
          maxLength={1000}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={!newText.trim() || submitting}>
            {submitting ? "Enviando..." : "Comentar"}
          </Button>
        </div>
      </form>
    </div>
  );
}
