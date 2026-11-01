/* =====================================================================
   NeetCode Quest — app logic
   ===================================================================== */

/* ==================== DATA: NeetCode 150 ==================== */
const RAW = {
 "Arrays & Hashing":["Contains Duplicate|E","Valid Anagram|E","Two Sum|E","Group Anagrams|M","Top K Frequent Elements|M","Encode and Decode Strings|M","Product of Array Except Self|M","Valid Sudoku|M","Longest Consecutive Sequence|M"],
 "Two Pointers":["Valid Palindrome|E","Two Sum II|M|two-sum-ii-input-array-is-sorted","3Sum|M","Container With Most Water|M","Trapping Rain Water|H"],
 "Sliding Window":["Best Time to Buy and Sell Stock|E","Longest Substring Without Repeating Characters|M","Longest Repeating Character Replacement|M","Permutation in String|M","Minimum Window Substring|H","Sliding Window Maximum|H"],
 "Stack":["Valid Parentheses|E","Min Stack|M","Evaluate Reverse Polish Notation|M","Generate Parentheses|M","Daily Temperatures|M","Car Fleet|M","Largest Rectangle in Histogram|H"],
 "Binary Search":["Binary Search|E","Search a 2D Matrix|M","Koko Eating Bananas|M","Find Minimum in Rotated Sorted Array|M","Search in Rotated Sorted Array|M","Time Based Key-Value Store|M","Median of Two Sorted Arrays|H"],
 "Linked List":["Reverse Linked List|E","Merge Two Sorted Lists|E","Linked List Cycle|E","Reorder List|M","Remove Nth Node From End of List|M","Copy List with Random Pointer|M","Add Two Numbers|M","Find the Duplicate Number|M","LRU Cache|M","Merge K Sorted Lists|H","Reverse Nodes in K-Group|H"],
 "Trees":["Invert Binary Tree|E","Maximum Depth of Binary Tree|E","Diameter of Binary Tree|E","Balanced Binary Tree|E","Same Tree|E","Subtree of Another Tree|E","Lowest Common Ancestor of a BST|M|lowest-common-ancestor-of-a-binary-search-tree","Binary Tree Level Order Traversal|M","Binary Tree Right Side View|M","Count Good Nodes in Binary Tree|M","Validate Binary Search Tree|M","Kth Smallest Element in a BST|M","Construct Binary Tree from Preorder and Inorder Traversal|M","Binary Tree Maximum Path Sum|H","Serialize and Deserialize Binary Tree|H"],
 "Tries":["Implement Trie (Prefix Tree)|M|implement-trie-prefix-tree","Design Add and Search Words Data Structure|M","Word Search II|H"],
 "Heap / Priority Queue":["Kth Largest Element in a Stream|E","Last Stone Weight|E","K Closest Points to Origin|M","Kth Largest Element in an Array|M","Task Scheduler|M","Design Twitter|M","Find Median from Data Stream|H"],
 "Backtracking":["Subsets|M","Combination Sum|M","Permutations|M","Subsets II|M","Combination Sum II|M","Word Search|M","Palindrome Partitioning|M","Letter Combinations of a Phone Number|M","N-Queens|H"],
 "Graphs":["Number of Islands|M","Clone Graph|M","Max Area of Island|M","Pacific Atlantic Water Flow|M","Surrounded Regions|M","Rotting Oranges|M","Walls and Gates|M","Course Schedule|M","Course Schedule II|M","Redundant Connection|M","Number of Connected Components in an Undirected Graph|M","Graph Valid Tree|M","Word Ladder|H"],
 "Advanced Graphs":["Network Delay Time|M","Min Cost to Connect All Points|M","Cheapest Flights Within K Stops|M","Reconstruct Itinerary|H","Swim in Rising Water|H","Alien Dictionary|H"],
 "1-D Dynamic Programming":["Climbing Stairs|E","Min Cost Climbing Stairs|E","House Robber|M","House Robber II|M","Longest Palindromic Substring|M","Palindromic Substrings|M","Decode Ways|M","Coin Change|M","Maximum Product Subarray|M","Word Break|M","Longest Increasing Subsequence|M","Partition Equal Subset Sum|M"],
 "2-D Dynamic Programming":["Unique Paths|M","Longest Common Subsequence|M","Best Time to Buy and Sell Stock with Cooldown|M","Coin Change II|M","Target Sum|M","Interleaving String|M","Edit Distance|M","Longest Increasing Path in a Matrix|H","Distinct Subsequences|H","Burst Balloons|H","Regular Expression Matching|H"],
 "Greedy":["Maximum Subarray|M","Jump Game|M","Jump Game II|M","Gas Station|M","Hand of Straights|M","Merge Triplets to Form Target Triplet|M","Partition Labels|M","Valid Parenthesis String|M"],
 "Intervals":["Meeting Rooms|E","Insert Interval|M","Merge Intervals|M","Non-overlapping Intervals|M","Meeting Rooms II|M","Minimum Interval to Include Each Query|H"],
 "Math & Geometry":["Happy Number|E","Plus One|E","Rotate Image|M","Spiral Matrix|M","Set Matrix Zeroes|M","Pow(x, n)|M","Multiply Strings|M","Detect Squares|M"],
 "Bit Manipulation":["Single Number|E","Number of 1 Bits|E","Counting Bits|E","Reverse Bits|E","Missing Number|E","Sum of Two Integers|M","Reverse Integer|M"]
};
const slugify = s => s.toLowerCase().replace(/[(),']/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const PROBS = [], BY = {}, NC2ID = {};
for (const [cat, list] of Object.entries(RAW)) list.forEach(line => {
  const [name, d, s] = line.split("|");
  const id = s || slugify(name);
  const nc = (CARDS[id] && CARDS[id].nc) || id;
  const p = {id, name, d, cat, nc, order: PROBS.length};
  PROBS.push(p); BY[id] = p; NC2ID[nc] = id; NC2ID[id] = id;
});
const CATS = Object.keys(RAW);
const XP_BY_D = {E:20, M:40, H:80};
const DNAME = {E:"Easy", M:"Medium", H:"Hard"};
const SRS_DAYS = [1, 3, 7, 14, 30, 60];
const STEPS = ["Read it twice","Write 2 examples","Say the brute force","Find the pattern","Code it in Java","Test edge cases"];

/* ==================== STATE ==================== */
const KEY = "neetcode-quest-v1";
const pad = n => String(n).padStart(2,"0");
const dstr = d => d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate());
const today = () => dstr(new Date());
const addDays = (s, n) => { const d = new Date(s+"T12:00"); d.setDate(d.getDate()+n); return dstr(d); };
const dayDiff = (a, b) => Math.round((new Date(b+"T12:00") - new Date(a+"T12:00"))/864e5);

const fresh = () => ({
  xp:0, solved:{}, streak:0, best:0, last:null, log:{}, current:null, steps:[], dump:[], refocus:0, focusMin:0, badges:[],
  sound:true, reduce:false, goal:2,
  freezes:1, freezesUsed:0,
  notes:{}, srs:{}, reviews:0, revLog:{},
  pomo:{work:25, short:5, long:15, every:4, auto:false}, pomoCycle:0, tomTotal:0, tomLog:{},
  timer:{phase:"work", total:1500, left:1500, running:false, end:0},
  curElapsed:0, nudged:0, driftAt:0, boxCount:0, stepsAllDay:null,
  quest:{date:null, id:null, done:false},
  noiseVol:0.35, noiseType:"brown",
  lastBackup:null, backupNag:null,
  gh:{repo:"ImmaculateMaria1/neetcode-submissions", auto:true, lastSync:0, map:{}, latest:{}, unmatched:[], status:""}
});
let S = fresh();
try {
  const raw = localStorage.getItem(KEY);
  if (raw) { const d = JSON.parse(raw); const f = fresh(); S = Object.assign(f, d); S.pomo = Object.assign(f.pomo, d.pomo||{}); S.gh = Object.assign(f.gh, d.gh||{}); S.timer = Object.assign(f.timer, d.timer||{}); }
} catch(e) {}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch(e) {} };

