<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>DevStudio Pro - Integrated Workspace</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&family=Inter:wght@300;400;600;700&display=swap');
        
        :root {
            --bg: #0d1117;
            --surface: #161b22;
            --border: #30363d;
            --accent: #2f81f7;
            --code-bg: #0d1117;
            --line-height: 1.5;
        }

        body { 
            font-family: 'Inter', sans-serif; 
            background-color: var(--bg); 
            color: #c9d1d9; 
            overflow: hidden;
            height: 100vh;
            margin: 0;
        }

        .code-font { 
            font-family: 'Fira Code', monospace; 
            font-size: 14px; 
            line-height: var(--line-height); 
            tab-size: 4;
        }

        /* Layout */
        .app-header {
            height: 48px;
            background: var(--surface);
            border-bottom: 1px solid var(--border);
            padding: 0 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            z-index: 100;
        }

        /* Grid */
        .item-card {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 16px 8px;
            text-align: center;
            cursor: pointer;
            transition: transform 0.1s;
        }
        .item-card:active { transform: scale(0.95); }

        /* Editor Engine */
        #editor-wrapper {
            position: relative;
            flex: 1;
            display: flex;
            background: var(--code-bg);
            overflow: hidden;
        }

        #ln-container {
            width: 45px;
            background: #0d1117;
            border-right: 1px solid var(--border);
            color: #484f58;
            text-align: right;
            padding: 20px 8px;
            user-select: none;
            overflow: hidden;
        }

        #ln-container div { height: 21px; font-size: 12px; }

        .editor-container {
            position: relative;
            flex: 1;
            overflow: hidden;
        }

        #edit-area, #code-display {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            padding: 20px;
            margin: 0;
            border: none;
            white-space: pre;
            overflow: auto;
            box-sizing: border-box;
            outline: none;
            background: transparent;
        }

        #edit-area {
            color: transparent;
            caret-color: #58a6ff;
            z-index: 5;
            resize: none;
        }

        #code-display {
            z-index: 1;
            pointer-events: none;
            color: #c9d1d9;
        }

        /* Syntax Colors */
        .token-tag { color: #7ee787; } 
        .token-attr { color: #d2a8ff; } 
        .token-string { color: #a5d6ff; } 
        .token-comment { color: #8b949e; font-style: italic; }
        .token-bracket { color: #ff7b72; }

        .btn-save:disabled { opacity: 0.3; cursor: not-allowed; }

        #toast {
            position: fixed;
            bottom: 24px;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background: #f0f6fc;
            color: #161b22;
            padding: 10px 24px;
            border-radius: 99px;
            font-size: 13px;
            font-weight: 600;
            z-index: 9999;
            transition: 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        #toast.active { transform: translateX(-50%) translateY(0); }
    </style>
</head>
<body>

    <!-- Auth -->
    <div id="auth-panel" class="fixed inset-0 z-[1000] bg-[#0d1117] flex items-center justify-center p-4">
        <div class="w-full max-w-[320px] space-y-6">
            <div class="text-center">
                <h1 class="text-3xl font-black text-blue-500 tracking-tighter">DEVSTUDIO</h1>
                <p class="text-[10px] text-gray-500 uppercase tracking-[0.2em] mt-2">Professional Mobile IDE</p>
            </div>
            <div class="bg-[#161b22] border border-[#30363d] p-6 rounded-2xl shadow-2xl space-y-4">
                <input type="email" id="l-email" placeholder="Email Address" class="w-full bg-[#0d1117] border border-[#30363d] p-3.5 rounded-xl text-sm text-white outline-none focus:border-blue-500 transition-colors">
                <input type="password" id="l-pass" placeholder="Password" class="w-full bg-[#0d1117] border border-[#30363d] p-3.5 rounded-xl text-sm text-white outline-none focus:border-blue-500 transition-colors">
                <button onclick="login()" class="w-full bg-blue-600 hover:bg-blue-500 py-3.5 rounded-xl font-bold text-white shadow-lg shadow-blue-900/20 active:scale-[0.98] transition-all">START CODING</button>
            </div>
        </div>
    </div>

    <!-- Header -->
    <header class="app-header">
        <div class="flex items-center gap-3">
            <span class="text-blue-500 font-black text-lg tracking-tighter">DS</span>
            <div class="h-4 w-[1px] bg-gray-700"></div>
            <button onclick="goHome()" class="text-gray-400 hover:text-white transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
            </button>
        </div>
        <div id="user-info" class="text-[11px] font-bold text-gray-400 uppercase tracking-wider"></div>
    </header>

    <!-- UI States -->
    <main class="h-[calc(100vh-48px)] overflow-y-auto p-5">
        <div id="v-folders">
            <div class="flex justify-between items-end mb-6">
                <div>
                    <h2 class="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Workspace</h2>
                    <h1 class="text-xl font-bold text-white">Projects</h1>
                </div>
                <button onclick="openModal('folder')" class="bg-blue-600/10 text-blue-500 px-4 py-2 rounded-xl text-xs font-bold border border-blue-500/20">+ New Folder</button>
            </div>
            <div id="g-folders" class="grid grid-cols-2 sm:grid-cols-4 gap-4"></div>
        </div>

        <div id="v-files" class="hidden">
            <div class="flex justify-between items-center mb-6">
                <button onclick="goHome()" class="flex items-center gap-2 text-gray-400 font-bold text-sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="m15 18-6-6 6-6"/></svg>
                    BACK
                </button>
                <button onclick="openModal('file')" class="bg-emerald-600/10 text-emerald-500 px-4 py-2 rounded-xl text-xs font-bold border border-emerald-500/20">+ New File</button>
            </div>
            <div id="g-files" class="grid grid-cols-2 sm:grid-cols-4 gap-4"></div>
        </div>
    </main>

    <!-- Professional Editor Overlay -->
    <div id="editor-ui" class="fixed inset-0 z-[500] bg-[#0d1117] hidden flex-col">
        <div class="h-14 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between px-4">
            <div class="flex items-center gap-4">
                <button onclick="closeEditor()" class="bg-gray-800 text-gray-400 p-2 rounded-lg">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
                </button>
                <div class="flex flex-col">
                    <span id="active-file" class="text-blue-400 code-font text-xs font-bold"></span>
                    <span class="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Editing Mode</span>
                </div>
            </div>
            <button id="btn-save-main" onclick="saveCurrent()" disabled class="px-6 py-2 bg-blue-600 rounded-xl text-xs font-black text-white btn-save shadow-lg shadow-blue-900/20">SAVE</button>
        </div>
        
        <div id="editor-wrapper">
            <div id="ln-container" class="code-font"></div>
            <div class="editor-container">
                <pre id="code-display" class="code-font"></pre>
                <textarea id="edit-area" class="code-font" spellcheck="false" oninput="onCodeInput()" onscroll="onCodeScroll()"></textarea>
            </div>
        </div>
    </div>

    <div id="toast">STATUS UPDATED</div>

<script>
    const STORAGE_KEY = 'ds_pro_workspace_v6';
    let db = JSON.parse(localStorage.getItem(STORAGE_KEY)) || { users: {} };
    let curUser = null;
    let fIdx = null, fiIdx = null;
    let originalCode = "";

    function login() {
        const e = document.getElementById('l-email').value;
        if(!e) return;
        if(!db.users[e]) db.users[e] = { name: e.split('@')[0].toUpperCase(), email: e, folders: [] };
        curUser = db.users[e];
        save();
        document.getElementById('auth-panel').style.display = 'none';
        document.getElementById('user-info').textContent = curUser.name;
        renderF();
    }

    function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(db)); }

    function goHome() {
        document.getElementById('v-folders').classList.remove('hidden');
        document.getElementById('v-files').classList.add('hidden');
        fIdx = null;
    }

    function renderF() {
        const g = document.getElementById('g-folders'); g.innerHTML = '';
        curUser.folders.forEach((f, i) => {
            const d = document.createElement('div');
            d.className = "item-card";
            d.innerHTML = `<div class="bg-yellow-500/10 text-yellow-500 w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3 font-bold text-xl">F</div><div class="text-[11px] font-bold text-white truncate px-2">${f.name}</div>`;
            d.onclick = () => { fIdx = i; renderFi(); document.getElementById('v-folders').classList.add('hidden'); document.getElementById('v-files').classList.remove('hidden'); };
            g.appendChild(d);
        });
    }

    function renderFi() {
        const g = document.getElementById('g-files'); g.innerHTML = '';
        curUser.folders[fIdx].files.forEach((f, i) => {
            const d = document.createElement('div');
            d.className = "item-card";
            d.innerHTML = `<div class="bg-blue-500/10 text-blue-400 w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3 font-bold text-xl">H</div><div class="text-[11px] font-bold text-white truncate px-2">${f.name}</div>`;
            d.onclick = () => openEditor(i);
            g.appendChild(d);
        });
    }

    function openEditor(idx) {
        fiIdx = idx;
        const file = curUser.folders[fIdx].files[idx];
        originalCode = file.content;
        document.getElementById('active-file').textContent = file.name;
        document.getElementById('edit-area').value = file.content;
        document.getElementById('editor-ui').classList.replace('hidden', 'flex');
        updateHighlight();
        checkSave();
    }

    function closeEditor() { document.getElementById('editor-ui').classList.replace('flex', 'hidden'); }

    function onCodeInput() { updateHighlight(); checkSave(); }

    function onCodeScroll() {
        const ta = document.getElementById('edit-area');
        const disp = document.getElementById('code-display');
        const ln = document.getElementById('ln-container');
        disp.scrollTop = ta.scrollTop;
        disp.scrollLeft = ta.scrollLeft;
        ln.scrollTop = ta.scrollTop;
    }

    function updateHighlight() {
        const ta = document.getElementById('edit-area');
        const disp = document.getElementById('code-display');
        const ln = document.getElementById('ln-container');
        const code = ta.value;
        const lines = (code.endsWith('\n') ? code + ' ' : code).split('\n');
        ln.innerHTML = lines.map((_, i) => `<div>${i+1}</div>`).join('');
        let html = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        html = html.replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="token-comment">$1</span>')
                   .replace(/(&lt;\/?[a-z1-6]+)/gi, '<span class="token-tag">$1</span>')
                   .replace(/(\s)([a-z-]+)(?==)/gi, '$1<span class="token-attr">$2</span>')
                   .replace(/(".*?"|'.*?')/g, '<span class="token-string">$1</span>')
                   .replace(/[{}()\[\]]/g, '<span class="token-bracket">$&</span>');
        disp.innerHTML = html + (code.endsWith('\n') ? '\n' : '');
    }

    function checkSave() {
        const current = document.getElementById('edit-area').value;
        document.getElementById('btn-save-main').disabled = (current === originalCode);
    }

    function saveCurrent() {
        const code = document.getElementById('edit-area').value;
        curUser.folders[fIdx].files[fiIdx].content = code;
        originalCode = code;
        save();
        checkSave();
        notify("WORKSPACE SAVED");
    }

    function openModal(type) {
        // Simple prompt fallback for stability in this version
        const name = prompt(`Enter ${type} name:`);
        if(!name) return;
        if(type === 'folder') curUser.folders.push({name: name, files: []});
        else curUser.folders[fIdx].files.push({name: name + ".html", content: '<!DOCTYPE html>\n<html>\n<head>\n<title>Page</title>\n</head>\n<body>\n  <h1>New File</h1>\n</body>\n</html>'});
        save(); renderF(); if(fIdx !== null) renderFi();
    }

    function notify(m) { const t = document.getElementById('toast'); t.textContent = m; t.classList.add('active'); setTimeout(() => t.classList.remove('active'), 2000); }
</script>
</body>
</html>
