import React, { useState } from 'react';
import { Users, Heart, MessageSquare, Send, Plus, Crown, Sparkles, Filter, Check } from 'lucide-react';
import { useStore } from '../services/store';

export const CommunityView: React.FC = () => {
  const { communityPosts, addCommunityPost, togglePostLike, addCommentToPost, currentUser } = useStore();
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTag, setNewTag] = useState('Networking & Negócios');
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [selectedTagFilter, setSelectedTagFilter] = useState('Todos');

  const tags = ['Todos', 'Resultados & Cases', 'Networking & Negócios', 'Dúvidas & Aulas', 'Ferramentas & IA'];

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    addCommunityPost(newTitle, newContent, newTag);
    setNewTitle('');
    setNewContent('');
    setShowNewPostModal(false);
  };

  const handleSendComment = (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;
    addCommentToPost(postId, text);
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  const filteredPosts = communityPosts.filter(p => {
    if (selectedTagFilter === 'Todos') return true;
    return p.tag === selectedTagFilter;
  });

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1D2230] pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-widest font-mono">FORMAÇÃO VIP PRO</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            Comunidade Exclusiva VIP
          </h1>
          <p className="text-xs lg:text-sm text-[#A7AFBF]">
            Espaço de networking de alto nível, troca de experiências, validação de estratégias e parcerias.
          </p>
        </div>

        <button
          onClick={() => setShowNewPostModal(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA820A] hover:from-[#F5D76E] hover:to-[#D4AF37] text-black font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-gold-glow transition"
        >
          <Plus className="w-4 h-4" />
          <span>NOVO TÓPICO</span>
        </button>
      </div>

      {/* Filter Tags */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {tags.map(tag => (
          <button
            key={tag}
            onClick={() => setSelectedTagFilter(tag)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedTagFilter === tag
                ? 'bg-[#D4AF37] text-black shadow-sm'
                : 'bg-[#151922] text-[#A7AFBF] hover:text-white border border-[#1D2230]'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Posts List */}
      <div className="space-y-6">
        {filteredPosts.map(post => (
          <div
            key={post.id}
            className="p-6 rounded-3xl bg-[#151922] border border-[#1D2230] hover:border-[#D4AF37]/30 shadow-card-dark space-y-4 transition"
          >
            {/* Post Author Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img 
                  src={post.authorAvatar} 
                  alt={post.authorName} 
                  className="w-10 h-10 rounded-full object-cover border border-[#D4AF37]/40"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-white">{post.authorName}</h4>
                    <span className="text-[10px] px-2 py-0.2 rounded bg-[#D4AF37]/15 text-[#D4AF37] font-mono font-bold">
                      {post.authorRole}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#A7AFBF]">{post.createdAt}</p>
                </div>
              </div>

              <span className="text-[10px] px-3 py-1 rounded-full bg-[#0D0F12] border border-[#1D2230] text-[#A7AFBF] font-mono">
                {post.tag}
              </span>
            </div>

            {/* Post Content */}
            <div className="space-y-2">
              <h3 className="text-base font-bold text-white leading-snug">{post.title}</h3>
              <p className="text-xs text-[#A7AFBF] leading-relaxed whitespace-pre-line">{post.content}</p>
            </div>

            {/* Actions: Likes and Comments count */}
            <div className="flex items-center gap-4 pt-3 border-t border-[#1D2230] text-xs">
              <button
                onClick={() => togglePostLike(post.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition ${
                  post.likedByMe 
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' 
                    : 'bg-[#0D0F12] text-[#A7AFBF] hover:text-white border-[#1D2230]'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${post.likedByMe ? 'fill-current' : ''}`} />
                <span>{post.likes} Curtidas</span>
              </button>

              <div className="flex items-center gap-1.5 text-[#A7AFBF]">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{post.comments.length} Respostas</span>
              </div>
            </div>

            {/* Comments thread */}
            {post.comments.length > 0 && (
              <div className="space-y-2.5 pt-2 pl-4 border-l-2 border-[#1D2230]">
                {post.comments.map(comment => (
                  <div key={comment.id} className="p-3 rounded-xl bg-[#0D0F12] border border-[#1D2230] space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src={comment.authorAvatar} alt={comment.authorName} className="w-5 h-5 rounded-full object-cover" />
                        <span className="text-[11px] font-bold text-white">{comment.authorName}</span>
                      </div>
                      <span className="text-[9px] text-[#A7AFBF]">{comment.createdAt}</span>
                    </div>
                    <p className="text-xs text-[#A7AFBF] pl-7">{comment.content}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Add Comment Input */}
            <div className="flex items-center gap-2 pt-2">
              <input 
                type="text"
                value={commentInputs[post.id] || ''}
                onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && handleSendComment(post.id)}
                placeholder="Escreva uma resposta para este tópico..."
                className="flex-1 h-9 px-3 rounded-xl bg-[#0D0F12] border border-[#1D2230] text-xs text-white placeholder-[#A7AFBF]/50 focus:outline-none focus:border-[#D4AF37]"
              />
              <button
                onClick={() => handleSendComment(post.id)}
                className="px-3.5 h-9 rounded-xl bg-[#D4AF37] hover:bg-[#F5D76E] text-black font-bold text-xs flex items-center gap-1 transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Responder</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* New Topic Modal */}
      {showNewPostModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#0D0F12] border border-[#D4AF37]/50 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#1D2230]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                Criar Novo Tópico na Comunidade
              </h3>
              <button onClick={() => setShowNewPostModal(false)} className="text-[#A7AFBF] hover:text-white text-xs">
                Cancelar
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#A7AFBF]">Título do Tópico</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Como implementei o funil perpétuo de alta conversão"
                  className="w-full h-10 px-3 rounded-xl bg-[#151922] border border-[#1D2230] text-xs text-white placeholder-[#A7AFBF]/50 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#A7AFBF]">Categoria</label>
                <select
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#151922] border border-[#1D2230] text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="Resultados & Cases">Resultados & Cases</option>
                  <option value="Networking & Negócios">Networking & Negócios</option>
                  <option value="Dúvidas & Aulas">Dúvidas & Aulas</option>
                  <option value="Ferramentas & IA">Ferramentas & IA</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#A7AFBF]">Mensagem</label>
                <textarea
                  required
                  rows={5}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Compartilhe seus aprendizados, dúvidas ou insights detalhadamente..."
                  className="w-full p-3 rounded-xl bg-[#151922] border border-[#1D2230] text-xs text-white placeholder-[#A7AFBF]/50 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewPostModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#151922] text-xs text-[#A7AFBF] hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#F5D76E] text-black font-bold text-xs"
                >
                  Publicar Tópico
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
