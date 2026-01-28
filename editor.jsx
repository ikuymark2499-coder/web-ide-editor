import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, 
  onAuthStateChanged, signOut 
} from 'firebase/auth';
import { 
  getFirestore, collection, addDoc, onSnapshot, doc, updateDoc, query 
} from 'firebase/firestore';
import { 
  FileCode, Settings, ArrowLeft, Globe, LogOut, Code, Share2, Plus
} from 'lucide-react';

// --- Firebase Configuration (Same for both apps) ---
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
  dark: { id: 'dark', bg: 'bg-[#0d1117]', card: 'bg-[#161b22]', text: 'text-slate-300', border: 'border-[#30363d]', accent: 'bg-blue-600', editor: 'bg-[#0d1117]' }
};

export default function App() {
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState({ email: '', password: '' });
  const [authError, setAuthError] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const [files, setFiles] = useState([]); 
  const [activeFile, setActiveFile] = useState(null);
  const [view, setView] = useState('home'); 
  const [editorContent, setEditorContent] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [modal, setModal] = useState(false);
  const [inputName, setInputName] = useState('');

  // IMPORTANT: Set your Community URL here
  const COMMUNITY_URL = "https://your-community-app-url.vercel.app";

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setIsAuthLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    const q = collection(db, 'artifacts', appId, 'users', user.uid, 'files');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setFiles(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsubscribe();
  }, [user]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      if (authMode === 'register') {
        await createUserWithEmailAndPassword(auth, authForm.email, authForm.password);
      } else {
        await signInWithEmailAndPassword(auth, authForm.email, authForm.password);
      }
    } catch (err) { setAuthError(err.message); }
  };

  const handleCreate = async () => {
    if (!inputName.trim()) return;
    await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'files'), {
      name: inputName,
      type: 'file',
      content: `// ${inputName}\nconsole.log("Hello World");`,
      createdAt: Date.now()
    });
    setInputName('');
    setModal(false);
  };

  const saveFile = async () => {
    if (!activeFile) return;
    const docRef = doc(db, 'artifacts', appId, 'users', user.uid, 'files', activeFile.id);
    await updateDoc(docRef, { content: editorContent });
    alert("Saved!");
  };

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
      alert("Published to Community!");
    } catch (e) { alert(e.message); }
  };

  if (isAuthLoading) return <div className="h-screen bg-[#0d1117] flex items-center justify-center text-blue-400 font-mono">INITIALIZING_IDE...</div>;

  if (!user) return (
    <div className="h-screen w-full flex items-center justify-center bg-[#0d1117] p-4">
      <div className="bg-[#161b22] border border-[#30363d] w-full max-w-md p-8 rounded-3xl shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="p-4 rounded-2xl bg-blue-600 mb-4 text-white shadow-xl"><Code size={32} /></div>
          <h1 className="text-2xl font-black text-white">WEB IDE CLOUD</h1>
          <p className="text-sm opacity-50 text-slate-300 mt-1">Sign in to start coding</p>
        </div>
        <form onSubmit={handleAuth} className="space-y-4">
          <input type="email" placeholder="Email" className="w-full p-3 bg-black/20 border border-white/10 rounded-xl text-white outline-none focus:border-blue-500" value={authForm.email} onChange={e => setAuthForm({...authForm, email: e.target.value})} required />
          <input type="password" placeholder="Password" className="w-full p-3 bg-black/20 border border-white/10 rounded-xl text-white outline-none focus:border-blue-500" value={authForm.password} onChange={e => setAuthForm({...authForm, password: e.target.value})} required />
          {authError && <div className="text-xs text-red-400 bg-red-400/10 p-3 rounded-lg">{authError}</div>}
          <button type="submit" className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold">{authMode === 'login' ? 'Login' : 'Register'}</button>
        </form>
        <button onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} className="w-full mt-4 text-xs text-blue-400 font-bold underline">
          {authMode === 'login' ? 'Create an account' : 'Already have an account?'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-screen w-full flex flex-col bg-[#0d1117] text-slate-300 overflow-hidden">
      <header className="h-14 border-b border-[#30363d] flex items-center justify-between px-4 shrink-0 bg-black/20">
        <div className="flex items-center gap-2">
          {view !== 'home' && <button onClick={() => setView('home')} className="p-1.5 hover:bg-white/10 rounded-full"><ArrowLeft size={18}/></button>}
          <span className="font-bold text-white">IDE CLOUD</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => window.open(COMMUNITY_URL, '_blank')} className="px-4 py-1.5 rounded-full bg-indigo-600/20 text-indigo-400 border border-indigo-600/30 text-xs font-bold flex items-center gap-2">
            <Globe size={14}/> Community
          </button>
          <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} className="p-2 hover:bg-white/10 rounded-lg text-slate-400"><Settings size={20}/></button>
          {isSettingsOpen && (
            <div className="absolute top-12 right-4 w-48 p-2 rounded-xl border border-[#30363d] bg-[#161b22] shadow-2xl z-50">
              <button onClick={() => signOut(auth)} className="w-full flex items-center gap-2 p-2 text-xs text-red-400 hover:bg-red-400/10 rounded-lg"><LogOut size={14}/> Sign Out</button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-hidden relative">
        {view === 'home' ? (
          <div className="p-6 h-full overflow-y-auto">
            <div className="flex justify-between items-end mb-8">
              <h1 className="text-2xl font-black text-white">Project Files</h1>
              <button onClick={() => setModal(true)} className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg">+ New File</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              {files.map(item => (
                <div key={item.id} onClick={() => { setActiveFile(item); setEditorContent(item.content); setView('editor'); }} className="p-4 rounded-xl border border-[#30363d] bg-[#161b22] cursor-pointer hover:border-blue-500 transition-all flex flex-col items-center gap-2">
                  <FileCode size={32} className="text-blue-400" />
                  <span className="text-[10px] font-bold truncate w-full text-center text-white">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col">
            <div className="h-12 border-b border-[#30363d] flex items-center justify-between px-4 bg-black/20">
              <span className="text-xs font-mono text-slate-500">{activeFile?.name}</span>
              <div className="flex gap-2">
                <button onClick={saveFile} className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-4 py-1.5 rounded-lg text-xs font-bold">Save</button>
                <button onClick={publishToCommunity} className="bg-green-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1">
                   <Share2 size={12}/> Publish
                </button>
              </div>
            </div>
            <textarea 
              className="flex-1 p-5 bg-[#0d1117] outline-none font-mono text-sm leading-6 text-blue-200 resize-none"
              value={editorContent} onChange={e => setEditorContent(e.target.value)}
              spellCheck="false"
            />
          </div>
        )}
      </main>

      {modal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100]">
          <div className="w-[320px] p-6 rounded-2xl bg-[#161b22] border border-[#30363d]">
            <h3 className="text-white font-bold mb-4">Create New File</h3>
            <input autoFocus placeholder="filename.js" className="w-full p-3 bg-black/20 border border-white/10 rounded-xl text-white outline-none mb-4" value={inputName} onChange={e => setInputName(e.target.value)} />
            <div className="flex justify-end gap-2 text-xs font-bold">
              <button onClick={() => setModal(false)} className="px-4 py-2 text-slate-500">Cancel</button>
              <button onClick={handleCreate} className="bg-blue-600 px-6 py-2 rounded-lg text-white">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
            }