/* ==================== HELPERS ==================== */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const pick = a => a[Math.floor(Math.random()*a.length)];
const shuffle = a => { a = a.slice(); for (let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const lcUrl = id => "https://leetcode.com/problems/" + id + "/";
const ncUrl = p => "https://neetcode.io/problems/" + p.nc;
const solvedIds = () => Object.keys(S.solved).filter(id => BY[id]);
const solvedN = () => solvedIds().length;
const solvedToday = () => solvedIds().filter(id => S.solved[id].date === today());
const fmt = sec => pad(Math.floor(sec/60)) + ":" + pad(sec%60);

function levelInfo(xp){ let lvl=1, need=100, acc=0; while (xp >= acc+need){ acc+=need; lvl++; need = 100 + (lvl-1)*40; } return {lvl, into: xp-acc, need}; }
const TITLES = ["Array Apprentice","Hash Map Hobbit","Pointer Padawan","Window Wrangler","Stack Stacker","Binary Bard","List Linker","Tree Hugger","Trie Tamer","Heap Hero","Backtrack Bandit","Graph Gremlin","DP Druid","Greedy Goblin","Interval Wizard","Bit Wizard","Algorithm Archmage"];

/* ==================== SOUND + FOCUS NOISE ==================== */
let AC = null;
const ac = () => (AC = AC || new (window.AudioContext||window.webkitAudioContext)());
function beep(notes){ if (!S.sound) return; try{ const a = ac(); let t = a.currentTime;
  notes.forEach(([f,d]) => { const o=a.createOscillator(), g=a.createGain(); o.type="triangle"; o.frequency.value=f; g.gain.setValueAtTime(.0001,t); g.gain.exponentialRampToValueAtTime(.18,t+.02); g.gain.exponentialRampToValueAtTime(.0001,t+d); o.connect(g).connect(a.destination); o.start(t); o.stop(t+d+.02); t += d*.75; });
 }catch(e){} }
const sfx = { tick:()=>beep([[880,.07]]), xp:()=>beep([[660,.08],[990,.12]]), win:()=>beep([[523,.12],[659,.12],[784,.12],[1047,.3]]), chime:()=>beep([[784,.25],[988,.25],[1175,.45]]), back:()=>beep([[440,.1],[660,.15]]), no:()=>beep([[300,.15],[220,.2]]) };

let noise = {src:null, gain:null, type:"off"};
function noiseBuffer(type){ const a = ac(), len = a.sampleRate*4, buf = a.createBuffer(1, len, a.sampleRate), d = buf.getChannelData(0);
  let last=0, b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
  for (let i=0;i<len;i++){ const w = Math.random()*2-1;
    if (type==="white") d[i] = w*0.25;
    else if (type==="brown"){ last = (last + 0.02*w)/1.02; d[i] = last*3.2; }
    else { b0=.99886*b0+w*.0555179; b1=.99332*b1+w*.0750759; b2=.969*b2+w*.153852; b3=.8665*b3+w*.3104856; b4=.55*b4+w*.5329522; b5=-.7616*b5-w*.016898; d[i]=(b0+b1+b2+b3+b4+b5+b6+w*.5362)*.09; b6=w*.115926; }
  } return buf; }
function setNoise(type){ try{
  if (noise.src){ noise.src.stop(); noise.src.disconnect(); noise.src=null; }
  noise.type = type;
  if (type !== "off"){ const a = ac(); a.resume && a.resume(); noise.gain = noise.gain || a.createGain(); noise.gain.gain.value = S.noiseVol; noise.gain.connect(a.destination);
    const src = a.createBufferSource(); src.buffer = noiseBuffer(type); src.loop = true; src.connect(noise.gain); src.start(); noise.src = src; S.noiseType = type; save(); }
 }catch(e){ toast("Couldn't start audio here"); }
 const b = $("#noiseBtn"); b.classList.toggle("on", noise.type!=="off"); b.textContent = noise.type==="off" ? "🌊" : "🌊 " + noise.type;
}

/* ==================== TOASTS / XP / CONFETTI ==================== */
function toast(msg){ const t = document.createElement("div"); t.className="toast"; t.innerHTML=msg; $("#toasts").appendChild(t); setTimeout(()=>t.remove(), 2800); }
function floatXP(n, el){ const r = (el && el.getBoundingClientRect ? el : $("#xpBar")).getBoundingClientRect(); const f = document.createElement("div"); f.className="xpfloat"; f.textContent="+"+n+" XP"; f.style.left=Math.max(10,r.left+r.width/2-30)+"px"; f.style.top=Math.max(10,r.top-6)+"px"; document.body.appendChild(f); setTimeout(()=>f.remove(),1200); }
const cv = $("#confetti"), cx = cv.getContext("2d"); let parts = [], raf = null;
function confetti(n=140){ if (S.reduce) return; cv.width=innerWidth; cv.height=innerHeight; const cols=["#8b5cf6","#f472b6","#34d399","#fbbf24","#38bdf8"];
  for(let i=0;i<n;i++) parts.push({x:innerWidth/2+(Math.random()-.5)*200,y:innerHeight*.45,vx:(Math.random()-.5)*14,vy:-Math.random()*14-4,s:Math.random()*7+4,c:pick(cols),r:Math.random()*6,vr:(Math.random()-.5)*.3,life:120});
  if(!raf) loop(); }
function loop(){ cx.clearRect(0,0,cv.width,cv.height); parts.forEach(p=>{p.vy+=.35;p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;p.life--; cx.save();cx.translate(p.x,p.y);cx.rotate(p.r);cx.fillStyle=p.c;cx.fillRect(-p.s/2,-p.s/4,p.s,p.s/2);cx.restore();});
  parts = parts.filter(p=>p.life>0 && p.y<cv.height+20); raf = parts.length ? requestAnimationFrame(loop) : (cx.clearRect(0,0,cv.width,cv.height), null); }

function addXP(n, el){ if (!n) return; const before = levelInfo(S.xp).lvl; S.xp += n; save(); floatXP(n, el); sfx.xp(); renderTop();
  const after = levelInfo(S.xp).lvl;
  if (after > before) showModal({icon:"🆙", title:"Level "+after+"!", html:"You're now a <b>"+TITLES[Math.min(after-1,TITLES.length-1)]+"</b>. Keep going.", onOpen:()=>{ confetti(200); sfx.win(); }, buttons:[["Let's go","primary",closeModal]]}); }

/* ==================== MODAL (queued) ==================== */
let modalQ = [], modalCur = null;
function showModal(m){ if (modalCur){ modalQ.push(m); return; } modalCur = m;
  $("#modalBody").className = "modal" + (m.wide ? " wide" : "");
  $("#modalBody").innerHTML = (m.icon?`<div class="big">${m.icon}</div>`:"") + (m.title?`<h2>${m.title}</h2>`:"") + `<div class="msg">${m.html||""}</div><div class="row actions"></div>`;
  const row = $("#modalBody .actions");
  (m.buttons||[]).forEach(([label, cls, fn]) => { const b = document.createElement("button"); b.className = "btn "+(cls||""); b.textContent = label; b.onclick = fn; row.appendChild(b); });
  $("#modal").classList.add("on"); if (m.onOpen) m.onOpen();
  setTimeout(()=>{ const b=row.querySelector("button"); if (b && !$("#modalBody textarea:focus, #modalBody input:focus")) b.focus(); }, 60); }
function closeModal(){ $("#modal").classList.remove("on"); modalCur = null; if (modalQ.length) setTimeout(()=>showModal(modalQ.shift()), 120); }
function dismissModal(){ const m = modalCur; if (m && m.onDismiss) m.onDismiss(); else closeModal(); }
$("#modal").onclick = e => { if (e.target.id==="modal") dismissModal(); };

/* ==================== STREAKS ==================== */
function touchStreak(){ const t = today(); if (S.last === t) return;
  S.streak = (S.last && dayDiff(S.last, t) === 1) ? S.streak + 1 : 1; S.last = t; S.best = Math.max(S.best, S.streak);
  if (S.streak % 7 === 0 && S.freezes < 2){ S.freezes++; setTimeout(()=>toast("🧊 7-day streak! You earned a streak freeze"), 1500); }
  save(); renderTop(); }
function checkStreakOnLoad(){ if (!S.last) return; const gap = dayDiff(S.last, today()); if (gap < 2) return;
  const missed = gap - 1;
  if (S.streak > 0 && missed <= S.freezes){ S.freezes -= missed; S.freezesUsed += missed; S.last = addDays(today(), -1); save();
    setTimeout(()=>toast(`🧊 Streak freeze used. Your ${S.streak}-day streak is safe!`), 800); }
  else if (S.streak > 0){ const lost = S.streak; S.streak = 0; save();
    showModal({icon:"💜", title:"Welcome back!", html:`Your ${lost}-day streak reset, but <b>nothing else did</b>: your XP, badges, notes and ${solvedN()} solved problems are all still here.<br><br>Life happens. One small thing today starts a new streak.`, buttons:[["Let's do one thing","primary",closeModal]]}); }
}

/* ==================== TOP BAR ==================== */
function renderTop(){
  const L = levelInfo(S.xp);
  $("#lvlName").textContent = "Level " + L.lvl;
  $("#lvlTitle").textContent = TITLES[Math.min(L.lvl-1, TITLES.length-1)];
  $("#xpText").textContent = L.into + " / " + L.need + " XP";
  $("#xpBar").style.width = (L.into/L.need*100) + "%";
  $("#streak").textContent = S.streak;
  $("#freezes").textContent = S.freezes ? "🧊".repeat(S.freezes) : "";
  const t = S.log[today()] || 0;
  $("#goalDots").innerHTML = Array.from({length:S.goal},(_,i)=>`<i class="${i<t?'on':''}"></i>`).join("");
  $("#goalText").textContent = t + " / " + S.goal + " today" + (t>=S.goal?" ✓":"");
  $("#soundBtn").textContent = S.sound ? "🔊" : "🔇";
  document.body.classList.toggle("reduce", !!S.reduce);
  const due = dueIds().length; $("#dueCount").textContent = due; $("#dueCount").classList.toggle("hidden", !due);
}

/* ==================== BUDDY ==================== */
const BUDDY = {
  idle:["Pick one problem. Just one. I'll keep you company.","Small steps still count. Read the problem first, that's all.","Tip: say the brute force out loud before optimizing.","You don't need motivation to start. Starting is what brings the motivation.","Stuck 20+ minutes? Peeking at the approach is a valid move. You still learn from it."],
  working:["You're doing it! One checkbox at a time.","Draw it out. Tiny examples help a lot.","What would the brute force look like here?","Is there a HashMap hiding in this problem? 👀","Edge cases: empty input, one element, duplicates, negatives."],
  back:["Welcome back! Noticing you drifted IS the skill. 💪","Hey, you came back. That's what matters.","Back in the zone. Check the highlighted step ↓","Every return makes your focus stronger."],
  solved:["LET'S GOOO 🎉","Another one down! Your brain is getting stronger.","That's a pattern you now own.","Seriously impressive. Water break?"],
  timer:["Timer's running. It's just you and the problem now.","Phone face down? 📵","Just this one session. You can stop when it ends."],
  review:["Warm-up time! Recognizing is easier than coding, so this is a great way to start.","Forgetting is normal. Every review makes it stick longer.","Quick recall reps. Don't overthink it!"]
};
const FACES = {idle:"🐙",working:"🐙",back:"🦋",solved:"🥳",timer:"🧘",review:"🧠"};
function say(kind, custom){ $("#buddyFace").textContent = FACES[kind]||"🐙"; $("#buddyMsg").textContent = custom || pick(BUDDY[kind]); }

/* ==================== FOCUS CARD ==================== */
function renderNow(){
  const p = S.current && BY[S.current];
  $("#pickerCard").classList.toggle("hidden", !!p);   // calmer page while working
  if (!p){
    $("#nowArea").innerHTML = `<div class="empty-now"><div class="e">🌱</div><h2 style="margin:6px 0">Nothing picked yet</h2><p>Take the next problem in order, let the wheel choose, or warm up with a quick review.</p>
      <div class="row" style="justify-content:center"><button class="btn primary" id="eNext">▶ Give me the next one</button><button class="btn" id="eSpin">🎰 Surprise me</button>${dueIds().length?`<button class="btn" id="eRev">🧠 Warm-up review</button>`:""}</div></div>`;
    $("#eNext").onclick = startNext; $("#eSpin").onclick = spin; const er = $("#eRev"); if (er) er.onclick = () => { switchView("review"); startReview(false); };
    $("#stepsArea").innerHTML = "";
    renderSyncLine(); return;
  }
  if (S.steps.length !== STEPS.length) S.steps = STEPS.map(()=>false);
  const nextIdx = S.steps.indexOf(false);
  $("#nowArea").innerHTML = `
    <div class="now-cat">${esc(p.cat)} · #${p.order+1} of 150</div>
    <div class="now-name">${esc(p.name)}</div>
    <div class="row" style="margin-bottom:6px"><span class="pill ${p.d}">${DNAME[p.d]}</span><span class="hint" style="margin:0">+${XP_BY_D[p.d]} XP on solve</span></div>
    <div class="row" style="margin-top:12px">
      <a class="btn" href="${ncUrl(p)}" target="_blank" rel="noopener">Open on NeetCode ↗</a>
      <a class="btn ghost" href="${lcUrl(p.id)}" target="_blank" rel="noopener">LeetCode ↗</a>
      <button class="btn ghost hide-zen" id="zenBtn" title="Hide everything else">🧘 Hyperfocus</button>
    </div>
    <div class="elapsed" id="elapsed"></div>`;
  $("#stepsArea").innerHTML = `
    <div class="steps">${STEPS.map((s,i)=>`<button class="step ${S.steps[i]?'done':''} ${i===nextIdx?'next':''}" data-i="${i}"><span class="box">${S.steps[i]?'✓':i+1}</span><span>${s}</span></button>`).join("")}</div>
    <div class="row" style="margin-top:16px">
      <button class="btn good" id="solvedBtn">✅ Solved it!</button>
      <button class="btn" id="peekBtn" title="Saw the solution: still counts, and it goes to review sooner">👀 Solved with help</button>
      <button class="btn ghost" id="parkBtn">⏭ Skip for now</button>
    </div>
    <div class="hint hide-zen"><span class="kbd">Space</span> timer · <span class="kbd">D</span> I drifted · <span class="kbd">B</span> brain dump · <span class="kbd">Esc</span> leave hyperfocus</div>`;
  $$(".step").forEach(b => b.onclick = () => { const i=+b.dataset.i; S.steps[i] = !S.steps[i]; save();
    if (S.steps[i]) { addXP(3, b); if (S.steps.every(Boolean)) { S.stepsAllDay = today(); save(); checkQuest(); say("working","All steps done! Submit on NeetCode, then hit Solved. 🚀"); } else say("working"); }
    renderNow(); });
  $("#solvedBtn").onclick = () => solve(false); $("#peekBtn").onclick = () => solve(true);
  $("#parkBtn").onclick = () => { S.current=null; S.steps=[]; S.curElapsed=0; S.nudged=0; save(); renderNow(); say("idle","Skipping is fine. Pick something that feels doable right now."); };
  $("#zenBtn").onclick = () => { document.body.classList.add("zen"); toast("🧘 Hyperfocus on. Press Esc to exit."); };
  renderElapsed(); renderSyncLine();
}
function renderElapsed(){ const el = $("#elapsed"); if (!el) return; const m = Math.floor(S.curElapsed/60);
  el.textContent = m < 1 ? "⏱ Just started" : `⏱ ${m} min on this problem` + (m>=25 ? " · stuck? peeking is allowed 👀" : "");
  el.classList.toggle("warn", m >= 25); }

function setFocus(id){ S.current=id; S.steps=STEPS.map(()=>false); S.curElapsed=0; S.nudged=0; save(); switchView("focus"); renderNow(); say("working","Okay: "+BY[id].name+". Step 1 is just reading it. That's it."); window.scrollTo({top:0,behavior:"smooth"}); }
function nextUnsolved(){ return PROBS.find(p => !S.solved[p.id] && p.id !== S.current) || null; }
function startNext(){ const p = nextUnsolved(); if (p) setFocus(p.id); else toast("You've solved all 150! 👑"); }

/* ---------- Pomodoro timer ---------- */
const C = 2*Math.PI*74; $("#ring").setAttribute("stroke-dasharray", C);
let tId = null;
function setTimer(min, phase="work"){ clearInterval(tId); S.timer = {phase, total:Math.round(min*60), left:Math.round(min*60), running:false, end:0}; save(); drawTimer(); }
function startTimer(){ const T = S.timer; if (T.running) return; if (T.left <= 0) { T.left = T.total; } T.running = true; T.end = Date.now()+T.left*1000; save();
  clearInterval(tId); tId = setInterval(tickTimer, 250); sfx.tick(); if (T.phase==="work" && Math.random()<.6) say("timer"); drawTimer(); }
function pauseTimer(){ const T = S.timer; if (!T.running) return; T.running=false; clearInterval(tId); T.left = Math.max(0, Math.round((T.end-Date.now())/1000)); save(); drawTimer(); }
function toggleTimer(){ S.timer.running ? pauseTimer() : startTimer(); }
function tickTimer(){ const T = S.timer; T.left = Math.max(0, Math.round((T.end-Date.now())/1000)); drawTimer(); if (T.left<=0) timerDone(); }
function drawTimer(){ const T = S.timer, isBreak = T.phase !== "work";
  $("#tLeft").textContent = fmt(T.left);
  $("#tLabel").textContent = isBreak ? (T.running ? (T.phase==="long"?"long break":"break") : "break ready") : (T.running ? "focusing" : (T.left<T.total ? "paused" : "ready"));
  $("#ring").setAttribute("stroke-dashoffset", C*(1-T.left/Math.max(1,T.total)));
  $("#timerEl").classList.toggle("break", isBreak);
  $("#tPlay").textContent = T.running ? "⏸ Pause" : (T.left<T.total && T.left>0 ? "▶ Resume" : (isBreak ? "☕ Start break" : "▶ Start"));
  $("#tSkip").classList.toggle("hidden", !isBreak);
  $("#presets").classList.toggle("hidden", isBreak);
  $$(".preset").forEach(b => b.classList.toggle("on", !isBreak && +b.dataset.m*60 === T.total));
  const every = S.pomo.every, inCycle = S.pomoCycle % every, filled = (S.pomoCycle>0 && inCycle===0 && T.phase==="long") ? every : inCycle;
  $("#toms").innerHTML = Array.from({length:every},(_,i)=>`<i class="${i<filled?'on':''}"></i>`).join("") + `<small>🍅 ${S.tomLog[today()]||0} today</small>`;
  document.title = T.running ? (isBreak?"☕ ":"⏳ ") + fmt(T.left) + " · NeetCode Quest" : "NeetCode Quest"; }
function timerDone(late){ clearInterval(tId); const T = S.timer; T.running=false; T.left=0;
  sfx.chime();
  if (T.phase === "work"){
    const mins = Math.round(T.total/60); S.focusMin += mins;
    const tomato = mins >= 15;
    if (tomato){ S.pomoCycle++; S.tomTotal++; S.tomLog[today()] = (S.tomLog[today()]||0)+1; }
    touchStreak(); save(); addXP(mins>=25?20:10); checkQuest(); checkBadges(); drawTimer();
    const longB = tomato && S.pomoCycle % S.pomo.every === 0;
    const bMin = longB ? S.pomo.long : S.pomo.short, bPhase = longB ? "long" : "short";
    const idea = pick(["stand up and stretch","get a glass of water","walk to a window","do 10 jumping jacks","shake out your hands","look at something far away for 20 seconds","roll your shoulders"]);
    if (!tomato){
      showModal({icon:"🐣", title:mins+" minutes done!", html:`You started, and that's the hardest part. Want to keep the momentum going?`, buttons:[["▶ Keep going ("+S.pomo.work+" min)","primary",()=>{closeModal(); setTimer(S.pomo.work); startTimer();}],["☕ "+S.pomo.short+"-min break","",()=>{closeModal(); setTimer(S.pomo.short,"short"); startTimer();}]]});
      return;
    }
    if (S.pomo.auto && !late){ setTimer(bMin, bPhase); startTimer(); toast(`🍅 Pomodoro done! ${bMin}-min break started. Idea: ${idea}`); say("idle","Break time! Step away from the screen."); return; }
    showModal({icon:longB?"🏆":"🍅", title:longB?`${S.pomo.every} Pomodoros, cycle complete!`:"Pomodoro done!",
      html:`${mins} minutes of focus, nicely done.${longB?" You've earned a <b>long break</b>.":""}<br><br>Break idea: <b>${idea}</b>`,
      buttons:[[`☕ Start ${bMin}-min break`,"primary",()=>{closeModal(); setTimer(bMin,bPhase); startTimer(); say("idle","Break time! Step away from the screen. I'll ping you.");}],["Skip break","",()=>{closeModal(); setTimer(S.pomo.work);}]]});
  } else {
    save(); drawTimer();
    showModal({icon:"⏰", title:"Break's over!", html:"Ready for another round? Just start the timer. You don't need to feel ready.", buttons:[[`▶ Focus ${S.pomo.work} min`,"primary",()=>{closeModal(); setTimer(S.pomo.work); startTimer();}],["Not yet","",()=>{closeModal(); setTimer(S.pomo.work);}]]});
  }
}
$("#tPlay").onclick = toggleTimer;
$("#tReset").onclick = () => setTimer(S.timer.phase==="work" ? S.timer.total/60 : S.pomo.work, "work");
$("#tSkip").onclick = () => { setTimer(S.pomo.work); toast("Break skipped"); };
$$(".preset").forEach(b => b.onclick = () => { const m = +b.dataset.m; setTimer(m);
  if (m === 5) { startTimer(); say("timer","Just 5 minutes. If you want to stop after that, you can. (You probably won't.)"); } });

/* ---------- Elapsed / stuck detector ---------- */
let saveTick = 0;
setInterval(() => {
  if (!S.current || document.visibilityState !== "visible") return;
  S.curElapsed++; if (++saveTick % 15 === 0) save();
  if (S.curElapsed % 60 === 0) renderElapsed();
  if (S.curElapsed >= 1500 && S.nudged < 1){ S.nudged = 1; save(); say("idle","25 minutes in. Stuck? Peek at just the approach (not the code), then try again. That's how pros learn."); toast("⏱ 25 min on this one. Peeking is allowed 👀"); }
  if (S.curElapsed >= 2700 && S.nudged < 2){ S.nudged = 2; save(); say("idle","45 minutes. Smart move: read the solution, code it yourself, hit 'Solved with help'. It'll come back for review."); toast("⏱ 45 min. 'Solved with help' is a smart move, not a cop-out"); }
}, 1000);

/* ==================== SOLVE + MEMORY CARD ==================== */
function markSolved(id, src, peeked){
  const p = BY[id], first = !S.solved[id], t = today();
  S.solved[id] = {date:t, peeked:!!peeked, src};
  S.log[t] = (S.log[t]||0) + 1; touchStreak();
  let xp = first ? XP_BY_D[p.d] : 10; if (peeked) xp = Math.round(xp/2);
  const hitGoal = S.log[t] === S.goal; if (hitGoal) xp += 25;
  S.boxCount++; save(); addXP(xp);
  return {xp, hitGoal};
}
function solve(peeked){
  const id = S.current; if (!id) return;
  const r = markSolved(id, "focus", peeked);
  S.current = null; S.steps = []; S.curElapsed = 0; S.nudged = 0; save();
  confetti(peeked?90:180); sfx.win(); say("solved");
  showSolvedCard(id, {peeked, xp:r.xp, hitGoal:r.hitGoal});
  checkBadges(); renderAll();
}

function codeHTML(lines){ return `<pre>${lines.map(l=>`<span class="ln">${esc(l)}</span>`).join("")}</pre>`; }
function cardHTML(id, o={}){
  const p = BY[id], c = CARDS[id];
  if (!c) return `<div class="mcard"><div class="mname">${esc(p.name)}</div><div class="hint">No card yet.</div></div>`;
  const mine = S.notes[id];
  return `<div class="mcard">
    <div class="mhead"><span class="mname">🃏 ${esc(p.name)}</span><span class="row"><span class="pill ${p.d}">${DNAME[p.d]}</span><span class="pill ptag">${esc(c.p)}</span></span></div>
    ${mine && !o.editable ? `<div class="label">Your one-liner</div><div class="mine">💡 ${esc(mine)}</div>` : ""}
    <div class="label">Key insight</div><div class="ins">${esc(c.i)}</div>
    <div class="label">Java toolkit</div>${codeHTML(c.j)}
    <div class="label">Complexity</div><div class="cx"><span><b>Time</b>${esc(c.t)}</span><span><b>Space</b>${esc(c.s)}</span></div>
    ${c.w ? `<div class="cx-why">${esc(c.w)}</div>` : ""}
    ${S.gh.latest[id] ? `<details class="code" data-id="${id}"><summary>👩‍💻 Your Java solution (from GitHub)</summary><pre class="codepre">Loading…</pre></details>` : ""}
  </div>`;
}
function wireCodeDetails(){ $$("#modalBody details.code, #reviewArea details.code").forEach(d => d.addEventListener("toggle", async () => {
  if (!d.open || d.dataset.loaded) return; d.dataset.loaded = 1; const pre = d.querySelector(".codepre");
  try { pre.textContent = await fetchCode(d.dataset.id); } catch(e) { pre.textContent = "Couldn't load the code right now."; } })); }

function showSolvedCard(id, o){
  const p = BY[id], nxt = nextUnsolved();
  let conf = o.peeked ? 0 : 1;
  const finish = (then) => {
    const ta = $("#oneLiner"); const note = ta ? ta.value.trim() : "";
    if (note){ if (!S.notes[id]) setTimeout(()=>addXP(3), 300); S.notes[id] = note; }
    seedSRS(id, conf); save(); closeModal(); checkQuest(); checkBadges(); renderAll();
    maybeMystery(then);
  };
  showModal({ wide:true, icon: o.peeked?"🧠":"🎉", title: o.synced ? "Detected from NeetCode!" : (o.peeked?"Learned it!":"Solved!"),
    html: `<div style="margin-bottom:10px"><b>+${o.xp} XP</b>${o.hitGoal?" · 🎯 <b>Daily goal hit!</b>":""}${o.peeked?" · it'll come back for review tomorrow":""}</div>
      ${cardHTML(id, {editable:true})}
      <div style="text-align:left">
        <div class="label" style="font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);margin:4px 0 6px;font-weight:600">💡 The trick was… (your words, +3 XP)</div>
        <input class="field" id="oneLiner" maxlength="200" placeholder="e.g. a set remembers what I've seen, so it's one pass" value="${esc(S.notes[id]||"")}">
        <div class="label" style="font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);margin:14px 0 6px;font-weight:600">How solid does it feel? (sets when it comes back for review)</div>
        <div class="conf" id="confBtns"><button data-c="0">😵 Shaky · 1 day</button><button data-c="1">🤔 Okay · 3 days</button><button data-c="2">😎 Solid · 7 days</button></div>
      </div>`,
    onOpen: () => { $$("#confBtns button").forEach(b => { b.classList.toggle("on", +b.dataset.c===conf); b.onclick = () => { conf = +b.dataset.c; $$("#confBtns button").forEach(x=>x.classList.toggle("on", x===b)); }; }); wireCodeDetails(); },
    onDismiss: () => finish(()=>{}),
    buttons: [[nxt ? "▶ Next: "+nxt.name : "👑 All done!","primary",()=>finish(()=>{ if (nxt) setFocus(nxt.id); })],["Take a break","",()=>finish(()=>{ say("idle","Good call. Rest is part of learning. 🌿"); })]]
  });
}
function showCardModal(id){
  showModal({ wide:true, title:"", html: cardHTML(id, {editable:true}) + `<div style="text-align:left"><div class="hint" style="margin:0 0 6px">💡 Your one-liner</div><input class="field" id="oneLiner" maxlength="200" value="${esc(S.notes[id]||"")}" placeholder="The trick was…"></div>`,
    onOpen: wireCodeDetails,
    buttons:[["Save","primary",()=>{ const v=$("#oneLiner").value.trim(); if (v && !S.notes[id]) addXP(3); if (v) S.notes[id]=v; else delete S.notes[id]; save(); closeModal(); checkBadges(); toast("Saved 💾"); }],["🔁 Redo in Focus","",()=>{ closeModal(); setFocus(id); }],["Close","ghost",closeModal]] });
}

/* ---------- Mystery box ---------- */
function maybeMystery(then){
  if (S.boxCount === 0 || S.boxCount % 3 !== 0 || S.lastBoxAt === S.boxCount){ then(); return; }
  S.lastBoxAt = S.boxCount; save();
  showModal({ icon:"", title:"🎁 Mystery box!", html:`Every 3 solves earns a surprise.<br><br><button class="gift" id="giftBtn" aria-label="Open the box">🎁</button><br><span class="hint" id="giftHint">Tap to open</span><div id="giftOut"></div>`,
    onOpen: () => { $("#giftBtn").onclick = () => { if ($("#giftBtn").dataset.done) return; $("#giftBtn").dataset.done = 1; $("#giftBtn").style.animation = "none";
      const r = Math.random(); let html;
      if (r < .2 && S.freezes < 2){ S.freezes++; html = `<h2>🧊 Streak freeze!</h2><p class="msg">If you miss a day, your streak survives.</p>`; renderTop(); }
      else if (r < .55){ html = `<h2>☕ Java tip</h2><p class="msg" style="text-align:left">${pick(JAVA_TIPS)}</p>`; addXP(10); }
      else { const n = pick([15,20,25,30,40,50]); html = `<h2>✨ +${n} bonus XP</h2>`; addXP(n); }
      $("#giftHint").remove(); $("#giftBtn").textContent = "🎉"; $("#giftOut").innerHTML = html; confetti(80); save(); }; },
    onDismiss: () => { closeModal(); then(); },
    buttons:[["Continue","primary",()=>{ closeModal(); then(); }]] });
}

/* ==================== DRIFT / DUMP ==================== */
function drifted(){ S.refocus++; sfx.back(); say("back");
  if (Date.now() - (S.driftAt||0) > 180000){ S.driftAt = Date.now(); addXP(2, $("#driftBtn")); } else toast("Welcome back 🦋");
  save(); checkBadges();
  if (S.current){ const n = S.steps.indexOf(false); if (n>=0) setTimeout(()=>say("back",`You're on step ${n+1}: "${STEPS[n]}". Just do that one.`),1800); } }
function renderDump(){ $("#dumpList").innerHTML = S.dump.length ? S.dump.map((d,i)=>`<li><span>💭 ${esc(d)}</span><button data-i="${i}" title="Done / dismiss">✓ done</button></li>`).join("") : `<li style="color:var(--muted);border:none">Nothing parked. Your head is clear ✨</li>`;
  $$("#dumpList button").forEach(b => b.onclick = () => { S.dump.splice(+b.dataset.i,1); save(); renderDump(); }); }
$("#dumpForm").onsubmit = e => { e.preventDefault(); const v = $("#dumpIn").value.trim(); if (!v) return; S.dump.unshift(v); $("#dumpIn").value=""; save(); renderDump(); addXP(1, $("#dumpIn")); say("back","Parked it. It'll be here later. Back to the problem. 🧭"); $("#dumpIn").blur(); };
$("#driftBtn").onclick = drifted;

/* ==================== DAILY QUEST ==================== */
const QUESTS = [
  {id:"medium", icon:"🌶️", text:"Solve a Medium or Hard problem", ok:()=>true, check:()=>solvedToday().some(id=>BY[id].d!=="E")},
  {id:"pomo2", icon:"🍅", text:"Finish 2 Pomodoros", ok:()=>true, check:()=>(S.tomLog[today()]||0)>=2},
  {id:"rev3", icon:"🧠", text:"Review 3 memory cards", ok:()=>solvedN()>=3, check:()=>(S.revLog[today()]||0)>=3},
  {id:"note", icon:"📝", text:"Write a one-liner for a problem you solve today", ok:()=>true, check:()=>solvedToday().some(id=>S.notes[id])},
  {id:"nopeek", icon:"💪", text:"Solve one problem without peeking", ok:()=>true, check:()=>solvedToday().some(id=>!S.solved[id].peeked)},
  {id:"two", icon:"✌️", text:"Solve 2 problems today", ok:()=>true, check:()=>(S.log[today()]||0)>=2},
  {id:"steps", icon:"✅", text:"Tick all 6 steps on a problem", ok:()=>true, check:()=>S.stepsAllDay===today()}
];
function ensureQuest(){ const t = today(); if (S.quest.date === t) return;
  const pool = QUESTS.filter(q => q.ok()); let h = 0; for (const ch of t) h = (h*31 + ch.charCodeAt(0)) >>> 0;
  S.quest = {date:t, id:pool[h % pool.length].id, done:false}; save(); }
function checkQuest(){ ensureQuest(); if (S.quest.done) return; const q = QUESTS.find(x=>x.id===S.quest.id); if (q && q.check()){ S.quest.done = true; save(); setTimeout(()=>{ addXP(30, $("#questBox")); toast("🎯 Daily quest complete! +30 XP"); confetti(60); renderQuest(); }, 700); } }
function renderQuest(){ ensureQuest(); const q = QUESTS.find(x=>x.id===S.quest.id) || QUESTS[0];
  $("#questBox").className = "quest hide-zen" + (S.quest.done ? " done" : "");
  $("#questBox").innerHTML = `<div class="qi">${S.quest.done?"✅":q.icon}</div><div style="flex:1"><small>DAILY QUEST · +30 XP</small><b>${esc(q.text)}</b></div>${S.quest.done?`<span class="pill E">Done!</span>`:""}`; }

/* ==================== PICKER ==================== */
let pickDiffs = new Set(["E","M"]), picked = null, spinning = false;
$("#pickCat").innerHTML = `<option value="">All topics</option>` + CATS.map(c=>`<option>${esc(c)}</option>`).join("");
$$(".dchip").forEach(b => b.onclick = () => { const d=b.dataset.d; pickDiffs.has(d)?pickDiffs.delete(d):pickDiffs.add(d); b.classList.toggle("on", pickDiffs.has(d)); });
function pool(){ const c = $("#pickCat").value; return PROBS.filter(p => !S.solved[p.id] && pickDiffs.has(p.d) && (!c || p.cat===c)); }
function spin(){ if (spinning) return; const P = pool(); if (!P.length){ toast("No unsolved problems match those filters"); return; }
  if (S.current){ S.current = null; save(); renderNow(); }
  switchView("focus"); $("#pickerCard").classList.remove("hidden"); $("#pickerCard").scrollIntoView({behavior:"smooth", block:"center"});
  spinning = true; const disp = $("#pickDisplay"); disp.classList.add("spinning"); let n = 0, delay = 40; const final = pick(P);
  const step = () => { const p = n < 18 ? pick(P) : final; disp.innerHTML = `<div><div class="pn">${esc(p.name)}</div><div class="pc"><span class="pill ${p.d}">${p.d}</span> ${esc(p.cat)}</div></div>`; if (n<18) sfx.tick();
    n++; if (n <= 18){ delay *= 1.15; setTimeout(step, delay); } else { spinning=false; disp.classList.remove("spinning"); picked = final; $("#pickStart").disabled = false; sfx.xp(); say("idle","The wheel picked "+final.name+". Want to give it a go?"); } };
  step(); }
$("#spinBtn").onclick = spin;
$("#pickStart").onclick = () => { if (picked) { setFocus(picked.id); $("#pickStart").disabled = true; } };
$("#pickNext").onclick = startNext;

/* ==================== REVIEW (spaced repetition) ==================== */
function seedSRS(id, conf){ const box = [0,1,2][conf] ?? 1; S.srs[id] = {box, due:addDays(today(), SRS_DAYS[box])}; }
function dueIds(){ const t = today(); return solvedIds().filter(id => { if (!S.srs[id]) S.srs[id] = {box:1, due:addDays(S.solved[id].date||t, 3)}; return S.srs[id].due <= t; })
  .sort((a,b)=>S.srs[a].due.localeCompare(S.srs[b].due)); }
function gradeSRS(id, g){ const r = S.srs[id] || {box:1}; let box = r.box, days;
  if (g === 0){ box = 0; days = 1; } else if (g === 1){ days = Math.max(1, Math.round(SRS_DAYS[box]/2)); } else { box = Math.min(box+1, SRS_DAYS.length-1); days = SRS_DAYS[box]; }
  S.srs[id] = {box, due:addDays(today(), days)}; }

const PATTERNS = [...new Set(Object.values(CARDS).map(c=>c.p))];
const TIMES = ["O(1)","O(log n)","O(n)","O(n log n)","O(n²)","O(n³)","O(2ⁿ)","O(n·2ⁿ)","O(n!)","O(m·n)","O(V + E)","O(n log k)","O(k)"];
let R = null; // active review session
function startReview(refresher){
  let ids = refresher ? shuffle(solvedIds()).slice(0,5) : dueIds().slice(0,8);
  if (!ids.length){ toast(refresher ? "Solve a problem first to unlock reviews" : "Nothing due. Try a random refresher!"); return; }
  R = {ids, i:0, correct:0, refresher, items: ids.map(id => ({id, type: pick(["flip","mcp","mct"]), state:"ask", choice:null, opts:null}))};
  R.items.forEach(it => { const c = CARDS[it.id];
    if (it.type === "mcp") it.opts = shuffle([c.p, ...shuffle(PATTERNS.filter(x=>x!==c.p)).slice(0,3)]);
    if (it.type === "mct") it.opts = shuffle([c.t, ...shuffle(TIMES.filter(x=>x!==c.t)).slice(0,3)]); });
  say("review"); renderReview(); }
function renderReview(){
  const A = $("#reviewArea");
  if (!R){
    const due = dueIds(), n = solvedN();
    const upcoming = solvedIds().map(id=>[id, S.srs[id]]).filter(([,r])=>r).sort((a,b)=>a[1].due.localeCompare(b[1].due)).slice(0,12);
    A.innerHTML = `
      <div class="card"><div class="rev-hero">
        <div><div class="num">${due.length}</div><div class="hint" style="margin:4px 0 0">${due.length===1?"card":"cards"} due for review today</div></div>
        <div style="flex:1;min-width:220px"><b style="font-size:18px">🧠 Test my memory</b><div class="hint" style="margin-top:4px">Quick recall reps on problems you've solved. Remember it and the gap grows (1 → 3 → 7 → 14 → 30 → 60 days). Forget it and it comes back tomorrow. About 3 minutes.</div></div>
        <div class="row"><button class="btn primary" id="revStart" ${due.length?"":"disabled"}>▶ Start review${due.length?` (${Math.min(due.length,8)})`:""}</button><button class="btn" id="revRand" ${n?"":"disabled"}>🎲 Random refresher</button></div>
      </div></div>
      ${n ? `<div class="card"><h3>📆 Coming up</h3><div class="sched">${upcoming.map(([id,r])=>{ const d = dayDiff(today(), r.due);
        return `<div class="prob"><span class="pill ${BY[id].d}">${BY[id].d}</span><span class="nm">${esc(BY[id].name)} ${S.notes[id]?`<span title="${esc(S.notes[id])}">💡</span>`:""}</span><span class="boxes" title="Memory strength">${"🟣".repeat(r.box+1)}${"⚪".repeat(SRS_DAYS.length-1-r.box)}</span><span class="hint" style="margin:0;min-width:80px;text-align:right">${d<=0?"due now":"in "+d+"d"}</span><button class="go" data-card="${id}">🃏 Card</button></div>`; }).join("")}</div></div>`
      : `<div class="card" style="text-align:center"><div style="font-size:44px">🌱</div><h2 style="margin:6px 0">No memory cards yet</h2><p class="hint">Solve your first problem and its Java memory card shows up here, ready for review.</p><button class="btn primary" id="revGo">▶ Go solve one</button></div>`}`;
    const s = $("#revStart"); if (s) s.onclick = () => startReview(false);
    const r = $("#revRand"); if (r) r.onclick = () => startReview(true);
    const g = $("#revGo"); if (g) g.onclick = () => { switchView("focus"); startNext(); };
    $$("#reviewArea [data-card]").forEach(b => b.onclick = () => showCardModal(b.dataset.card));
    return;
  }
  const it = R.items[R.i], p = BY[it.id], c = CARDS[it.id];
  const dots = R.items.map((x,i)=>`<i class="${i<R.i?'done':i===R.i?'cur':''}"></i>`).join("");
  let body = "";
  if (it.type === "flip"){
    body = `<div class="hint" style="margin:0">RECALL</div><div class="qprompt">${esc(p.name)}</div><span class="pill ${p.d}">${DNAME[p.d]}</span>
      <p class="hint">Say it out loud: the <b>pattern</b>, the <b>key idea</b>, the <b>Java structure</b> you'd use, and the <b>time/space</b>. Then flip.</p>
      ${it.state==="ask" ? `<button class="btn primary" id="flipBtn">🔄 Flip card <span class="kbd">F</span></button>`
        : `${cardHTML(it.id)}<div class="hint" style="margin:0 0 4px">How did you do?</div><div class="grade"><button class="g1" data-g="0">😵 Forgot <span class="kbd">1</span></button><button class="g2" data-g="1">🤔 Fuzzy <span class="kbd">2</span></button><button class="g3" data-g="2">😎 Nailed it <span class="kbd">3</span></button></div>`}`;
  } else {
    const q = it.type === "mcp" ? "Which pattern solves it best?" : "Time complexity of the optimal solution?";
    const right = it.type === "mcp" ? c.p : c.t;
    body = `<div class="hint" style="margin:0">${it.type==="mcp"?"PATTERN":"COMPLEXITY"}</div><div class="qprompt">${esc(p.name)}</div><span class="pill ${p.d}">${DNAME[p.d]}</span>${it.type==="mct"?` <span class="pill ptag">${esc(c.p)}</span>`:""}
      <p class="hint" style="margin-bottom:0">${q}</p>
      <div class="opts">${it.opts.map((o,k)=>{ const cls = it.state==="ask" ? "" : (o===right ? "right" : (o===it.choice ? "wrong" : ""));
        return `<button class="opt ${cls}" data-o="${k}" ${it.state!=="ask"?"disabled":""}><span class="k">${k+1}</span>${esc(o)}</button>`; }).join("")}</div>
      ${it.state==="ask" ? "" : `<div style="margin-top:14px">${it.choice===right?`<b style="color:var(--mint)">✅ Correct!</b>`:`<b style="color:var(--red)">Not quite</b>: it's <b>${esc(right)}</b>. Now it'll stick better.`}</div>${cardHTML(it.id)}<div class="row"><button class="btn primary" id="nextQ">Next → <span class="kbd">Enter</span></button></div>`}`;
  }
  A.innerHTML = `<div class="card qcard"><div class="row" style="justify-content:space-between;margin-bottom:8px"><b>${R.refresher?"🎲 Random refresher":"🧠 Review"} · ${R.i+1} / ${R.items.length}</b><button class="btn ghost sm" id="revQuit">End session</button></div>
    <div class="progress-dots">${dots}</div>${body}
    <div class="row" style="margin-top:12px"><button class="btn ghost sm" id="redoBtn">🔁 Redo this problem in Focus</button></div></div>`;
  $("#revQuit").onclick = () => finishReview(true);
  $("#redoBtn").onclick = () => { const id = it.id; R = null; renderReview(); setFocus(id); };
  const f = $("#flipBtn"); if (f) f.onclick = flipCard;
  $$("#reviewArea .grade button").forEach(b => b.onclick = () => gradeItem(+b.dataset.g));
  $$("#reviewArea .opt").forEach(b => b.onclick = () => answerMC(+b.dataset.o));
  const nq = $("#nextQ"); if (nq) nq.onclick = nextItem;
  wireCodeDetails();
}
function flipCard(){ if (!R) return; const it = R.items[R.i]; if (it.type!=="flip" || it.state!=="ask") return; it.state = "shown"; sfx.tick(); renderReview(); }
function gradeItem(g){ if (!R) return; const it = R.items[R.i]; if (it.type!=="flip" || it.state!=="shown") return;
  gradeSRS(it.id, g); if (g>0) R.correct++; logReview(); nextItem(); }
function answerMC(k){ if (!R) return; const it = R.items[R.i]; if (it.type==="flip" || it.state!=="ask") return;
  it.choice = it.opts[k]; it.state = "answered"; const right = it.type==="mcp" ? CARDS[it.id].p : CARDS[it.id].t;
  const ok = it.choice === right; ok ? (sfx.xp(), R.correct++) : sfx.no(); gradeSRS(it.id, ok ? 2 : 0); logReview(); renderReview(); }
function logReview(){ S.reviews++; S.revLog[today()] = (S.revLog[today()]||0)+1; save(); addXP(4); checkQuest(); }
function nextItem(){ if (!R) return; R.i++; if (R.i >= R.items.length) finishReview(false); else renderReview(); }
function finishReview(quit){ const done = R ? Math.min(R.i, R.items.length) : 0, correct = R ? R.correct : 0; R = null; renderReview(); renderTop();
  if (done === 0) return;
  touchStreak(); checkBadges();
  if (!quit){ confetti(120); sfx.win(); addXP(10); }
  showModal({icon:"🧠", title:quit?"Nice reps!":"Review complete!", html:`${correct} / ${done} remembered.${quit?"":" +10 XP bonus."}<br><br>${correct===done?"Your memory is on fire. 🔥":"The ones you missed come back tomorrow. That's exactly how it's supposed to work."}`,
    buttons:[["▶ Solve a problem","primary",()=>{ closeModal(); switchView("focus"); if (!S.current) startNext(); }],["Done","",closeModal]]});
  say("review","Brain warmed up! 🔥"); }
function renderReviewSide(){ const due = dueIds().length, n = solvedN();
  $("#reviewSide").innerHTML = `<h3>🧠 Memory</h3>` + (n ? `<div class="row" style="justify-content:space-between"><div><b style="font-size:22px">${due}</b> <span class="hint">due today</span><div class="hint" style="margin-top:2px">${n} cards collected</div></div><button class="btn ${due?"primary":""} sm" id="sideRev">${due?"▶ Warm up":"🎲 Refresher"}</button></div>`
    : `<div class="hint" style="margin-top:0">Solve a problem to collect its Java memory card. Cards come back here for quick reviews so the patterns stick.</div>`);
  const b = $("#sideRev"); if (b) b.onclick = () => { switchView("review"); startReview(!due); }; }

/* ==================== ROADMAP ==================== */
let openCat = null;
function renderRoad(){
  const q = $("#search").value.trim().toLowerCase();
  $("#roadSum").textContent = `· ${solvedN()}/150 solved`;
  $("#cats").innerHTML = CATS.map(c => {
    const ps = PROBS.filter(p=>p.cat===c && (!q || p.name.toLowerCase().includes(q) || (CARDS[p.id] && solvedIds().includes(p.id) && CARDS[p.id].p.toLowerCase().includes(q))));
    if (q && !ps.length) return "";
    const all = PROBS.filter(p=>p.cat===c), done = all.filter(p=>S.solved[p.id]).length, open = q || openCat===c;
    return `<div class="cat ${open?'open':''} ${done===all.length?'done':''}" data-c="${esc(c)}">
      <div class="cat-top"><b>${done===all.length?'✅ ':''}${esc(c)}</b><span>${done}/${all.length}</span></div>
      <div class="bar"><i style="width:${done/all.length*100}%"></i></div>
      ${open ? `<div class="plist">${ps.map(p=>{ const s=S.solved[p.id]; return `<div class="prob ${s?'solved':''}"><button class="chk" data-id="${p.id}" title="${s?'Mark unsolved':'Mark solved'}">${s?'✓':''}</button><span class="pill ${p.d}">${p.d}</span><span class="nm">${esc(p.name)} ${s&&s.peeked?'<span title="solved with help">👀</span>':''}${s&&s.src==="neetcode"?'<span title="synced from NeetCode">🔄</span>':''}${S.notes[p.id]?'<span title="has your one-liner">💡</span>':''}</span>${s?`<button class="go" data-card="${p.id}">🃏 Card</button>`:`<button class="go" data-focus="${p.id}">Focus →</button>`}</div>`; }).join("")}</div>` : ""}
    </div>`; }).join("");
  $$(".cat").forEach(el => el.onclick = e => { if (e.target.closest(".prob")) return; const c = el.dataset.c; openCat = openCat===c ? null : c; renderRoad(); });
  $$(".chk").forEach(b => b.onclick = e => { e.stopPropagation(); const id=b.dataset.id;
    if (S.solved[id]) { delete S.solved[id]; delete S.srs[id]; save(); renderAll(); toast("Marked unsolved"); }
    else { S.solved[id] = {date:today(), peeked:false, src:"manual"}; S.log[today()] = (S.log[today()]||0)+1; seedSRS(id, 1); touchStreak(); save(); addXP(5, b); toast("Marked solved (+5 XP). Use Focus mode for full XP and the card moment 🃏"); checkBadges(); renderAll(); } });
  $$("#cats [data-focus]").forEach(b => b.onclick = e => { e.stopPropagation(); setFocus(b.dataset.focus); });
  $$("#cats [data-card]").forEach(b => b.onclick = e => { e.stopPropagation(); showCardModal(b.dataset.card); });
}
$("#search").oninput = renderRoad;

/* ==================== GITHUB / NEETCODE SYNC ==================== */
const CODE = {};
const rawUrl = path => `https://raw.githubusercontent.com/${S.gh.repo}/HEAD/${path.split("/").map(encodeURIComponent).join("/")}`;
async function fetchCode(id){ if (CODE[id]) return CODE[id]; const path = S.gh.latest[id]; if (!path) throw new Error("none");
  const r = await fetch(rawUrl(path)); if (!r.ok) throw new Error(r.status); return (CODE[id] = await r.text()); }
let syncing = false;
async function syncGitHub(manual){
  if (!S.gh.repo || syncing) return; syncing = true; S.gh.status = "syncing"; renderSyncLine();
  try {
    const r = await fetch(`https://api.github.com/repos/${S.gh.repo}/git/trees/HEAD?recursive=1`, {headers:{Accept:"application/vnd.github+json"}});
    if (r.status === 404) throw new Error("Repo not found (or private, or still empty)");
    if (r.status === 403 || r.status === 429) throw new Error("GitHub rate limit hit. Try again in a bit");
    if (r.status === 409) { S.gh.status = "ok"; S.gh.lastSync = Date.now(); save(); if (manual) toast("Repo is empty, nothing to sync yet"); return; }
    if (!r.ok) throw new Error("GitHub error " + r.status);
    const data = await r.json(); const best = {};
    (data.tree || []).forEach(e => { if (e.type !== "blob") return; const parts = e.path.split("/"); if (parts.length < 2) return;
      const file = parts[parts.length-1]; if (/^readme|\.md$|^\./i.test(file)) return;
      const folder = parts[parts.length-2]; const m = /submission-(\d+)/.exec(file); const n = m ? +m[1] : 0;
      if (!best[folder] || n >= best[folder].n) best[folder] = {n, path:e.path}; });
    const unmatched = [], newly = [];
    for (const [folder, v] of Object.entries(best)){
      const id = S.gh.map[folder] || NC2ID[folder];
      if (!id || !BY[id]) { unmatched.push(folder); continue; }
      if (S.gh.latest[id] !== v.path) delete CODE[id];
      S.gh.latest[id] = v.path;
      if (!S.solved[id]) newly.push(id);
    }
    S.gh.unmatched = unmatched; S.gh.lastSync = Date.now(); S.gh.status = "ok"; save();
    if (newly.length){
      const cur = S.current && newly.includes(S.current) ? S.current : null;
      const others = newly.filter(id => id !== cur);
      if (cur){ const res = markSolved(cur, "neetcode", false); S.current = null; S.steps = []; S.curElapsed = 0; S.nudged = 0; save();
        confetti(180); sfx.win(); say("solved","Saw your NeetCode submission land on GitHub! 🎉"); showSolvedCard(cur, {xp:res.xp, hitGoal:res.hitGoal, synced:true}); }
      if (others.length <= 3) others.forEach(id => { const res = markSolved(id, "neetcode", false); showSolvedCard(id, {xp:res.xp, hitGoal:res.hitGoal, synced:true}); });
      else { let xp = 0; others.forEach(id => { xp += markSolved(id, "neetcode", false).xp; seedSRS(id, 1); }); save();
        showModal({icon:"📬", title:`${others.length} solves synced from NeetCode`, html:`+${xp} XP. Their memory cards are in the Roadmap (🃏) and they'll show up in reviews.<br><br><span class="hint">${others.slice(0,12).map(id=>esc(BY[id].name)).join(" · ")}${others.length>12?" …":""}</span>`, buttons:[["Nice!","primary",closeModal]]}); }
      checkBadges(); renderAll();
    } else if (manual) toast("🔄 Up to date: no new NeetCode submissions");
  } catch(e){ S.gh.status = "err:" + e.message; save(); if (manual) toast("⚠️ " + esc(e.message)); }
  finally { syncing = false; renderSyncLine(); }
}
function renderSyncLine(){ const el = $("#syncLine"); if (!el) return;
  if (!S.gh.repo){ el.innerHTML = `<span class="dot"></span> NeetCode auto-detect is off · <button class="btn ghost sm" id="syncSet">Set up</button>`; $("#syncSet").onclick = openSettings; return; }
  const st = S.gh.status || "", ago = S.gh.lastSync ? Math.round((Date.now()-S.gh.lastSync)/60000) : null;
  const dot = st.startsWith("err") ? "err" : (st==="ok" ? "ok" : "");
  const msg = st==="syncing" ? "Checking GitHub…" : st.startsWith("err") ? esc(st.slice(4)) : `Submit on NeetCode and it's auto-detected here${ago!==null?` · checked ${ago<1?"just now":ago+" min ago"}`:""}`;
  el.innerHTML = `<span class="dot ${dot}"></span> 🔄 ${msg}${S.gh.unmatched.length?` · <a href="#" id="unm" style="color:var(--amber)">${S.gh.unmatched.length} unmatched</a>`:""} <button class="btn ghost sm" id="syncNow" style="margin-left:auto">Check now</button>`;
  $("#syncNow").onclick = () => syncGitHub(true); const u = $("#unm"); if (u) u.onclick = e => { e.preventDefault(); openSettings(); }; }
$("#roadSync").onclick = () => syncGitHub(true);
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible" && S.gh.repo && S.gh.auto && Date.now() - S.gh.lastSync > 60000) syncGitHub(false); });
setInterval(() => { if (S.current && S.gh.repo && S.gh.auto && document.visibilityState === "visible" && Date.now() - S.gh.lastSync > 150000) syncGitHub(false); }, 30000);

/* ==================== WINS ==================== */
const BADGES = [
  ["first","🩸","First Blood","Solve your first problem", ()=>solvedN()>=1],
  ["ten","🔟","Double Digits","Solve 10 problems", ()=>solvedN()>=10],
  ["fifty","🚀","Halfway-ish","Solve 50 problems", ()=>solvedN()>=50],
  ["all","👑","NeetCode Royalty","Solve all 150", ()=>solvedN()>=150],
  ["hard","🌶️","Spicy","Solve a Hard problem", ()=>solvedIds().some(id=>BY[id].d==="H")],
  ["cat","🗂️","Topic Cleared","Finish a whole topic", ()=>CATS.some(c=>PROBS.filter(p=>p.cat===c).every(p=>S.solved[p.id]))],
  ["s3","🔥","On Fire","3-day streak", ()=>S.best>=3],
  ["s7","☄️","Unstoppable","7-day streak", ()=>S.best>=7],
  ["s30","🌋","Volcano","30-day streak", ()=>S.best>=30],
  ["back5","🦋","Boomerang","Come back from distraction 5 times", ()=>S.refocus>=5],
  ["back25","🧲","Focus Magnet","Come back 25 times", ()=>S.refocus>=25],
  ["tom10","🍅","Tomato Farmer","Finish 10 Pomodoros", ()=>S.tomTotal>=10],
  ["min300","🌊","Flow State","300 total focus minutes", ()=>S.focusMin>=300],
  ["rev10","🧠","Memory Lane","Do 10 reviews", ()=>S.reviews>=10],
  ["rev100","🐘","Elephant Brain","Do 100 reviews", ()=>S.reviews>=100],
  ["note10","📝","Note Taker","Write 10 one-liners", ()=>Object.keys(S.notes).length>=10],
  ["master","🌳","Long-term Memory","Get a card to max memory strength", ()=>Object.values(S.srs).some(r=>r.box>=SRS_DAYS.length-1)],
  ["freeze","🧊","Saved by Ice","Have a streak freeze save you", ()=>S.freezesUsed>=1],
];
function checkBadges(){ BADGES.forEach(([id,ic,nm,desc,test]) => { if (!S.badges.includes(id) && test()){ S.badges.push(id); save(); setTimeout(()=>{ toast(ic+" Badge unlocked: "+nm); sfx.win(); }, 1100); } }); }
function renderWins(){
  $("#stats").innerHTML = [[solvedN(),"problems solved"],[S.streak+" 🔥","current streak"],[S.best,"best streak"],[S.tomTotal+" 🍅","Pomodoros"],[S.focusMin,"focus minutes"],[S.reviews,"reviews done"],[Object.keys(S.notes).length,"one-liners written"],[S.refocus,"times you came back"],[S.xp,"total XP"]].map(([b,s])=>`<div class="stat"><b>${b}</b><span>${s}</span></div>`).join("");
  const cells = [], now = new Date(), start = new Date(now); start.setDate(now.getDate() - 83 - now.getDay());
  for (let i=0;i<84+now.getDay()+1;i++){ const d = new Date(start); d.setDate(start.getDate()+i); const k = dstr(d); const v = (S.log[k]||0) + ((S.revLog[k]||0)>=3?1:0) + (S.tomLog[k]?1:0);
    cells.push(`<i class="${v>=3?'l3':v==2?'l2':v==1?'l1':''}" title="${k}: ${S.log[k]||0} solved, ${S.revLog[k]||0} reviews, ${S.tomLog[k]||0} pomodoros"></i>`); }
  $("#heat").innerHTML = cells.join("");
  $("#badges").innerHTML = BADGES.map(([id,ic,nm,desc])=>`<div class="badge ${S.badges.includes(id)?'got':''}"><div class="bi">${ic}</div><b>${nm}</b><small>${desc}</small></div>`).join("");
  const needBackup = solvedN() > 0 && (!S.lastBackup || Date.now()-S.lastBackup > 7*864e5);
  $("#backupBanner").innerHTML = needBackup ? `<div class="banner">💾 <span style="flex:1">${S.lastBackup?"It's been over a week since your last backup.":"You haven't backed up yet."} Your notes and reviews live only in this browser.</span><button class="btn sm primary" id="bbCopy">Copy backup now</button></div>` : "";
  const bb = $("#bbCopy"); if (bb) bb.onclick = () => $("#copyBackup").click();
}
$("#copyBackup").onclick = async () => { const code = btoa(unescape(encodeURIComponent(JSON.stringify(S)))); $("#backupBox").value = code; S.lastBackup = Date.now(); save(); renderWins();
  try { await navigator.clipboard.writeText(code); toast("📋 Backup copied! Paste it somewhere safe (notes app, email to yourself)"); } catch(e){ $("#backupBox").select(); toast("Select the code and copy it (Ctrl/Cmd+C)"); } };
$("#importBtn").onclick = () => { try { const d = JSON.parse(decodeURIComponent(escape(atob($("#backupBox").value.trim())))); const f = fresh(); S = Object.assign(f, d); S.pomo = Object.assign(f.pomo, d.pomo||{}); S.gh = Object.assign(f.gh, d.gh||{}); S.timer = Object.assign(f.timer, d.timer||{}, {running:false}); save(); renderAll(); toast("✅ Progress restored"); } catch(e){ toast("That backup code didn't work"); } };
$("#resetBtn").onclick = () => showModal({icon:"⚠️", title:"Reset everything?", html:"This wipes all XP, streaks, notes, reviews and solved problems in this browser. Copy a backup first if you might want them back.<br><br><span class='hint'>Note: if your NeetCode GitHub repo still has old submissions, the next sync will mark those as solved again.</span>",
  buttons:[["Yes, reset","",()=>{ const repo = S.gh.repo; S = fresh(); S.gh.repo = repo; S.gh.lastSync = Date.now(); save(); closeModal(); clearInterval(tId); renderAll(); toast("Fresh start 🌱"); }],["Cancel","primary",closeModal]]});

/* ==================== SETTINGS ==================== */
function openSettings(){
  const P = S.pomo;
  const unm = S.gh.unmatched.map(f => `<div class="setrow"><code style="font-size:12px">${esc(f)}</code><select data-f="${esc(f)}"><option value="">— ignore —</option>${PROBS.map(p=>`<option value="${p.id}">${esc(p.name)}</option>`).join("")}</select></div>`).join("");
  showModal({ title:"⚙️ Settings", wide:true, html:`<div style="text-align:left">
    <div class="setrow"><span>Daily goal (problems)</span><input type="number" id="setGoal" min="1" max="10" value="${S.goal}"></div>
    <h3 style="font-size:13px;color:var(--muted);text-transform:uppercase;letter-spacing:.08em;margin:18px 0 10px">🍅 Pomodoro</h3>
    <div class="setrow"><span>Focus length (min)</span><input type="number" id="setWork" min="5" max="90" value="${P.work}"></div>
    <div class="setrow"><span>Short break (min)</span><input type="number" id="setShort" min="1" max="30" value="${P.short}"></div>
    <div class="setrow"><span>Long break (min)</span><input type="number" id="setLong" min="5" max="60" value="${P.long}"></div>
    <div class="setrow"><span>Long break after every … Pomodoros</span><input type="number" id="setEvery" min="2" max="8" value="${P.every}"></div>
    <div class="setrow"><span>Start breaks automatically</span><input type="checkbox" id="setAuto" ${P.auto?"checked":""}></div>
    <h3 style="font-size:13px;color:var(--muted);text-transform:uppercase;letter-spacing:.08em;margin:18px 0 10px">🎧 Comfort</h3>
    <div class="setrow"><span>Focus noise volume</span><input type="range" id="setVol" min="0.05" max="1" step="0.05" value="${S.noiseVol}"></div>
    <div class="setrow"><span>Reduce motion (no confetti/animations)</span><input type="checkbox" id="setReduce" ${S.reduce?"checked":""}></div>
    <h3 style="font-size:13px;color:var(--muted);text-transform:uppercase;letter-spacing:.08em;margin:18px 0 10px">🔄 NeetCode → GitHub auto-detect</h3>
    <div class="hint" style="margin:0 0 10px">The public repo NeetCode's GitHub Sync pushes to. When a new submission appears, the problem is marked solved and its memory card pops up. Leave empty to turn it off.</div>
    <div class="setrow"><input class="field" id="setRepo" value="${esc(S.gh.repo)}" placeholder="username/neetcode-submissions"></div>
    <div class="setrow"><span>Check automatically (when you switch back to this tab)</span><input type="checkbox" id="setGhAuto" ${S.gh.auto?"checked":""}></div>
    ${unm ? `<div class="hint" style="margin:6px 0 8px">These repo folders didn't match a problem automatically. Pick the right one:</div>${unm}` : ""}
  </div>`,
  onOpen: () => { $("#setVol").oninput = e => { S.noiseVol = +e.target.value; if (noise.gain) noise.gain.gain.value = S.noiseVol; }; },
  buttons:[["Save","primary",()=>{
    const num = (id, lo, hi, d) => { const v = parseInt($(id).value,10); return isNaN(v) ? d : Math.min(hi, Math.max(lo, v)); };
    S.goal = num("#setGoal",1,10,2);
    S.pomo = {work:num("#setWork",5,90,25), short:num("#setShort",1,30,5), long:num("#setLong",5,60,15), every:num("#setEvery",2,8,4), auto:$("#setAuto").checked};
    S.reduce = $("#setReduce").checked;
    const repo = $("#setRepo").value.trim().replace(/^https?:\/\/github\.com\//,"").replace(/\/$/,"");
    const repoChanged = repo !== S.gh.repo; S.gh.repo = repo; S.gh.auto = $("#setGhAuto").checked;
    if (repoChanged){ S.gh.latest = {}; S.gh.unmatched = []; S.gh.status = ""; }
    $$("#modalBody select[data-f]").forEach(s => { if (s.value) S.gh.map[s.dataset.f] = s.value; });
    if (!S.timer.running && S.timer.phase === "work" && S.timer.left === S.timer.total) setTimer(S.pomo.work);
    save(); closeModal(); renderAll(); toast("Saved");
    if (S.gh.repo && (repoChanged || $$("#modalBody select[data-f]").length)) syncGitHub(true);
  }],["Cancel","ghost",closeModal]] });
}
$("#settingsBtn").onclick = openSettings;
$("#soundBtn").onclick = () => { S.sound = !S.sound; save(); renderTop(); if (S.sound) sfx.xp(); };
$("#noiseBtn").onclick = () => { const order = ["off","brown","pink","white"]; const nxt = order[(order.indexOf(noise.type)+1) % order.length]; setNoise(nxt); if (nxt!=="off") toast(`🌊 ${nxt[0].toUpperCase()+nxt.slice(1)} noise on. Tap again to switch or turn it off`); };

/* ==================== NAV + KEYS ==================== */
function switchView(v){ $$(".tab").forEach(t=>t.classList.toggle("on", t.dataset.view===v)); $$(".view").forEach(s=>s.classList.toggle("on", s.id==="view-"+v));
  if (v==="road") renderRoad(); if (v==="wins") renderWins(); if (v==="review") renderReview(); }
$$(".tab").forEach(t => t.onclick = () => switchView(t.dataset.view));
$("#zenExit").onclick = () => document.body.classList.remove("zen");
document.addEventListener("keydown", e => {
  if (e.key === "Escape"){ if ($("#modal").classList.contains("on")) dismissModal(); else document.body.classList.remove("zen"); return; }
  if (/INPUT|TEXTAREA|SELECT/.test(e.target.tagName) || $("#modal").classList.contains("on") || e.metaKey || e.ctrlKey || e.altKey) return;
  const k = e.key.toLowerCase();
  if (R && $("#view-review").classList.contains("on")){
    const it = R.items[R.i];
    if (k === "f") { flipCard(); return; }
    if (/^[1-4]$/.test(k)){ if (it.type==="flip") { if (+k<=3) gradeItem(+k-1); } else if (it.state==="ask" && +k <= it.opts.length) answerMC(+k-1); return; }
    if (k === "enter" && it.type!=="flip" && it.state!=="ask"){ nextItem(); return; }
  }
  if (e.code === "Space" && !(e.target.tagName==="BUTTON")){ e.preventDefault(); toggleTimer(); }
  else if (k === "d") drifted();
  else if (k === "b"){ e.preventDefault(); document.body.classList.remove("zen"); switchView("focus"); $("#dumpIn").focus(); }
});

/* ==================== INIT ==================== */
function renderAll(){ renderTop(); renderNow(); renderDump(); renderQuest(); renderReviewSide(); drawTimer();
  if ($("#view-road").classList.contains("on")) renderRoad(); if ($("#view-wins").classList.contains("on")) renderWins(); if ($("#view-review").classList.contains("on")) renderReview(); }
checkStreakOnLoad(); ensureQuest();
// restore a timer that was running before a reload
if (S.timer.running){ if (S.timer.end > Date.now()){ S.timer.running = false; S.timer.left = Math.round((S.timer.end-Date.now())/1000); renderAll(); startTimer(); } else { renderAll(); setTimeout(()=>timerDone(true), 400); } }
else renderAll();
if (S.current) say("working","Welcome back! You were on "+BY[S.current].name+". Pick up where you left off.");
else if ((S.log[today()]||0) >= S.goal) say("idle","You already hit today's goal. Anything more is a bonus. 🌟");
else if (dueIds().length) say("review", `${dueIds().length} memory card${dueIds().length>1?"s":""} due. A quick review is an easy way to start.`);
if (S.gh.repo && S.gh.auto) setTimeout(()=>syncGitHub(false), 1200);
