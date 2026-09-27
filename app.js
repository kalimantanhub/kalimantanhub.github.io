const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

const dictionary = [
  ["Acil", "cepat / segera", "Banjar"],
  ["Bahari", "cantik / indah", "Banjar"],
  ["Bujur", "benar / betul", "Banjar"],
  ["Gasan", "untuk / karena", "Banjar"],
  ["Kada", "tidak", "Banjar"],
  ["Kaina", "nanti", "Banjar"],
  ["Handak", "ingin / mau", "Banjar"],
  ["Pian", "kamu / Anda", "Banjar"],
  ["Ulun", "saya", "Banjar"],
  ["Hanyar", "baru", "Banjar"],
  ["Lawas", "lama", "Banjar"],
  ["Kawa", "bisa", "Banjar"],
  ["Hanyar haja", "baru saja", "Banjar"],
  ["Nang", "yang", "Banjar"],
  ["Kada papa", "tidak apa-apa", "Banjar"],
  ["Uma", "ibu", "Banjar"]
];

function renderDictionary(filter="") {
  const q = filter.toLowerCase().trim();
  const list = dictionary.filter(x => x.join(" ").toLowerCase().includes(q));
  $("#dictionaryGrid").innerHTML = list.map(x => `
    <div class="dict-card"><b>${escapeHTML(x[0])}</b><p>${escapeHTML(x[1])}</p><small>${x[2]}</small></div>
  `).join("") || `<div class="empty">Kata tidak ditemukan.</div>`;
}
renderDictionary();
$("#dictSearch").addEventListener("input", e => renderDictionary(e.target.value));

$$(".categories button").forEach(btn => btn.addEventListener("click", () => {
  $$(".categories button").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  filterTools();
}));

$("#searchInput").addEventListener("input", filterTools);

function filterTools(){
  const q = $("#searchInput").value.toLowerCase().trim();
  const cat = $(".categories button.active").dataset.cat;
  let shown = 0;
  $$(".tool-card").forEach(card => {
    const okCat = cat === "all" || card.dataset.category === cat;
    const okText = !q || card.dataset.search.includes(q) || card.innerText.toLowerCase().includes(q);
    const show = okCat && okText;
    card.classList.toggle("hidden", !show);
    if(show) shown++;
  });
  $("#emptyState").classList.toggle("hidden", shown !== 0);
}

const modal = $("#modal");
function openModal(html){ $("#modalContent").innerHTML=html; modal.classList.remove("hidden"); document.body.style.overflow="hidden"; }
function closeModal(){ modal.classList.add("hidden"); document.body.style.overflow=""; }
$("#closeModal").addEventListener("click", closeModal);
$(".modal-backdrop").addEventListener("click", closeModal);
document.addEventListener("keydown", e => { if(e.key==="Escape") closeModal(); });

$$(".open-tool").forEach(btn => btn.addEventListener("click", () => openTool(btn.dataset.tool)));

