(function(root){
'use strict';
function parse(s){if(!/^\d{4}-\d{2}-\d{2}$/.test(s))throw Error('Некорректная дата');const d=new Date(s+'T12:00:00Z');if(!Number.isFinite(+d)||d.toISOString().slice(0,10)!==s)throw Error('Некорректная дата');return d;}
function nextDay(s){const d=parse(s);d.setUTCDate(d.getUTCDate()+1);return d.toISOString().slice(0,10);}
function uid(){return globalThis.crypto?.randomUUID?.()||Date.now().toString(36)+Math.random().toString(36).slice(2);}
function plan(trips,shops,date,ids,editId=null){parse(date);if(!ids.length||ids.length>2)throw Error('Выберите магазин');return ids.map((id,i)=>{const shop=shops.find(s=>s.id===id);if(!shop)throw Error('Магазин не найден');const day=i?nextDay(date):date;if(trips.some(t=>t.id!==editId&&t.date===day&&t.shopId===id))throw Error('Рейс в этот магазин на '+day.split('-').reverse().join('.')+' уже существует.');return {id:i===0&&editId?editId:uid(),date:day,shopId:id,name:shop.name,route:shop.route};});}
function csv(rows){const cell=v=>'"'+(/^[\s]*[=+@\-]/.test(String(v))?"'":'')+String(v).replaceAll('"','""')+'"';return '\ufeff'+[['Дата','Магазин','Маршрут'],...rows.map(t=>[t.date.split('-').reverse().join('.'),t.name,t.route])].map(r=>r.map(cell).join(';')).join('\r\n');}
const api={nextDay,plan,csv,uid};if(typeof module!=='undefined')module.exports=api;else root.Trips=api;
})(globalThis);
