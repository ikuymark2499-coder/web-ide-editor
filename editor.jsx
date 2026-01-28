import React, { useState, useRef, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, 
  onAuthStateChanged, signOut 
} from 'firebase/auth';
import { 
  getFirestore, collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc, query, where 
} from 'firebase/firestore';
import { 
  Folder, FileCode, Plus, Settings, Search, Trash2, ArrowLeft, 
  Save, Play, ChevronRight, X, Check, Code, Globe, LogOut, User, Lock, Mail, AlertCircle, Eye, EyeOff, Share2
} from 'lucide-react';

// --- Firebase Configuration (ของคุณ) ---
const firebaseConfig = {
  apiKey: "AIzaSyANrna15ivEKuiMbYBnHIuspe1FvcqV8zY",
  authDomain: "my-code-hub.firebaseapp.com",
  projectId: "my-code-hub",
  storageBucket: "my-code-hub.firebasestorage.app",
  messagingSenderId: "613216136098",
  appId: "1:613216136098:web:46da39b2918059d8a120fb",
  measurementId: "G-MV34NCN3X6",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = 'my-code-hub-v1';

const THEMES = {
  dark: { id: 'dark', name: 'Midnight Dark', bg: 'bg-[#0d1117]', card: 'bg-[#161b22]', text: 'text-slate-300', border: 'border-[#30363d]', accent: 'bg-blue-600', editor: 'bg-[#0d1117]', line: 'text-slate-600', folder: 'text-blue-400' },
  light: { id: 'light', name: 'Clean Light', bg: 'bg-slate-50', card: 'bg-white', text: 'text-slate-800', border: 'border-slate-200', accent: 'bg-blue-500', editor: 'bg-white', line: 'text-slate-400', folder: 'text-blue-500' },
  hacker: { id: 'hacker', name: 'Matrix Green', bg: 'bg-black', card: 'bg-neutral-900', text: 'text-green-500', border: 'border-green-900', accent: 'bg-green-700', editor: 'bg-black', line: 'text-green-900', folder: 'text-green-600' }
};

export default function App() {
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState({ email: '', password: '' });
  const [authError, setAuthError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const [theme, setTheme] = useState(THEMES.dark);
  const [files, setFiles] = useState([]); 
  const [currentDirId, setCurrentDirId] = useState(null); 
  const [activeFile, setActiveFile] = useState(null);
  const [view, setView] = useState('home'); 
  const [editorContent, setEditorContent] = useState('');
  const [savedContent, setSavedContent] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [modal, setModal] = useState(null); 
  const [inputName, setInputName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [path, setPath] = useState([{ id: null, name: 'Home' }]);

  // 1. Auth Listener
  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setIsAuthLoading(false);
    });
  }, []);

  // 2. Real-time Files from Firestore
  useEffect(() => {
    if (!user) return;
    const q = collection(db, 'artifacts', appId, 'users', user.uid, 'files');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setFiles(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => console.error(err));
    return () => unsubscribe();
  }, [user]);

  // 3. Handlers
  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      if (authMode === 'register') {
        await createUserWithEmailAndPassword(auth, authForm.email, authForm.password);
      } else {
        await signInWithEmailAndPassword(auth, authForm.email, authForm.password);
      }
    } catch (err) {
      setAuthError(err.message);
    }
  };

  const handleLogout = () => {
    signOut(auth);
    setView('home');
    setActiveFile(null);
  };

  const handleCreate = async () => {
    if (!inputName.trim()) return;
    const newItem = {
      name: inputName,
      type: modal === 'folder' ? 'folder' : 'file',
      parentId: currentDirId,
      content: modal === 'file' ? `<!-- ${inputName} -->\n<h1>Hello</h1>` : null,
      createdAt: Date.now()
    };
    await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'files'), newItem);
    setInputName('');
    setModal(null);
  };

  const saveFile = async () => {
    if (!activeFile) return;
    const docRef = doc(db, 'artifacts', appId, 'users', user.uid, 'files', activeFile.id);
    await updateDoc(docRef, { content: editorContent });
    setSavedContent(editorContent);
  };

  // --- ฟังชั่นแชร์ไปหน้า Community ---
  const publishToCommunity = async () => {
    if (!activeFile) return;
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'posts'), {
        title: activeFile.name,
        code: editorContent,
        author: user.email.split('@')[0],
        likes: 0,
        views: 0,
        createdAt: Date.now(),
        userId: user.uid
      });
      alert("แชร์ไปที่หน้า Community เรียบร้อย!");
    } catch (e) {
      alert("Error: " + e.message);
    }
  };

  const openFile = (file) => {
    setActiveFile(file);
    setEditorContent(file.content);
    setSavedContent(file.content);
    setView('editor');
  };

  if (isAuthLoading) return <div className="h-screen bg-[#0d1117] flex items-center justify-center text-blue-400">Connecting...</div>;

  if (!user) {
    return (
      <div className={`h-screen w-full flex items-center justify-center ${theme.bg} p-4`}>
        <div className={`${theme.card} border ${theme.border} w-full max-w-md p-8 rounded-3xl shadow-2xl`}>
          <div className="flex flex-col items-center mb-8">
            <div className={`p-4 rounded-2xl ${theme.accent} mb-4 text-white shadow-xl`}><Code size={32} /></div>
            <h1 className="text-2xl font-black text-white">WEB IDE CLOUD</h1>
            <p className="text-sm opacity-50 mt-1">ล็อกอินเพื่อเขียนโค้ดและแชร์งาน</p>
          </div>
          <form onSubmit={handleAuth} className="space-y-4">
            <input type="email" placeholder="Email" className="w-full p-3 bg-black/20 border border-white/10 rounded-xl text-white outline-none focus:border-blue-500" value={authForm.email} onChange={e => setAuthForm({...authForm, email: e.target.value})} required />
            <input type="password" placeholder="Password" className="w-full p-3 bg-black/20 border border-white/10 rounded-xl text-white outline-none focus:border-blue-500" value={authForm.password} onChange={e => setAuthForm({...authForm, password: e.target.value})} required />
            {authError && <div className="text-xs text-red-400 bg-red-400/10 p-3 rounded-lg border border-red-400/20">{authError}</div>}
            <button type="submit" className={`w-full py-3 rounded-xl ${theme.accent} text-white font-bold`}>{authMode === 'login' ? 'Login' : 'Register'}</button>
          </form>
          <button onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} className="w-full mt-4 text-xs text-blue-400 font-bold underline">
            {authMode === 'login' ? 'Need an account?' : 'Already have an account?'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-screen w-full flex flex-col ${theme.bg} ${theme.text} overflow-hidden`}>
      <header className={`h-14 border-b ${theme.border} flex items-center justify-between px-4 shrink-0 bg-black/20`}>
        <div className="flex items-center gap-2">
          {view !== 'home' && <button onClick={() => setView('home')} className="p-1.5 hover:bg-white/10 rounded-full"><ArrowLeft size={18}/></button>}
          <span className="font-bold text-white tracking-tighter">IDE CLOUD</span>
        </div>
        <div className="flex items-center gap-2">
          {/* ปุ่มไปหน้า Community */}
          <button onClick={() => alert("ระบบกำลังเปิดหน้า Community ในแท็บใหม่...")} className="px-4 py-1.5 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center gap-2">
            <Globe size={14}/> Community
          </button>
          <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} className="p-2 hover:bg-white/10 rounded-lg"><Settings size={20}/></button>
          {isSettingsOpen && (
            <div className={`absolute top-12 right-4 w-48 p-3 rounded-xl border ${theme.border} ${theme.card} z-50`}>
              <button onClick={handleLogout} className="w-full flex items-center gap-2 p-2 text-xs text-red-400"><LogOut size={14}/> Log out</button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-hidden relative">
        {view === 'home' && (
          <div className="p-6 h-full overflow-y-auto">
            <div className="flex justify-between items-end mb-8">
              <h1 className="text-2xl font-black text-white">My Projects</h1>
              <button onClick={() => setModal('file')} className={`${theme.accent} text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg`}>+ New File</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              {files.map(item => (
                <div key={item.id} onClick={() => openFile(item)} className={`p-4 rounded-xl border ${theme.border} ${theme.card} cursor-pointer hover:border-blue-500 transition-all flex flex-col items-center gap-2`}>
                  <FileCode size={32} className="text-blue-400" />
                  <span className="text-[10px] font-bold truncate w-full text-center text-white">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'editor' && (
          <div className="h-full flex flex-col">
            <div className={`h-12 border-b ${theme.border} flex items-center justify-between px-4 bg-black/20`}>
              <span className="text-xs font-mono opacity-50">{activeFile?.name}</span>
              <div className="flex gap-2">
                <button onClick={saveFile} className={`${theme.accent} px-4 py-1.5 rounded-lg text-xs font-bold text-white`}>Save</button>
                <button onClick={publishToCommunity} className="bg-green-600 px-4 py-1.5 rounded-lg text-xs font-bold text-white flex items-center gap-1">
                   <Share2 size={12}/> Publish
                </button>
              </div>
            </div>
            <textarea 
              className={`flex-1 p-5 ${theme.editor} outline-none font-mono text-sm leading-6 text-blue-200 resize-none`}
              value={editorContent} onChange={e => setEditorContent(e.target.value)}
            />
          </div>
        )}
      </main>

      {modal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100]">
          <div className={`w-[300px] p-6 rounded-2xl ${theme.card} border ${theme.border}`}>
            <h3 className="text-white font-bold mb-4">Project Name</h3>
            <input autoFocus className="w-full p-3 bg-black/20 border border-white/10 rounded-xl text-white outline-none mb-4" value={inputName} onChange={e => setInputName(e.target.value)} />
            <div className="flex justify-end gap-2 text-xs">
              <button onClick={() => setModal(null)} className="px-4 py-2 text-slate-500">Cancel</button>
              <button onClick={handleCreate} className={`${theme.accent} px-6 py-2 rounded-lg text-white font-bold`}>Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
          }