function openTool(tool){
  const templates = {
    caption: `<div class="eyebrow">CREATOR TOOL</div><h2>Generator Caption</h2><p class="hint">Masukkan topik kontenmu.</p>
      <div class="field"><label>Topik</label><input id="capTopic" placeholder="Contoh: sunset di Sungai Martapura"></div>
      <div class="field"><label>Gaya</label><select id="capStyle"><option>Santai</option><option>Informatif</option><option>Lucu</option><option>Promosi</option></select></div>
      <button class="tool-action" onclick="makeCaption()">Buat Caption</button><div id="capResult"></div>`,
    ideas: `<div class="eyebrow">CREATOR TOOL</div><h2>Ide Konten</h2><p class="hint">Buat beberapa ide video dari satu topik.</p>
      <div class="field"><label>Topik</label><input id="ideaTopic" placeholder="Contoh: makanan khas Banjar"></div>
      <button class="tool-action" onclick="makeIdeas()">Buat Ide</button><div id="ideaResult"></div>`,
    hpp: `<div class="eyebrow">UMKM TOOL</div><h2>Kalkulator HPP</h2><p class="hint">Perhitungan sederhana per unit.</p>
      <div class="calc-grid"><div class="field"><label>Total biaya produksi (Rp)</label><input id="hppCost" type="number" min="0" placeholder="100000"></div><div class="field"><label>Jumlah produk</label><input id="hppQty" type="number" min="1" placeholder="20"></div><div class="field"><label>Margin keuntungan (%)</label><input id="hppMargin" type="number" min="0" value="30"></div></div>
      <button class="tool-action" onclick="calcHpp()">Hitung</button><div id="hppResult"></div>`,
    profit: `<div class="eyebrow">UMKM TOOL</div><h2>Kalkulator Profit</h2><div class="calc-grid">
      <div class="field"><label>Harga jual / unit</label><input id="pPrice" type="number" min="0" placeholder="10000"></div><div class="field"><label>Jumlah terjual</label><input id="pQty" type="number" min="0" placeholder="50"></div><div class="field"><label>Total biaya</label><input id="pCost" type="number" min="0" placeholder="300000"></div></div>
      <button class="tool-action" onclick="calcProfit()">Hitung</button><div id="profitResult"></div>`,
    password: `<div class="eyebrow">SECURITY TOOL</div><h2>Password Generator</h2><div class="field"><label>Panjang password</label><input id="passLen" type="number" min="6" max="64" value="16"></div>
      <div class="field"><label><input id="passSymbols" type="checkbox" checked> Gunakan simbol</label></div><button class="tool-action" onclick="generatePassword()">Generate</button><div id="passResult"></div>`,
    qr: `<div class="eyebrow">UTILITY</div><h2>QR Code Generator</h2><p class="hint">Gunakan untuk URL atau teks.</p><div class="field"><input id="qrText" placeholder="https://..."></div><button class="tool-action" onclick="generateQR()">Buat QR</button><div id="qrResult"></div>`,
    counter: `<div class="eyebrow">UTILITY</div><h2>Text Counter</h2><div class="field"><textarea id="countText" placeholder="Tulis atau tempel teks di sini..." oninput="countText()"></textarea></div><div id="countResult" class="result">0 kata • 0 karakter • 0 baris</div>`,
    case: `<div class="eyebrow">UTILITY</div><h2>Case Converter</h2><div class="field"><textarea id="caseText" placeholder="Masukkan teks..."></textarea></div><div class="hero-actions"><button class="tool-action" onclick="convertCase('upper')">UPPERCASE</button><button class="tool-action" onclick="convertCase('lower')">lowercase</button><button class="tool-action" onclick="convertCase('title')">Title Case</button></div><div id="caseResult"></div>`,
    checker: `<div class="eyebrow">SECURITY TOOL</div><h2>Password Checker</h2><p class="hint">Password diproses lokal di browser ini.</p><div class="field"><input id="checkPass" type="password" placeholder="Masukkan password" oninput="checkPassword()"></div><div id="checkResult"></div>`,
    calculator: `<div class="eyebrow">UTILITY</div><h2>Kalkulator</h2><div class="field"><input id="calcDisplay" readonly value="0"></div><div class="calc-grid">${["7","8","9","/","4","5","6","*","1","2","3","-","0",".","=","+"].map(x=>`<button class="tool-action" onclick="calcPress('${x}')">${x}</button>`).join("")}</div><button class="tool-action" style="margin-top:10px" onclick="calcClear()">Clear</button>`
  };
  openModal(templates[tool] || "<h2>Tool belum tersedia</h2>");
}

function money(n){ return new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(n); }
function escapeHTML(s){ return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m])); }

