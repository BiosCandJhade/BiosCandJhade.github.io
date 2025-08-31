const DEFAULT_KEY = 'cv_profile_v1';

const defaultProfileJSON = document.getElementById('defaultProfile').textContent.trim();
let profile = loadProfile();

/* ------------------ Utils ------------------ */
function safeParse(json) {
  try { return JSON.parse(json); } catch(e){ return null; }
}
function saveToLocal(p) {
  localStorage.setItem(DEFAULT_KEY, JSON.stringify(p, null, 2));
}
function loadProfile() {
  const stored = localStorage.getItem(DEFAULT_KEY);
  if (stored) {
    const p = safeParse(stored);
    if (p) return p;
  }
  const def = safeParse(defaultProfileJSON);
  saveToLocal(def);
  return def;
}
function downloadBlob(filename, content) {
  const blob = new Blob([content], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; document.body.appendChild(a); a.click();
  setTimeout(()=>{ URL.revokeObjectURL(url); a.remove(); }, 3000);
}

/* ------------------ Rendering ------------------ */
function renderAll() {
  renderHeader();
  renderHero();
  renderProfile();
  renderCV();
  renderSkills();
  renderProjects();
  renderPublications();
  renderFooter();
}
function renderHeader(){
  const name = profile.personal.name || '';
  const title = profile.personal.title || '';
  document.getElementById('navName').textContent = name;
  document.getElementById('navRoles').textContent = title;
}
function renderHero(){
  document.getElementById('heroName').textContent = profile.personal.name || '';
  document.getElementById('heroRole').textContent = profile.personal.title || '';
  document.getElementById('heroShort').textContent = profile.personal.summary_short || '';
  const avatar = document.getElementById('avatarImg');
  avatar.src = profile.personal.avatar || 'assets/GOLDENCHILD.png';
  avatar.alt = `${profile.personal.name} — avatar`;
  // chips
  const chips = document.getElementById('heroChips');
  chips.innerHTML = '';
  const items = [
    {k:'email', v: profile.personal.email},
    {k:'phone', v: profile.personal.phone},
    {k:'location', v: profile.personal.location},
    {k:'availability', v: profile.personal.availability}
  ];
  items.forEach(it => {
    if (it.v) {
      const el = document.createElement('span');
      el.className = 'chip';
      el.textContent = `${it.k.toUpperCase()}: ${it.v}`;
      chips.appendChild(el);
    }
  });
}
function renderProfile(){
  document.getElementById('summaryLong').textContent = profile.personal.summary_long || '';
  // key data
  const keyData = document.getElementById('keyData');
  keyData.innerHTML = '';
  const keys = [
    ['Ubicación', profile.personal.location],
    ['Disponibilidad', profile.personal.availability],
    ['Relocalización', profile.personal.relocation],
    ['Expectativa salarial', profile.personal.salary_expectation]
  ];
  keys.forEach(([label, val])=>{
    const li = document.createElement('li');
    li.innerHTML = `<strong>${label}:</strong> ${val || '-'}`;
    keyData.appendChild(li);
  });
  // links
  const links = document.getElementById('linksList');
  links.innerHTML = '';
  const linkFields = ['website','linkedin','github','email','phone'];
  linkFields.forEach(f=>{
    if (profile.personal[f]) {
      const li = document.createElement('li');
      const v = profile.personal[f];
      if (f === 'email') {
        li.innerHTML = `<a href="mailto:${v}">${v}</a>`;
      } else if (f === 'phone') {
        li.innerHTML = `<a href="tel:${v}">${v}</a>`;
      } else {
        li.innerHTML = `<a href="${v}" target="_blank" rel="noreferrer noopener">${v}</a>`;
      }
      links.appendChild(li);
    }
  });
}
function renderCV(){
  // education
  const ed = document.getElementById('educationList');
  ed.innerHTML = '';
  (profile.education || []).forEach(e=>{
    const d = document.createElement('div');
    d.className = 'entry';
    d.innerHTML = `<strong>${e.institution}</strong> — ${e.degree} <span style="float:right">${e.start || ''} - ${e.end || ''}</span>
      <div style="color:var(--muted);margin-top:6px">${e.description || ''}</div>`;
    ed.appendChild(d);
  });

  // experience
  const xp = document.getElementById('experienceList');
  xp.innerHTML = '';
  (profile.experience || []).forEach(e=>{
    const d = document.createElement('div');
    d.className = 'entry';
    d.innerHTML = `<strong>${e.role}</strong> — ${e.company} <span style="float:right">${e.start || ''} - ${e.end || ''}</span>
      <div style="color:var(--muted);margin-top:6px">${e.description || ''}</div>
      <ul>${(e.achievements || []).map(a=>`<li>${a}</li>`).join('')}</ul>`;
    xp.appendChild(d);
  });
  if ((profile.experience || []).length === 0) xp.textContent = 'No hay experiencias registradas.';

  // certifications
  const cert = document.getElementById('certificationsList');
  cert.innerHTML = '';
  (profile.certifications || []).forEach(c=>{
    const d = document.createElement('div');
    d.className='entry';
    d.innerHTML = `<strong>${c.name}</strong> — ${c.issuer} <span style="float:right">${c.date || ''}</span>
      ${c.link ? `<div><a href="${c.link}" target="_blank">${c.link}</a></div>` : ''}`;
    cert.appendChild(d);
  });
  if ((profile.certifications || []).length === 0) cert.textContent = 'No hay certificaciones registradas.';

  // languages
  const langs = document.getElementById('languagesList');
  langs.innerHTML = '';
  (profile.languages || []).forEach(l=>{
    const d = document.createElement('div');
    d.className='entry';
    d.innerHTML = `<strong>${l.lang}</strong> — ${l.level}`;
    langs.appendChild(d);
  });

  // volunteering
  const vol = document.getElementById('volunteeringList');
  vol.innerHTML = (profile.volunteering && profile.volunteering.length>0) ? '' : 'No hay voluntariado registrado.';
  (profile.volunteering || []).forEach(v=>{
    const d = document.createElement('div');
    d.className='entry';
    d.innerHTML = `<strong>${v.role}</strong> — ${v.org} <div style="color:var(--muted)">${v.description || ''}</div>`;
    vol.appendChild(d);
  });

  // publications
  const pubs = document.getElementById('publicationsList');
  pubs.innerHTML = (profile.publications && profile.publications.length>0) ? '' : 'No hay publicaciones registradas.';
  (profile.publications || []).forEach(p=>{
    const d = document.createElement('div');
    d.className='entry';
    d.innerHTML = `<strong>${p.title}</strong> — ${p.venue || ''} <div style="color:var(--muted)">${p.date || ''}</div>
      ${p.link ? `<div><a href="${p.link}" target="_blank">${p.link}</a></div>` : ''}`;
    pubs.appendChild(d);
  });

  // references
  const refs = document.getElementById('referencesList');
  refs.innerHTML = '';
  (profile.references || []).forEach(r=>{
    const d = document.createElement('div');
    d.className = 'entry';
    d.innerHTML = `<strong>${r.name}</strong> — ${r.role} ${r.contact ? `<button class="btn ghost small show-ref" data-contact="${r.contact}">Mostrar contacto</button>` : ''}`;
    refs.appendChild(d);
  });
  if ((profile.references || []).length === 0) refs.textContent = 'No hay referencias registradas.';

  // interests
  const iList = document.getElementById('interestsList');
  iList.innerHTML = '';
  if (profile.extras && Array.isArray(profile.extras.hobbies) && profile.extras.hobbies.length) {
    profile.extras.hobbies.forEach(h => {
      const d = document.createElement('div'); d.className='entry'; d.textContent = h; iList.appendChild(d);
    });
  } else {
    iList.textContent = 'No hay intereses registrados.';
  }

  // availability
  document.getElementById('availability').textContent = profile.personal.availability || '-';
}

/* ------------------ Skills ------------------ */
function renderSkills(){
  const grid = document.getElementById('skillsGrid');
  grid.innerHTML = '';
  (profile.skills || []).forEach((s, idx)=>{
    const level = Number(s.level) || 0;
    const card = document.createElement('div');
    card.className = 'skill-card';
    card.dataset.idx = idx;
    card.innerHTML = `
      <div class="skill-name"><strong>${s.tech}</strong><span>${level}%</span></div>
      <div class="skill-meta">${s.category || ''} · ${s.notes || ''}</div>
      <div class="progress" aria-hidden="true"><i style="width:${Math.min(100,level)}%"></i></div>
    `;
    card.addEventListener('click',()=> openSkillModal(s));
    grid.appendChild(card);
  });
}

/* ------------------ Projects & Publications ------------------ */
function renderProjects(){
  const grid = document.getElementById('projectsGrid');
  grid.innerHTML = '';
  if (!profile.projects || profile.projects.length === 0) {
    grid.textContent = 'No hay proyectos registrados.';
    return;
  }
  profile.projects.forEach(p=>{
    const d = document.createElement('div'); d.className='project-card';
    d.innerHTML = `<strong>${p.title}</strong><div style="color:var(--muted)">${p.description || ''}</div>
      ${p.techs ? `<div style="margin-top:8px">${p.techs.map(t=>`<span class="chip">${t}</span>`).join(' ')}</div>` : ''}
      ${p.link ? `<div style="margin-top:8px"><a href="${p.link}" target="_blank">${p.link}</a></div>` : ''}`;
    grid.appendChild(d);
  });
}
function renderPublications(){
  const node = document.getElementById('pubsGrid');
  node.innerHTML = '';
  if (!profile.publications || profile.publications.length === 0) {
    node.textContent = 'No hay publicaciones registradas.';
    return;
  }
  profile.publications.forEach(p=>{
    const d = document.createElement('div'); d.className='project-card';
    d.innerHTML = `<strong>${p.title}</strong><div style="color:var(--muted)">${p.venue || ''} · ${p.date || ''}</div>
      ${p.link ? `<a href="${p.link}" target="_blank">${p.link}</a>` : ''}`;
    node.appendChild(d);
  });
}
function renderFooter(){
  document.getElementById('footerName').textContent = profile.personal.name || '';
  const sl = document.getElementById('socialLinks');
  sl.innerHTML = '';
  const socialFields = ['github','linkedin','website','email'];
  socialFields.forEach(f=>{
    if (profile.personal[f]) {
      const li = document.createElement('li');
      const v = profile.personal[f];
      li.innerHTML = `<a href="${f.startsWith('http')?v:`${v}`}">${v}</a>`;
      sl.appendChild(li);
    }
  });
}

/* ------------------ Skill modal & snippet generation ------------------ */
const skillModal = document.getElementById('skillModal');
const skillTitle = document.getElementById('skillTitle');
const skillNotes = document.getElementById('skillNotes');
const skillSnippet = document.getElementById('skillSnippet');
const copySnippetBtn = document.getElementById('copySnippet');
document.getElementById('closeSkillModal').addEventListener('click', () => skillModal.close());
document.getElementById('closeSnippet').addEventListener('click', () => skillModal.close());

function openSkillModal(skill) {
  skillTitle.textContent = skill.tech + ' · ' + (skill.category||'');
  skillNotes.textContent = skill.notes || '';
  const code = getSnippetForHint(skill.snippet_hint || skill.tech, Number(skill.level));
  skillSnippet.textContent = code;
  skillModal.showModal();
}

copySnippetBtn.addEventListener('click', ()=> {
  const text = skillSnippet.textContent;
  navigator.clipboard?.writeText(text).then(()=>{
    copySnippetBtn.textContent = 'Copiado ✓';
    setTimeout(()=> copySnippetBtn.textContent = 'Copiar snippet', 1600);
  }).catch(()=> {
    copySnippetBtn.textContent = 'Error';
  });
});

/* Snippet generator:
   Simple but contextual short snippets per hint. Keep them as small, useful examples.
*/
function getSnippetForHint(hint, level=40) {
  // level: <40 básico, 40-70 intermedio, >70 avanzado
  const tier = level > 70 ? 'advanced' : (level >= 40 ? 'intermediate' : 'basic');
  const map = {
    python_fstring: {
      basic: `# Python: f-strings básicos\nname = "Cristopher"\nage = 21\nprint(f"Hola, soy {name} y tengo {age} años")`,
      intermediate: `# Python: requests sencillo (API)\nimport requests\nr = requests.get("https://api.example.com/data")\nif r.ok:\n  data = r.json()\n  print(data)\n`,
      advanced: `# Python: ejemplo simple de ML (scikit-learn)\nfrom sklearn.linear_model import LinearRegression\nmodel = LinearRegression()\nX = [[1],[2],[3]]\ny = [2,4,6]\nmodel.fit(X,y)\nprint(model.coef_)`
    },
    lua_table_iteration: {
      basic: `-- Lua: tablas e iteración\nlocal t = {a=1, b=2, c=3}\nfor k,v in pairs(t) do\n  print(k, v)\nend`,
      intermediate: `-- Love2D: callback básico\nfunction love.load()\n  img = love.graphics.newImage('sprite.png')\nend\nfunction love.draw()\n  love.graphics.draw(img, 100, 100)\nend`,
      advanced: `-- Lua: metatable simple\nlocal mt = {__index = function() return 'missing' end}\nlocal t = setmetatable({}, mt)\nprint(t.x) -- 'missing'`
    },
    java_class_demo: {
      basic: `// Java: clase simple\npublic class Hola {\n  public static void main(String[] args){\n    System.out.println("Hola, mundo");\n  }\n}`,
      intermediate: `// Java: POJO\npublic class User { private String name; public String getName(){return name;} }\n`,
      advanced: `// Java: ejemplo breve con Streams\nimport java.util.*;\nList<Integer> nums = Arrays.asList(1,2,3,4);\nnums.stream().map(n->n*2).forEach(System.out::println);`
    },
    html_structure: {
      basic: `<!-- HTML: estructura básica -->\n<header><h1>Nombre</h1></header>\n<main></main>\n<footer></footer>`,
      intermediate: `<!-- HTML: tarjeta de proyecto -->\n<article class="project"><h3>Título</h3><p>Descripción</p></article>`,
      advanced: `<!-- HTML: template con atributos ARIA -->\n<main role="main" aria-labelledby="main-title"><h1 id="main-title">CV</h1></main>`
    },
    css_styles: {
      basic: `/* CSS: reseteo simple */\n*{box-sizing:border-box}\nbody{font-family:system-ui, sans-serif}`,
      intermediate: `/* CSS: grid */\n.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}`,
      advanced: `/* CSS: glassmorphism */\n.card{backdrop-filter: blur(6px);background:rgba(255,255,255,0.03)}`
    },
    sql_prepared_insert: {
      basic: `-- SQL: INSERT (ejemplo)\nINSERT INTO users (name,email) VALUES ('Cristopher','c@ejemplo')`,
      intermediate: `-- SQL (prepared)\nPREPARE st FROM 'INSERT INTO users (name,email) VALUES (?,?)';\nEXECUTE st USING @name,@email;`,
      advanced: `-- SQL: transacción\nBEGIN TRANSACTION;\nINSERT INTO accounts ...;\nCOMMIT;`
    },
    sqlite_example: {
      basic: `-- SQLite: crear tabla\nCREATE TABLE notes(id INTEGER PRIMARY KEY, text TEXT);`,
      intermediate: `-- SQLite: conexión python\nimport sqlite3\nc=sqlite3.connect('db.sqlite')\n# ...`,
      advanced: `-- SQLite: indices y PRAGMA\nCREATE INDEX idx_text ON notes(text);\nPRAGMA journal_mode=WAL;`
    },
    mongodb_example: {
      basic: `// Mongo: insertar\ndb.users.insertOne({name: "Cristopher", role:"student"})`,
      intermediate: `// Mongo: find\nconst docs = db.users.find({role:"student"}).toArray()`,
      advanced: `// Mongo: agregación\ndb.collection.aggregate([{ $match: {} },{ $group: {_id:"$role", count:{$sum:1}} }])`
    },
    cassandra_example: {
      basic: `-- Cassandra CQL: crear tabla\nCREATE TABLE users (id uuid PRIMARY KEY, name text);`,
      intermediate: `-- CQL: insertar\nINSERT INTO users (id,name) VALUES (uuid(), 'Cristopher');`,
      advanced: `-- Data modelling: evita JOINs, usa denormalización`
    },
    dynamodb_example: {
      basic: `// DynamoDB: putItem (AWS CLI)\naws dynamodb put-item --table-name MyTable --item '{\"id\": {\"S\": \"1\"}}'`,
      intermediate: `// SDK (JS)\nconst AWS = require('aws-sdk'); const ddb = new AWS.DynamoDB.DocumentClient();`,
      advanced: `// Diseño: elegir PK+SK para patrones de acceso`
    },
    redis_example: {
      basic: `# Redis: SET/GET\nSET key "value"\nGET key`,
      intermediate: `# Redis: listas\nLPUSH mylist "a"\nLRANGE mylist 0 -1`,
      advanced: `# Redis: pub/sub\nPUBLISH channel "msg"\nSUBSCRIBE channel`
    },
    couchbase_example: {
      basic: `// Couchbase SDK: insertar\nbucket.upsert('user::1', {name: 'Cristopher'})`,
      intermediate: `// N1QL: SELECT * FROM \`bucket\` WHERE ...`,
      advanced: `// Indexación y subdocument APIs`
    },
    typescript_example: {
      basic: `// TS: tipos simples\nfunction add(a: number, b: number): number { return a + b }`,
      intermediate: `// TS: interfaz\ninterface User { name: string; age?: number }`,
      advanced: `// TS: generics\nfunction wrap<T>(v: T): { value: T } { return {value: v} }`
    },
    assembly_example: {
      basic: `; x86 NASM: hello\nsection .data\n msg db 'hi',0\n`,
      intermediate: `; mostrar syscall básico en Linux (x86-64)`,
      advanced: `; optimización a nivel de registro (ejemplo compacto)`
    },
    c_cpp_example: {
      basic: `// C: hello\n#include <stdio.h>\nint main(){ printf("Hola\\n"); return 0; }`,
      intermediate: `// C++: vector\n#include <vector>\nstd::vector<int> v{1,2,3};`,
      advanced: `// C++: RAII + smart pointers\n#include <memory>`
    },
    csharp_example: {
      basic: `// C#: clase simple\nclass Program { static void Main(){ System.Console.WriteLine("Hola"); } }`,
      intermediate: `// C#: async ejemplo\nasync Task Run() { await Task.Delay(100); }`,
      advanced: `// C#: LINQ ejemplo\nvar evens = nums.Where(n => n%2==0);`
    },
    julia_example: {
      basic: `# Julia: operación\nx = [1,2,3]\nsum(x)`,
      intermediate: `# Julia: funciones\nf(x) = x^2\nmap(f, [1,2,3])`,
      advanced: `# Julia: type & multiple dispatch`
    },
    love2d_example: {
      basic: `-- main.lua\nfunction love.draw()\n  love.graphics.print('Hello Love2D', 100, 100)\nend`,
      intermediate: `-- cargar imagen\ngfx = love.graphics.newImage('img.png')\nfunction love.draw() love.graphics.draw(gfx, 50,50) end`,
      advanced: `-- pixel manipulation con ImageData (esquema breve)`
    },
    kotlin_example: {
      basic: `// Kotlin: función\nfun main(){ println("Hola") }`,
      intermediate: `// Kotlin: data class\ndata class User(val name:String)`,
      advanced: `// Kotlin: coroutines básico`
    },
    matlab_example: {
      basic: `% MATLAB: vector\nx = [1 2 3];\nsum(x)`,
      intermediate: `% plot\nplot(x,y)`,
      advanced: `% matrices y resolución de sistemas`
    },
    excel_formula: {
      basic: `# Excel: sumar\n=SUM(A1:A10)`,
      intermediate: `# Excel: BUSCARV\n=VLOOKUP(key, table, 2, FALSE)`,
      advanced: `# Excel: tablas dinámicas / Power Query (nota)`
    },
    r_example: {
      basic: `# R: vectores\nx <- c(1,2,3)\nmean(x)`,
      intermediate: `# R: dplyr\nlibrary(dplyr)\ndf %>% filter(x>0)`,
      advanced: `# R: modelado`
    },
    rust_example: {
      basic: `// Rust: hello\nfn main(){ println!("Hola"); }`,
      intermediate: `// Rust: vector\nlet v = vec![1,2,3];`,
      advanced: `// Rust: ownership example breve`
    },
    word_demo: {
      basic: `// Word: plantillas — usar estilos para encabezados y cuerpo (nota)`,
      intermediate: `// Word: combinar correspondencia (nota)`,
      advanced: `// Word: macros VBA (nota)`
    },
    powerpoint_demo: {
      basic: `// PowerPoint: estructura de diapositiva recomendada (nota)`,
      intermediate: `// PowerPoint: animaciones moderadas (nota)`,
      advanced: `// PowerPoint: exportar PDF alta calidad (nota)`
    },
    prompt_engineering: {
      basic: `# Prompt básico: Describe brevemente un algoritmo.`,
      intermediate: `# Prompt: instrucción con ejemplos\ndefine task: \\n- input: ... \\n- expected output: ...`,
      advanced: `# Prompt: few-shot + constraints + output JSON schema`
    },
    php_example: {
      basic: `<?php echo "Hola"; ?>`,
      intermediate: `// PDO prepared\n$pdo->prepare("INSERT INTO ...");`,
      advanced: `// PSR-12, composer, namespaces (nota)`
    },
    docker_example: {
      basic: `# Dockerfile básico\nFROM node:18\nCMD [ "node", "app.js" ]`,
      intermediate: `# docker-compose.yml ejemplo (servicio + db)`,
      advanced: `# Optimización de imágenes multistage (nota)`
    },
    visualbasic_example: {
      basic: `' VB: Hello\nMsgBox "Hola"`,
      intermediate: ` ' Manipulación de Excel VBA (nota)`,
      advanced: ` ' Automatización y macros avanzadas`
    },
    flask_example: {
      basic: `# Flask: app mínimo\nfrom flask import Flask\napp=Flask(__name__)\n@app.route('/')\ndef index():\n  return 'Hola'`,
      intermediate: `# Flask: blueprint y config (nota)`,
      advanced: `# Flask: despliegue con gunicorn + config`
    },
    django_example: {
      basic: `# Django: crear proyecto\ndjango-admin startproject mysite`,
      intermediate: `# Django: model y admin (nota)`,
      advanced: `# Django: señales y middlewares (nota)`
    },
    ai_tools: {
      basic: `# Uso básico: pedir una explicación concisa a un modelo LLM`,
      intermediate: `# Uso: chain-of-thought control, few-shot examples`,
      advanced: `# Pipeline: embeddings -> retriever -> RAG`
    },
    angular_example: {
      basic: `// Angular: componente simple\n@Component({ selector:'app', template:'<h1>Hola</h1>' })`,
      intermediate: `// Angular: servicio + HttpClient (nota)`,
      advanced: `// Angular: lazy-loading y optimización (nota)`
    },
    react_example: {
      basic: `// React: componente funcional\nfunction App(){ return <h1>Hola</h1> }`,
      intermediate: `// React: hooks useState/useEffect (nota)`,
      advanced: `// React: performance tuning (memo, useCallback)`
    },
    git_example: {
      basic: `# Git: commits\ngit add .\ngit commit -m "feat: inicio"`,
      intermediate: `# Git: branch workflow\ngit checkout -b feature/x\ngit rebase main`,
      advanced: `# Git: hooks, CI integration`
    },
    linux_example: {
      basic: `# Linux: navegación\nls -la\ncd /ruta`,
      intermediate: `# Linux: permisos chmod/chown (nota)`,
      advanced: `# Linux: systemd unit file (nota)`
    },
    cloudflare_example: {
      basic: `# Cloudflare: configurar DNS (nota)`,
      intermediate: `# Cloudflare Workers: hello example`,
      advanced: `# Cloudflare: edge caching strategies`
    },
    aws_example: {
      basic: `# AWS: CLI listar S3\naws s3 ls`,
      intermediate: `# AWS: CloudFormation / CDK (nota)`,
      advanced: `# AWS: diseño de arquitectura de alta disponibilidad`
    }
  };

  // fallback
  if (!map[hint]) {
    return `// Ejemplo: ${hint}\n// Nivel: ${tier}\n// Añade aquí un snippet representativo para ${hint}.`;
  }
  const group = map[hint];
  if (!group) return '';
  if (tier === 'advanced') return group.advanced || group.intermediate || group.basic;
  if (tier === 'intermediate') return group.intermediate || group.basic;
  return group.basic;
}

/* ------------------ Editor, import/export, print ------------------ */
const editorModal = document.getElementById('editorModal');
document.getElementById('openEditor').addEventListener('click', ()=> openEditor());
document.getElementById('openEditorFooter').addEventListener('click', ()=> openEditor());
document.getElementById('editProfileBtn').addEventListener('click', ()=> openEditor());
document.getElementById('closeEditor').addEventListener('click', ()=> editorModal.close());
document.getElementById('cancelEdit').addEventListener('click', ()=> editorModal.close());

function openEditor(){
  const ta = document.getElementById('profileEditor');
  ta.value = JSON.stringify(profile, null, 2);
  editorModal.showModal();
}
document.getElementById('saveProfile').addEventListener('click', ()=> {
  const ta = document.getElementById('profileEditor');
  const parsed = safeParse(ta.value);
  if (!parsed) {
    alert('JSON inválido. Revisa la sintaxis.');
    return;
  }
  profile = parsed;
  saveToLocal(profile);
  renderAll();
  editorModal.close();
});

document.getElementById('downloadJson').addEventListener('click', ()=> {
  downloadBlob('profile.json', JSON.stringify(profile, null, 2));
});

// import json file
document.getElementById('importJson').addEventListener('change', (e)=>{
  const f = e.target.files[0];
  if (!f) return;
  const reader = new FileReader();
  reader.onload = (ev)=>{
    const parsed = safeParse(ev.target.result);
    if (!parsed) { alert('JSON inválido.'); return; }
    profile = parsed;
    saveToLocal(profile);
    renderAll();
    alert('Perfil importado y guardado en localStorage.');
  };
  reader.readAsText(f);
  e.target.value = '';
});

// export JSON button
document.getElementById('exportJson').addEventListener('click', ()=> {
  downloadBlob('profile_export.json', JSON.stringify(profile, null, 2));
});

// restore default
document.getElementById('restoreDefault').addEventListener('click', ()=> {
  if (!confirm('Restaurar valores por defecto — se sobreescribirá el perfil actual localmente. ¿Continuar?')) return;
  const def = safeParse(defaultProfileJSON);
  profile = def;
  saveToLocal(profile);
  renderAll();
});

// print/export PDF
function preparePrint() {
  // we use window.print(); CSS @media print optimiza
  window.print();
}
document.getElementById('downloadPdf').addEventListener('click', preparePrint);
document.getElementById('printCvBtn').addEventListener('click', preparePrint);
document.getElementById('exportPdfBtn').addEventListener('click', preparePrint);

// contact form simple validation
document.getElementById('contactForm').addEventListener('submit', (e)=>{
  e.preventDefault();
  const name = document.getElementById('cname').value.trim();
  const email = document.getElementById('cemail').value.trim();
  const msg = document.getElementById('cmessage').value.trim();
  if (!name || !email || !msg) {
    alert('Por favor complete todos los campos.');
    return;
  }
  alert('Mensaje simulado enviado. (Implementa envío real en backend cuando esté listo.)');
  document.getElementById('contactForm').reset();
});

/* ------------------ Init ------------------ */
renderAll();

