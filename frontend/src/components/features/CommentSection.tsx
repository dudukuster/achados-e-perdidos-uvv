import { useEffect, useState } from "react";
import { MessageSquare, Pencil, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
    <section className="campus-panel mt-6 p-5 md:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 font-heading text-xl font-extrabold text-[#061f40]">
            <MessageSquare className="h-5 w-5 text-[#f4634c]" />
            Comentários
          </h2>
          <p className="mt-1 text-sm text-[#66758a]">{comments.length} contribuição(ões) neste item</p>
        </div>
      </div>

      <div className="space-y-3">
        {comments.length === 0 && (
          <div className="rounded-[8px] border border-[#061f40]/10 bg-[#faf7f1] p-4 text-sm text-[#66758a]">
            Nenhum comentário ainda. Seja o primeiro a ajudar.
          </div>
        )}

        {comments.map((c) => {
          const isOwn = user?.id === c.authorId;

          return (
            <div key={c.id} className="rounded-[8px] border border-[#061f40]/10 bg-white/76 p-4">
              {editingId === c.id ? (
                <div className="space-y-3">
                  <Textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    rows={2}
                    maxLength={1000}
                    autoFocus
                    className="campus-input rounded-[8px] focus-visible:ring-[#061f40]/20 focus-visible:ring-offset-0"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" className="rounded-[8px] bg-[#061f40] text-white hover:bg-[#0b2b58]" onClick={() => handleUpdate(c.id)}>
                      Salvar
                    </Button>
                    <Button size="sm" variant="outline" className="rounded-[8px] border-[#061f40]/10 bg-white" onClick={() => setEditingId(null)}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-[#061f40] text-xs font-bold text-white">
                    {isOwn ? user?.name.charAt(0).toUpperCase() : "UVV"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-bold text-[#061f40]">{isOwn ? "Você" : "Comunidade"}</span>
                      <span className="text-xs font-medium text-[#66758a]">
                        {new Date(c.createdAt).toLocaleString("pt-BR")}
                        {isEdited(c) && <span className="ml-1 text-[#66758a]/70">· editado</span>}
                      </span>
                    </div>
                    <p className="text-sm leading-6 text-[#28384d]">{c.text}</p>
                    {isOwn && (
                      <div className="mt-3 flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="h-8 rounded-[8px] px-2 text-[#061f40] hover:bg-[#eef1f4]"
                          onClick={() => { setEditingId(c.id); setEditText(c.text); }}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Editar
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="h-8 rounded-[8px] px-2 text-[#b93927] hover:bg-[#fff4f1]"
                          onClick={() => handleDelete(c.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Apagar
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-3">
        <Textarea
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="Deixe um comentário..."
          rows={3}
          maxLength={1000}
          className="campus-input rounded-[8px] focus-visible:ring-[#061f40]/20 focus-visible:ring-offset-0"
        />
        <div className="flex justify-end">
          <Button type="submit" className="rounded-[8px] bg-[#f4634c] text-white hover:bg-[#df543f]" disabled={!newText.trim() || submitting}>
            <Send className="h-4 w-4" />
            {submitting ? "Enviando..." : "Comentar"}
          </Button>
        </div>
      </form>
    </section>
  );
}
