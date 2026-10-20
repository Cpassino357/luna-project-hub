(function(root){
const stages=['Design','Released','Purchased','Received','Fabricating','Ready for assembly','Assembled'];
function purchased(s,id){return s.orders.filter(o=>o.requirement===id).reduce((a,o)=>a+o.qty,0)}
function actual(s,id){return s.orders.filter(o=>o.requirement===id).reduce((a,o)=>a+o.qty*o.price+o.extra,0)}
function expected(s,r){const p=s.parts.find(p=>p.id===r.part);return actual(s,r.id)+Math.max(0,r.qty-purchased(s,r.id))*(p.price??0)}
function groups(s){return s.parts.map(p=>{const all=s.requirements.filter(r=>r.part===p.id&&r.unit!=='Documentation');const released=all.filter(r=>r.stage!=='Design'&&r.qty>purchased(s,r.id));const held=all.filter(r=>r.stage==='Design'&&r.qty>purchased(s,r.id));return {part:p,released,held,qty:released.reduce((a,r)=>a+Math.max(0,r.qty-purchased(s,r.id)),0)}}).filter(g=>g.qty>0)}
const api={stages,purchased,actual,expected,groups};if(typeof module!=='undefined')module.exports=api;else root.ERP=api;
})(globalThis);
