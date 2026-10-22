const units=['Drivetrain','Chassis','Shoulder','Legs','Drum','Electronics','Misc','Documentation'];
const key='club/erp/state-v1.json';
const json=(body,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
export function validate(s){
 if(!s||s.version!==1||!['units','parts','requirements','orders'].every(k=>Array.isArray(s[k])&&s[k].length<=5000))return 'Invalid record structure.';
 const unique=a=>a.every(x=>x&&typeof x.id==='string'&&x.id.length<=100)&&new Set(a.map(x=>x.id)).size===a.length;
 const num=x=>Number.isFinite(x)&&x>=0;const text=(x,max=2000)=>typeof x==='string'&&x.length<=max;const date=x=>x===''||typeof x==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(x);
 if(s.units.length!==8||new Set(s.units.map(u=>u.name)).size!==8||s.units.some(u=>!units.includes(u.name)||!(u.budget===null||num(u.budget))||!['purchase','fabricate','assemble'].every(k=>date(u[k]))))return 'Invalid units, budgets, or deadlines.';
 if(!unique(s.parts)||!unique(s.requirements)||!unique(s.orders))return 'Missing or duplicate record IDs.';
 const parts=new Map(s.parts.map(p=>[p.id,p]));const reqs=new Map(s.requirements.map(r=>[r.id,r]));
 if(s.parts.some(p=>!text(p.name,200)||!p.name.trim()||!(p.price===null||num(p.price))||!['number','supplier','url','drawing','revision','type'].every(k=>text(p[k]))||!['url','drawing'].every(k=>!p[k]||/^https?:\/\//i.test(p[k]))))return 'Invalid component details, price, or links.';
 if(s.requirements.some(r=>!parts.has(r.part)||!units.includes(r.unit)||!Number.isInteger(r.qty)||r.qty<1||!['qty','received','ready'].every(k=>Number.isInteger(r[k])&&r[k]>=0)||r.received>r.qty||r.ready>r.received||!['location','assembly','notes'].every(k=>text(r[k],6000))||!date(r.due)||!(r.unit==='Documentation'?['Design','In review','Released','Complete']:['Design','Released','Purchased','Received','Fabricating','Ready for assembly','Assembled']).includes(r.stage)||['Ready for assembly','Assembled'].includes(r.stage)&&r.ready<r.qty))return 'Invalid requirement, quantities, or stage.';
 if(s.orders.some(o=>!reqs.has(o.requirement)||!Number.isInteger(o.qty)||o.qty<1||!num(o.price)||!num(o.extra)||!date(o.date)||!text(o.note,6000)))return 'Invalid purchase.';
 const ordered=new Map();for(const o of s.orders)ordered.set(o.requirement,(ordered.get(o.requirement)||0)+o.qty);if([...ordered].some(([id,qty])=>qty>reqs.get(id).qty))return 'Purchased quantity exceeds required quantity.';
 return null;
}
export default {async fetch(request,env){try{
 const url=new URL(request.url);const user=request.headers.get('oai-authenticated-user-id');
 // The Sites gateway enforces the site's member allowlist and supplies verified identity.
 if(!user){if(url.pathname.startsWith('/api/'))return json({error:'Sign in to access the club workspace.'},401);return Response.redirect(url.origin+'/signin-with-chatgpt?return_to=%2F',302)}
 if(url.pathname==='/api/session')return json({email:request.headers.get('oai-authenticated-user-email')||'',id:user});
 if(url.pathname==='/api/state'){
  if(!env.BUCKET)return json({error:'Cloud storage is unavailable. No changes were saved.'},503);
  if(request.method==='GET'){
   const obj=await env.BUCKET.get(key);return obj?json({...(await obj.json()),etag:obj.etag}):json({state:null,etag:null});
  }
  if(request.method!=='PUT')return json({error:'Method not allowed.'},405);
  if(request.headers.get('Origin')!==url.origin)return json({error:'Cross-site writes are not allowed.'},403);
  if(!(request.headers.get('Content-Type')||'').startsWith('application/json'))return json({error:'JSON required.'},415);
  if(+(request.headers.get('Content-Length')||0)>1500000)return json({error:'Workspace is too large.'},413);
  const raw=await request.text();if(raw.length>1500000)return json({error:'Workspace is too large.'},413);
  let input;try{input=JSON.parse(raw)}catch{return json({error:'Invalid JSON.'},400)}
  const invalid=validate(input.state);if(invalid)return json({error:invalid},400);
  if(input.etag!==null&&(typeof input.etag!=='string'||!/^[a-f0-9]{32}$/.test(input.etag)))return json({error:'Invalid workspace revision.'},400);
  const current=await env.BUCKET.get(key);
  if((current?.etag??null)!==input.etag)return json({error:'Another member saved changes. Export your draft, then reload the latest workspace.'},409);
  const data={state:input.state,updatedAt:new Date().toISOString(),updatedBy:request.headers.get('oai-authenticated-user-email')||user};
  const result=await env.BUCKET.put(key,JSON.stringify(data),{onlyIf:input.etag?{etagMatches:input.etag}:{etagDoesNotMatch:'*'},httpMetadata:{contentType:'application/json'}});
  if(!result)return json({error:'Another member saved at the same time. Export your draft and reload.'},409);
  return json({...data,etag:result.etag});
 }
 const asset=assets[url.pathname];if(!asset)return new Response('Not found',{status:404});
 return new Response(asset.body,{headers:{'Content-Type':asset.type,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'same-origin'}});
 }catch{return json({error:'Cloud request failed. Your draft has not been discarded.'},503)}}};