window.makeCaption = function(){
  const topic=escapeHTML($("#capTopic").value.trim()||"topik pilihanmu");
  const style=$("#capStyle").value;
  const templates={
    Santai:`Lagi menikmati ${topic}. Kadang hal sederhana justru paling berkesan. 🌿`,
    Informatif:`Mau tahu lebih banyak tentang ${topic}? Simpan postingan ini dan bagikan ke teman yang mungkin membutuhkannya.`,
    Lucu:`POV: niatnya cuma lihat ${topic}, ujung-ujungnya kepikiran terus 😂`,
    Promosi:`Sedang mencari ${topic}? Ini bisa jadi pilihan yang layak kamu pertimbangkan. Cek detailnya dan jangan sampai ketinggalan!`
  };
  $("#capResult").innerHTML=`<div class="result">${templates[style]}<br><br>#KalimantanHub #Kalimantan #Indonesia #Konten #FYP</div>`;
};
window.makeIdeas = function(){
  const t=escapeHTML($("#ideaTopic").value.trim()||"Kalimantan");
  const ideas=[`3 fakta menarik tentang ${t}`,`Kesalahan yang sering dilakukan saat membahas ${t}`,`POV: pertama kali mencoba ${t}`,`5 hal yang wajib kamu tahu tentang ${t}`,`Ekspektasi vs realita: ${t}`,`Tips sederhana untuk mengenal ${t}`,`Review jujur: pengalaman dengan ${t}`];
  $("#ideaResult").innerHTML=`<div class="result">${ideas.map((x,i)=>`${i+1}. ${x}`).join("\\n")}</div>`;
};
window.calcHpp=function(){
  const c=+$("#hppCost").value,q=+$("#hppQty").value,m=+$("#hppMargin").value;
  if(!c||!q){$("#hppResult").innerHTML='<div class="result">Masukkan biaya dan jumlah produk.</div>';return}
  const h=c/q,s=h*(1+m/100);
  $("#hppResult").innerHTML=`<div class="result"><strong>HPP / unit: ${money(h)}</strong>Harga jual dengan margin ${m}%: <b>${money(s)}</b></div>`;
};
window.calcProfit=function(){
  const p=+$("#pPrice").value,q=+$("#pQty").value,c=+$("#pCost").value;
  const omzet=p*q,profit=omzet-c;
  $("#profitResult").innerHTML=`<div class="result"><strong>Omzet: ${money(omzet)}</strong>Total biaya: ${money(c)}<br>Keuntungan: <b>${money(profit)}</b></div>`;
};
window.generatePassword=function(){
  const len=Math.min(64,Math.max(6,+$("#passLen").value||16));
  let chars="ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  if($("#passSymbols").checked) chars+="!@#$%^&*_-+=";
  const a=new Uint32Array(len); crypto.getRandomValues(a);
  let out=""; for(let i=0;i<len;i++) out+=chars[a[i]%chars.length];
  $("#passResult").innerHTML=`<div class="result"><strong>${escapeHTML(out)}</strong><button class="tool-action" onclick="navigator.clipboard.writeText('${out.replace(/'/g,"\\'")}');this.textContent='Tersalin ✓'">Salin</button></div>`;
};
window.generateQR=function(){
  const text=$("#qrText").value.trim();
  if(!text){$("#qrResult").innerHTML='<div class="result">Masukkan teks atau URL.</div>';return}
  const url="https://api.qrserver.com/v1/create-qr-code/?size=240x240&data="+encodeURIComponent(text);
  $("#qrResult").innerHTML=`<div class="result center"><img class="qr-img" src="${url}" alt="QR Code"><small>QR dibuat menggunakan layanan QR eksternal.</small></div>`;
};
window.countText=function(){
  const t=$("#countText").value, words=t.trim()?t.trim().split(/\s+/).length:0, chars=t.length, lines=t? t.split(/\n/).length:0;
  $("#countResult").textContent=`${words} kata • ${chars} karakter • ${lines} baris`;
};
window.convertCase=function(mode){
  const t=$("#caseText").value;
  let out=t;
  if(mode==="upper")out=t.toUpperCase();
  if(mode==="lower")out=t.toLowerCase();
  if(mode==="title")out=t.toLowerCase().replace(/\b\w/g,c=>c.toUpperCase());
  $("#caseResult").innerHTML=`<div class="result">${escapeHTML(out)}</div>`;
};
window.checkPassword=function(){
  const p=$("#checkPass").value; let score=0;
  if(p.length>=8)score++; if(p.length>=12)score++; if(/[a-z]/.test(p)&&/[A-Z]/.test(p))score++; if(/\d/.test(p))score++; if(/[^A-Za-z0-9]/.test(p))score++;
  const label=p.length===0?"Masukkan password":score<=2?"Lemah":score<=3?"Sedang":"Kuat";
  $("#checkResult").innerHTML=`<div class="result"><strong>Kekuatan: ${label}</strong>${p.length<8&&p.length>0?"Gunakan minimal 8 karakter.":""}</div>`;
};
let calcExpr="";
window.calcPress=function(x){
  if(x==="="){try{calcExpr=String(Function('"use strict";return ('+calcExpr+')')());}catch{calcExpr=""}}else calcExpr+=x;
  $("#calcDisplay").value=calcExpr||"0";
};
window.calcClear=function(){calcExpr="";$("#calcDisplay").value="0"};

$("#themeBtn").addEventListener("click",()=>{
  document.body.classList.toggle("dark");
  $("#themeBtn").textContent=document.body.classList.contains("dark")?"☀":"☾";
  localStorage.setItem("kh-theme",document.body.classList.contains("dark")?"dark":"light");
});
if(localStorage.getItem("kh-theme")==="dark"){document.body.classList.add("dark");$("#themeBtn").textContent="☀";}
