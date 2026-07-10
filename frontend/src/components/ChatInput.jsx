import { useState } from "react";
import { Send, Paperclip,  Square, Zap, MessageSquare, Code2, Presentation, Image as ImageIcon, Globe, FileText,X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, setArtifacts, setIsLoading } from "../redux/message.slice";
import { sendPrompt } from "../features/agent.api";
import { Mic, MicOff } from "lucide-react";
import { useEffect } from "react";
import { createConversation, updateConversations } from "../features/conversation.api";
import { addConversation, setConvTitle, setSelectedConversation } from "../redux/conversation.slice";
import { useRef } from "react";

export default function ChatInput({
  setBanner
}) {
  const [selectedAgent, setSelectedAgent] =useState("auto");
  const [value, setValue] = useState("");
const [isListening, setIsListening] = useState(false);

const recognitionRef = useRef(null);
  const dispatch = useDispatch();
  const { selectedConversation } = useSelector(state => state.conversation);
   const { isLoading } = useSelector(state => state.message);
const fileRef = useRef(null);

const [

selectedFile,

setSelectedFile

]=useState(null);

   const placeholders={

auto:"Ask SyncAgents...",

chat:"Chat with SyncAgents...",

coding:"Describe the software you want...",

pdf:"Generate a PDF about...",

ppt:"Create a presentation about...",

image:"Describe the image...",

search:"Search the web..."

};

   const agents = [

  {
    id:"auto",
    icon:Zap,
    label:"Auto"
  },

  {
    id:"chat",
    icon:MessageSquare,
    label:"Chat"
  },

  {
    id:"coding",
    icon:Code2,
    label:"Coding"
  },

  {
    id:"pdf",
    icon:FileText,
    label:"PDF"
  },

  {
    id:"ppt",
    icon:Presentation,
    label:"PPT"
  },

  {
    id:"image",
    icon:ImageIcon,
    label:"Image"
  },

  {
    id:"search",
    icon:Globe,
    label:"Search"
  }

];

useEffect(() => {

  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (!SpeechRecognition) return;

  const recognition = new SpeechRecognition();

  recognition.lang = "en-IN";

  recognition.interimResults = true;

  recognition.continuous = true;

  recognition.onresult = (event) => {

    let transcript = "";

    for (

      let i = event.resultIndex;

      i < event.results.length;

      i++

    ) {

      transcript += event.results[i][0].transcript;

    }

    setValue(transcript);

  };

  recognition.onend = () => {

    setIsListening(false);

  };

  recognitionRef.current = recognition;

}, []);

const toggleMic = () => {

  if (!recognitionRef.current) {

    alert("Speech Recognition not supported");

    return;

  }

  if (isListening) {

    recognitionRef.current.stop();

    setIsListening(false);

  } else {

    recognitionRef.current.start();

    setIsListening(true);

  }

};


  const handleSend = async () => {
    const prompt = value.trim();
    if (!prompt) return;

    dispatch(setIsLoading(true));

    try {


      let conversation = selectedConversation;

      if (!conversation) {
        const newConversation = await createConversation();
        dispatch(addConversation(newConversation));
        dispatch(setSelectedConversation(newConversation));
        conversation = newConversation;
      }

      const isGreeting = /^(hi|hello|hey|yo|test|hola|sup|greetings)\s*$/i.test(prompt);
      if (conversation.title === "New Chat" && !isGreeting) {
        const titleText = prompt.length > 30 ? prompt.slice(0, 30) + "..." : prompt;
        await updateConversations(conversation._id, titleText);
        dispatch(setConvTitle({ conversationId: conversation._id, title: titleText }));
      }

      dispatch(addMessage({ role: "user", content: prompt }));
      setValue("");

      const formData = new FormData();

formData.append(
    "conversationId",
    conversation._id
);

formData.append(
    "prompt",
    prompt
);

formData.append(
    "agent",
    selectedAgent
);

if(selectedFile){

    formData.append(
        "file",
        selectedFile
    );

}

setSelectedFile(null)

      const data = await sendPrompt(formData);
    console.log(data)
     dispatch(
  addMessage({
    role: "assistant",
    content: data.answer,
    images:data.images
  })
);

console.log(data)

if(data.artifacts){
  dispatch(
    setArtifacts(
      data.artifacts
    )
  );
}}
catch(error){

  setBanner({

    open:true,

    title:
      error.response?.data?.title ||
      "Something went wrong",

    message:
      error.response?.data?.message ||
      "Please try again."

  });

}
  finally {
    dispatch(setIsLoading(false));
  }
};

const handleKeyDown = (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleSend();
  }
};

  return (
    <div className="w-full overflow-hidden px-3 md:px-5 py-4 border-t border-white/5 bg-[#06070a]">
      <div className="flex flex-col gap-2 bg-[#0d1017] border border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.35)] rounded-2xl px-4 pt-3.5 pb-3 focus-within:border-cyan-500/20 focus-within:shadow-[0_0_20px_rgba(6,182,212,0.08)] transition-all duration-300">

        <div className="flex flex-wrap gap-1 p-1 bg-black/20 border border-white/5 rounded-xl max-w-full w-fit">
          {agents.map((agent) => {
            const Icon = agent.icon;
            const isActive = selectedAgent === agent.id;

            return (
              <button
                key={agent.id}
                onClick={() => setSelectedAgent(agent.id)}
                className={`
                  flex-shrink-0
                  inline-flex
                  items-center
                  gap-1.5
                  px-3
                  py-1.5
                  rounded-lg
                  text-xs
                  font-semibold
                  transition-all
                  duration-200
                  cursor-pointer
                  focus-visible:ring-1
                  focus-visible:ring-cyber-glow
                  focus-visible:outline-none
                  ${
                    isActive
                      ? "bg-cyber-accent/20 text-indigo-300 shadow-[0_0_12px_rgba(99,102,241,0.12)]"
                      : "bg-transparent text-slate-500 hover:text-slate-300"
                  }
                `}
              >
                <Icon
                  size={12}
                  className={isActive ? "text-indigo-400" : "text-slate-500"}
                />
                {agent.label}
              </button>
            );
          })}
        </div>

        {selectedFile && (
          <div className="my-2.5">
            <div className="inline-flex items-center gap-2.5 rounded-xl border border-white/5 bg-white/[0.02] p-2 pr-3">
              {selectedFile.type === "application/pdf" ? (
                <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <FileText size={15} className="text-red-400" />
                </div>
              ) : (
                selectedFile?.type.startsWith("image/") && (
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    className="h-8 w-8 rounded-lg object-cover border border-white/10"
                  />
                )
              )}

              <div className="max-w-[200px]">
                <p className="text-[11.5px] font-semibold text-slate-200 truncate">
                  {selectedFile.name}
                </p>
                <p className="text-[9.5px] font-medium text-slate-500 mt-0.5">
                  {Math.ceil(selectedFile.size / 1024)} KB
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedFile(null);
                  fileRef.current.value = "";
                }}
                className="ml-1 bg-white/[0.04] border border-white/5 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 rounded-md p-1 cursor-pointer transition-all duration-150 focus-visible:ring-1 focus-visible:ring-red-500 focus-visible:outline-none"
              >
                <X size={11} className="text-slate-500 group-hover:text-inherit" />
              </button>
            </div>
          </div>
        )}

        {/* Textarea */}
        <textarea
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholders[selectedAgent]}
          rows={3}
          disabled={isLoading}
          className="w-full bg-transparent outline-none resize-none text-[13.5px] font-medium text-slate-200 placeholder:text-slate-400 leading-relaxed no-scrollbar disabled:opacity-50 mt-1.5 focus:ring-0"
        />

        {/* Bottom row */}
        <div className="flex items-center justify-between mt-1 pt-1.5 border-t border-white/[0.03]">

          {/* Left — attach + mic */}
          <div className="flex items-center gap-1">
            <input
              ref={fileRef}
              type="file"
              hidden
              accept=".pdf,image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setSelectedFile(file);
                }
              }}
            />
            <button 
              className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/[0.04] border border-transparent hover:border-white/5 transition-all duration-150 bg-transparent cursor-pointer focus-visible:ring-1 focus-visible:ring-cyber-glow focus-visible:outline-none"
              onClick={() => fileRef.current.click()}
              title="Attach File (PDF/Image)"
            >
              <Paperclip size={14} />
            </button>
            <button
              onClick={toggleMic}
              className={`
                flex
                items-center
                justify-center
                w-8
                h-8
                rounded-lg
                border
                transition-all
                duration-200
                cursor-pointer
                focus-visible:ring-1
                focus-visible:ring-cyber-glow
                focus-visible:outline-none
                ${
                  isListening
                    ? "bg-red-500/10 border-red-500/30 text-red-400 mic-active-pulse"
                    : "bg-transparent text-slate-500 border-transparent hover:bg-white/[0.04] hover:text-slate-300 hover:border-white/5"
                }
              `}
              title={isListening ? "Listening..." : "Voice Input"}
            >
              {isListening ? <MicOff size={14} /> : <Mic size={14} />}
            </button>
          </div>

          {/* Right — send / stop */}
          <button
            onClick={handleSend}
            disabled={!isLoading && !value.trim()}
            className={`flex items-center justify-center w-8 h-8 rounded-lg border transition-all duration-200 focus-visible:ring-1 focus-visible:ring-cyber-glow focus-visible:outline-none
              ${isLoading
                ? "bg-white border-transparent text-[#06070a] hover:bg-slate-200"
                : value.trim()
                ? "bg-cyber-accent border-cyber-accent/30 text-white hover:bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.25)] cursor-pointer"
                : "bg-white/[0.01] border-white/5 text-slate-700 opacity-40 cursor-not-allowed"
              }`}
            title="Send Message"
          >
            {isLoading ? <Square size={10} fill="currentColor" className="border-none" /> : <Send size={13} />}
          </button>

        </div>
      </div>

      <p className="text-center text-[10px] font-medium text-slate-700 mt-2.5">
        SyncAgents can make mistakes. Verify important info.
      </p>
    </div>
  );
}