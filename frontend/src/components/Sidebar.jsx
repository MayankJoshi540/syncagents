import { useEffect, useState } from "react";
import { Plus, MessageSquare, Settings, LogOut, User, PenSquare, Menu, X, Coins, ConeIcon, CoinsIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import api from "../utils/axios";
import { setUserData } from "../redux/user.slice";
import { createConversation, getConversations } from "../features/conversation.api";
import { addConversation, setConversations, setSelectedConversation } from "../redux/conversation.slice";
import { getMessages } from "../features/message.api";
import { setArtifacts, setMessages } from "../redux/message.slice";
import BillingDrawer from "./BillingDrawer";

export default function Sidebar() {
  const [hovered, setHovered]     = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { userData } = useSelector(state => state.user);
  const { conversations, selectedConversation } = useSelector(state => state.conversation);
  const dispatch = useDispatch();
  const [showBilling, setShowBilling] = useState(false);

  const logout = async () => {
    try {
      await api.get("/api/auth/logout");
      dispatch(setUserData(null));
    } catch (error) {
      console.log(error);
    }
  };

  const formatRelativeTime = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHr / 24);

    if (diffSec < 60) return "now";
    if (diffMin < 60) return `${diffMin}m`;
    if (diffHr < 24) return `${diffHr}h`;
    if (diffDays === 1) return "1d";
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const groupConversations = (conversationsList) => {
    const groups = {
      Today: [],
      Yesterday: [],
      "Previous 7 Days": [],
      Older: []
    };

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);

    const sevenDaysAgo = new Date(startOfToday);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    conversationsList.forEach((chat) => {
      const chatDate = new Date(chat.updatedAt || chat.createdAt);
      if (chatDate >= startOfToday) {
        groups.Today.push(chat);
      } else if (chatDate >= startOfYesterday) {
        groups.Yesterday.push(chat);
      } else if (chatDate >= sevenDaysAgo) {
        groups["Previous 7 Days"].push(chat);
      } else {
        groups.Older.push(chat);
      }
    });

    return groups;
  };

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await getConversations();
        dispatch(setConversations(data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchConversations();
  }, [userData?._id]);

  const handleCreateConversation = () => {
    dispatch(setSelectedConversation(null));
    dispatch(setMessages([]));
    dispatch(setArtifacts([]));
    setMobileOpen(false);
  };

  const handleSelectConversation = async (conversation) => {
    setMobileOpen(false);
    dispatch(setSelectedConversation(conversation));
    const messages = await getMessages(conversation._id);
    dispatch(setMessages(messages));
    dispatch(setArtifacts(messages.artifacts));
  };

  const PanelIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/>
    </svg>
  );

  /* ── Collapsed rail — desktop only ── */
  const CollapsedRail = () => (
    <div className="hidden lg:flex flex-col items-center w-[56px] h-screen bg-[#06070a] border-r border-white/5 py-4 gap-1 shrink-0">
      <button
        onClick={() => setCollapsed(false)}
        className="flex items-center justify-center w-9 h-9 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border border-transparent hover:border-white/5 cursor-pointer mb-1 focus-visible:ring-1 focus-visible:ring-cyber-glow focus-visible:outline-none"
      >
        <PanelIcon />
      </button>

      <button
        onClick={handleCreateConversation}
        className="flex items-center justify-center w-9 h-9 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border border-transparent hover:border-white/5 cursor-pointer focus-visible:ring-1 focus-visible:ring-cyber-glow focus-visible:outline-none"
      >
        <Plus size={17} />
      </button>

      <div className="flex-1 flex flex-col items-center gap-1 overflow-y-auto w-full px-2 no-scrollbar mt-1">
        {conversations.map((chat) => {
          const isActive = selectedConversation?._id === chat._id;
          return (
            <button
              key={chat._id}
              onClick={() => handleSelectConversation(chat)}
              title={chat.title}
              className={`flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-150 border cursor-pointer focus-visible:ring-1 focus-visible:ring-cyber-glow focus-visible:outline-none
                ${isActive 
                  ? "bg-cyber-accent/15 text-indigo-300 border-cyber-accent/30 shadow-[0_0_10px_rgba(99,102,241,0.15)]" 
                  : "bg-transparent text-slate-500 border-transparent hover:bg-white/[0.04] hover:text-slate-300 hover:border-white/5"}`}
            >
              <MessageSquare size={15} />
            </button>
          );
        })}
      </div>

      <div className="mt-auto">
        {userData && (
          <div className="relative">
            {userData.avatar
              ? <img src={userData.avatar} alt={userData.name} className="w-8 h-8 rounded-[8px] object-cover border border-cyber-accent/30 shadow-[0_0_8px_rgba(99,102,241,0.2)]" />
              : <div className="w-8 h-8 rounded-[8px] bg-white/[0.06] flex items-center justify-center"><User size={14} className="text-slate-400" /></div>
            }
            <span className="absolute -bottom-px -right-px w-2 h-2 bg-green-500 rounded-full border-[1.5px] border-[#06070a] block" />
          </div>
        )}
      </div>
    </div>
  );

  /* ── Full sidebar content ── */
  const SidebarContent = () => {
    const grouped = groupConversations(conversations);

    return (
      <div className="flex flex-col h-full bg-[#0d1017] border-r border-white/5">
        {/* Header */}
        <div className="flex items-center gap-2.5 px-4 py-4 border-b border-white/5">
          {/* Desktop collapse */}
          <button
            onClick={() => setCollapsed(true)}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border border-transparent hover:border-white/5 cursor-pointer focus-visible:ring-1 focus-visible:ring-cyber-glow focus-visible:outline-none"
          >
            <PanelIcon />
          </button>

          {/* Mobile close */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border border-transparent hover:border-white/5 cursor-pointer focus-visible:ring-1 focus-visible:ring-cyber-glow focus-visible:outline-none"
          >
            <X size={15} />
          </button>

          <div className="flex items-center gap-1.5 flex-1 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
            <span className="text-[15px] font-semibold text-slate-100 tracking-tight">SyncAgents</span>
          </div>

          <span className="text-[9px] uppercase font-bold tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md">
           {userData?.plan ?? "free"}
          </span>

          <button
            onClick={handleCreateConversation}
            className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border border-transparent hover:border-white/5 cursor-pointer focus-visible:ring-1 focus-visible:ring-cyber-glow focus-visible:outline-none"
          >
            <PenSquare size={14} />
          </button>
        </div>

        {/* New Chat */}
        <div className="px-4 pt-4 pb-1">
          <button
            onClick={handleCreateConversation}
            className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-indigo-300 bg-cyber-accent/10 border border-cyber-accent/20 hover:bg-cyber-accent/15 hover:border-cyber-accent/40 shadow-[0_0_15px_rgba(99,102,241,0.08)] rounded-xl py-2.5 cursor-pointer transition-all duration-300 focus-visible:ring-1 focus-visible:ring-cyber-glow focus-visible:outline-none"
          >
            <Plus size={15} />
            New Chat
          </button>
        </div>

        {/* Chat list */}
        <div className="flex-1 overflow-y-auto px-2.5 pb-2 no-scrollbar flex flex-col gap-4 mt-2">
          {conversations.length === 0 ? (
            <div className="px-5 pt-4 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-600 select-none">
              No recent conversations
            </div>
          ) : (
            Object.entries(grouped).map(([groupName, items]) => {
              if (items.length === 0) return null;
              return (
                <div key={groupName} className="flex flex-col gap-1.5">
                  <p className="px-3 pt-2 pb-1 text-[9px] font-bold uppercase tracking-wider text-slate-500 select-none">
                    {groupName}
                  </p>
                  <div className="flex flex-col gap-3">
                    {items.map((chat) => {
                      const isActive = selectedConversation?._id === chat._id;
                      const isHov    = hovered === chat._id;
                      return (
                        <div
                          key={chat._id}
                          onClick={() => handleSelectConversation(chat)}
                          onMouseEnter={() => setHovered(chat._id)}
                          onMouseLeave={() => setHovered(null)}
                          className={`group flex items-center gap-2.5 cursor-pointer px-3 py-2.5 rounded-xl border transition-all duration-200 relative focus-visible:ring-1 focus-visible:ring-cyber-glow focus-visible:outline-none
                            ${isActive 
                              ? "bg-cyber-accent/10 border-cyber-accent/30 text-white shadow-[0_0_15px_rgba(99,102,241,0.08)]"
                              : isHov   
                                ? "bg-white/[0.03] border-white/5 text-slate-200"
                                : "bg-transparent border-transparent text-slate-400 hover:text-slate-300"}`}
                        >
                          {isActive && <div className="absolute left-0 w-1 h-5 bg-cyber-accent rounded-r-md" />}
                          <div className={`flex items-center justify-center shrink-0 w-7 h-7 rounded-lg border transition-all duration-200
                            ${isActive 
                              ? "bg-cyber-accent/15 border-cyber-accent/30 text-indigo-300" 
                              : "bg-white/[0.02] border-white/5 text-slate-500 group-hover:text-slate-400 group-hover:border-white/10"}`}>
                            <MessageSquare size={13} />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1.5">
                              <p className={`text-[13px] font-semibold truncate ${isActive ? "text-slate-100" : "text-slate-400 group-hover:text-slate-300"}`}>
                                {chat.title}
                              </p>
                              <span className="text-[9.5px] text-slate-500 shrink-0 font-medium group-hover:text-slate-400 transition-colors">
                                {formatRelativeTime(chat.updatedAt || chat.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {/* Subtle divider between sections */}
                  <div className="mx-3 mt-1 h-px bg-white/[0.02]" />
                </div>
              );
            })
          )}
        </div>

        {/* Divider */}
        <div className="mx-2.5 h-px bg-white/5" />

        {/* Footer */}
        <div className="px-3.5 py-3.5 bg-black/[0.1]">
          {userData ? (
            <div className="flex items-center gap-2.5 cursor-pointer rounded-xl px-3 py-2 border border-transparent hover:border-white/5 hover:bg-white/[0.02] transition-all duration-200">
              <div className="relative shrink-0">
                {
                  !userData?.avatar || imageError ? (
                    <div className="w-9 h-9 rounded-lg bg-white/[0.04] flex items-center justify-center border border-white/5">
                      <User size={15} className="text-slate-500" />
                    </div>
                  ) : (
                    <img
                      src={userData.avatar}
                      alt={userData.name}
                      className="w-9 h-9 rounded-lg object-cover border border-cyber-accent/20"
                      onError={() => setImageError(true)}
                    />
                  )
                }
                <span className="absolute -bottom-px -right-px w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#0d1017] block" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-slate-200 truncate">{userData.name}</p>
                <p className="text-[10px] font-medium text-slate-500 mt-0.5 capitalize">{userData.plan || "Free Plan"}</p>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setShowBilling(true)}
                  className="flex items-center justify-center w-7 h-7 rounded-lg border border-transparent hover:border-yellow-500/20 bg-transparent text-yellow-500/70 hover:text-yellow-400 cursor-pointer hover:bg-yellow-500/5 transition-all duration-150 focus-visible:ring-1 focus-visible:ring-cyber-glow focus-visible:outline-none"
                  title="Billing"
                >
                  <CoinsIcon size={14}/>
                </button>
                <button 
                  onClick={logout} 
                  className="flex items-center justify-center w-7 h-7 rounded-lg border border-transparent hover:border-red-500/20 bg-transparent text-slate-500 hover:text-red-400 cursor-pointer hover:bg-red-500/5 transition-all duration-150 focus-visible:ring-1 focus-visible:ring-cyber-glow focus-visible:outline-none"
                  title="Logout"
                >
                  <LogOut size={13} />
                </button>
              </div>
            </div>
          ) : (
            <div className="px-1">
              <button className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-slate-300 bg-white/[0.04] border border-white/10 rounded-xl py-2 cursor-pointer hover:bg-white/[0.08] transition-colors duration-150 focus-visible:ring-1 focus-visible:ring-cyber-glow focus-visible:outline-none">
                Login
              </button>
            </div>
          )}
        </div>

      </div>
    );
  };

  if (collapsed) return <CollapsedRail />;

  return (
    <>
      {/* ── Mobile hamburger ── */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-3.5 left-4 z-50 flex items-center justify-center w-8 h-8 rounded-lg bg-[#06070a] border border-white/5 text-slate-400 hover:text-slate-200 transition-colors duration-150 cursor-pointer"
      >
        <Menu size={16} />
      </button>

      {/* ── Mobile backdrop ── */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        />
      )}

      {/* ── Sidebar panel ── */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-[270px] h-screen shrink-0
        bg-[#0d1017] border-r border-white/5
        transition-transform duration-250
        ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <SidebarContent />
      </div>

      <BillingDrawer
        open={showBilling}
        onClose={() => setShowBilling(false)}
      />
    </>
  );
}