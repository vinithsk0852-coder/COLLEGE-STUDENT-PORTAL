const $=id=>document.getElementById(id);
const attendance=[["Programming in C",27,30],["Computer Fundamentals",25,28],["Mathematics",22,26],["English",24,27],["Digital Skills",23,25]];
const schedule=[["09:00–10:00","Programming in C","Mathematics","English","Programming in C","Digital Skills"],["10:00–11:00","Mathematics","Computer Fundamentals","Programming in C","English","Mathematics"],["11:15–12:15","English","Programming in C","Computer Fundamentals","Digital Skills","Computer Fundamentals"],["01:00–02:00","Digital Skills","English","Mathematics","Computer Fundamentals","Programming in C"]];
const news=[["Internal assessment schedule","Check with your department for the first internal assessment timetable."],["Library hours reminder","Check library opening hours before planning your study session."],["Department activities","Look out for upcoming department events and student activities."]];
const results=[["Programming in C",43,42],["Computer Fundamentals",41,44],["Mathematics",40,39],["English",45,43],["Digital Skills",42,41]];
const key="campusconnect_assignments";
let assignments=JSON.parse(localStorage.getItem(key)||"null")||[{id:"1",title:"C programming record",subject:"Programming in C",date:"2026-11-13",done:false},{id:"2",title:"Computer fundamentals notes",subject:"Computer Fundamentals",date:"2026-11-16",done:false},{id:"3",title:"Mathematics exercise",subject:"Mathematics",date:"2026-11-18",done:false}];
function go(name){document.querySelectorAll(".page").forEach(p=>p.classList.toggle("active",p.id===name));document.querySelectorAll("nav button").forEach(b=>b.classList.toggle("active",b.dataset.page===name));$("crumb").textContent=name[0].toUpperCase()+name.slice(1);window.scrollTo(0,0)}
document.querySelectorAll("nav button").forEach(b=>b.onclick=()=>go(b.dataset.page));document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>go(b.dataset.go));
$("date").textContent=new Date().toLocaleDateString(undefined,{weekday:"short",day:"numeric",month:"short",year:"numeric"});
const total=attendance.reduce((s,x)=>s+x[1],0),classes=attendance.reduce((s,x)=>s+x[2],0);
$("attendance-stat").textContent=Math.round(total/classes*100)+"%";
$("attendance-table").innerHTML=attendance.map(x=>{let p=Math.round(x[1]/x[2]*100);return `<tr><td><b>${x[0]}</b></td><td>${x[1]}</td><td>${x[2]}</td><td>${p}%</td><td><span class="status">${p>=75?"Good":"Needs attention"}</span></td></tr>`}).join("");
let day=new Date().getDay();if(day<1||day>5)day=1;
$("today-classes").innerHTML=schedule.map(x=>`<div class="class-row"><span class="class-time">${x[0]}</span><span><b>${x[day]}</b><small>Lecture · Classroom</small></span></div>`).join("");
$("timetable-table").innerHTML=schedule.map(x=>`<tr>${x.map((v,i)=>`<td>${i===0?"<b>"+v+"</b>":v}</td>`).join("")}</tr>`).join("");
$("dash-news").innerHTML=news.slice(0,2).map(x=>`<div class="news-row"><span>♢ ${x[0]}<small>${x[1]}</small></span></div>`).join("");
$("all-news").innerHTML=news.map(x=>`<div class="card news-row"><span><b>${x[0]}</b><small>${x[1]}</small></span></div>`).join("");
$("results-table").innerHTML=results.map(x=>{let n=x[1]+x[2],g=n>=90?"A+":n>=80?"A":n>=70?"B":"C";return `<tr><td><b>${x[0]}</b></td><td>${x[1]}</td><td>${x[2]}</td><td>${n}</td><td><span class="status">${g}</span></td></tr>`}).join("");
$("average").textContent="Overall average: "+Math.round(results.reduce((s,x)=>s+x[1]+x[2],0)/(results.length*2))+"%";
function safe(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function save(){localStorage.setItem(key,JSON.stringify(assignments))}
function renderAssignments(){
$("pending-stat").textContent=assignments.filter(a=>!a.done).length;
const pending=assignments.filter(a=>!a.done).slice(0,3);
$("dash-assignments").innerHTML=pending.map(a=>`<div class="assignment-row"><span><b>${safe(a.title)}</b><small>${safe(a.subject)} · Due ${a.date}</small></span><span class="status">Pending</span></div>`).join("")||"<p class='muted'>No pending assignments. Great work!</p>";
$("assignment-list").innerHTML=assignments.map(a=>`<div class="assignment-row ${a.done?"done":""}"><input type="checkbox" data-check="${a.id}" ${a.done?"checked":""}><span><strong>${safe(a.title)}</strong><small>${safe(a.subject)} · Due ${a.date}</small></span><span class="status">${a.done?"Completed":"Pending"}</span><button class="delete" data-delete="${a.id}">×</button></div>`).join("")||"<p class='muted'>No assignments. Add your first one.</p>";
document.querySelectorAll("[data-check]").forEach(el=>el.onchange=()=>{let a=assignments.find(x=>x.id===el.dataset.check);a.done=el.checked;save();renderAssignments()});
document.querySelectorAll("[data-delete]").forEach(el=>el.onclick=()=>{assignments=assignments.filter(x=>x.id!==el.dataset.delete);save();renderAssignments()});
}
$("show-form").onclick=()=>{$("assignment-form").classList.toggle("hidden")};
$("assignment-form").onsubmit=e=>{e.preventDefault();assignments.push({id:Date.now().toString(),title:$("a-title").value.trim(),subject:$("a-subject").value.trim(),date:$("a-date").value,done:false});save();$("assignment-form").reset();$("assignment-form").classList.add("hidden");renderAssignments()};
renderAssignments();
