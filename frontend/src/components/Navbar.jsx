import { Share2, MoreHorizontal, Zap, ChartBar, MessageCircle, MessageSquare } from "lucide-react";
import { useSelector } from "react-redux";

export default function Navbar() {
  const { conversations, selectedConversation } = useSelector(state => state.conversation);
  const {messages} = useSelector(state => state.message);
  return (
    <div className="h-14 flex items-center justify-between px-5 border-b border-white/5 bg-[#06070a]">

      {/* Left — chat title */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-cyber-accent/10 border border-cyber-accent/30 shadow-[0_0_10px_rgba(99,102,241,0.05)]">
          <MessageSquare size={13} className="text-indigo-300" />
        </div>
        <h2 className="text-[13.5px] font-semibold text-slate-100 tracking-tight">
          {selectedConversation?.title || "New Chat"}
        </h2>
        <span className="text-[9px] uppercase font-bold tracking-wider text-slate-500 bg-white/[0.02] border border-white/5 px-2.5 py-0.5 rounded-md">
          {messages.length} Messages
        </span>
      </div>

      {/* Right — actions */}
     

    </div>
  );
}