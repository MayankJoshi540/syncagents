import { useDispatch, useSelector } from "react-redux";
import { FaGoogle } from "react-icons/fa";
import ArtifactPanel from "../components/ArtifactPanel";
import ChatArea from "../components/ChatArea";
import Sidebar from "../components/Sidebar";
import api from "../utils/axios";
import { setUserData } from "../redux/user.slice";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../firebase";

function Home() {
  const { userData } = useSelector(state => state.user);
  const dispatch=useDispatch()
const login=async (token)=>{
  try {
    const {data}=await api.post(`/api/auth/login`,{token})
    dispatch(setUserData(data.user))
  } catch (error) {
    console.log(error)
  }
}
  const handleGoogleLogin =async () => {
     const result =
     await signInWithPopup(auth,googleProvider);
    
     const token =await result.user.getIdToken();
     await login(token)
  };

  return (
    <div className="h-screen flex bg-[#06070a] text-white overflow-hidden font-sans">
      <Sidebar />
      <ChatArea />
      <ArtifactPanel />

      {!userData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md">
          <div className="w-[340px] bg-[#0d1017]/90 border border-white/5 rounded-2xl p-7 flex flex-col gap-6 shadow-[0_10px_40px_rgba(0,0,0,0.4)]">

            <div className="flex flex-col gap-1.5 text-center">
              <h2 className="text-[19px] font-bold text-slate-100 tracking-tight">Welcome to SyncAgents</h2>
              <p className="text-[13px] text-slate-500 font-medium">Please login to continue using the workspace.</p>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl text-sm font-semibold text-white bg-cyber-accent/15 border border-cyber-accent/30 hover:bg-cyber-accent/20 hover:border-cyber-accent/50 shadow-[0_0_15px_rgba(99,102,241,0.1)] active:scale-[0.98] transition-all duration-200 cursor-pointer"
            >
              <FaGoogle size={14} className="text-white" />
              Continue with Google
            </button>

          </div>
        </div>
      )}
    </div>
  );
}

export default Home;