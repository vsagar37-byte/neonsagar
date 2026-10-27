const fs=require('fs'),vm=require('vm'),assert=require('assert');
const html=fs.readFileSync('app/src/main/assets/index.html','utf8');
let js=html.match(/<script>([\s\S]*?)<\/script>/)[1];
new vm.Script(js);
js=js.replace('resize();hud();home();requestAnimationFrame(frame);',`globalThis.test={start,update,pause,openMenu,showShop,levelAt,settingsAt,get:()=>({state,score,chain,shield,data}),set:(v)=>{if(v.items)items=v.items;if(v.shield!==undefined)shield=v.shield;if(v.chain!==undefined)chain=v.chain;if(v.wallet!==undefined)data.wallet=v.wallet;if(v.daily)data.daily=v.daily;},at:()=>y(),click:(a)=>$('card').onclick({target:{closest:()=>({dataset:a})}})};`);
const elements=new Map();const el=id=>{if(!elements.has(id))elements.set(id,{textContent:'',innerHTML:'',hidden:false,style:{},getBoundingClientRect:()=>({width:360,height:450}),getContext:()=>({setTransform(){}})});return elements.get(id)};
const storage=new Map();const sandbox={console,Date,Math,Number,JSON,localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},document:{getElementById:el,addEventListener(){}},ResizeObserver:class{observe(){}},addEventListener(){},requestAnimationFrame(){},window:{devicePixelRatio:1}};vm.createContext(sandbox);vm.runInContext(js,sandbox);const t=sandbox.test;
let count=0;function check(name,f){t.start();f();count++;console.log('PASS '+name)}
const item=type=>[{type,lane:0,y:t.at(),passed:false}];
check('gem gives currency and five points',()=>{t.set({items:item('gem')});t.update(0);assert.equal(t.get().score,5);assert.equal(t.get().data.wallet,1)});
check('third consecutive gem doubles points',()=>{t.set({chain:2,items:item('gem')});t.update(0);assert.equal(t.get().score,10)});
check('combo multiplier caps at four',()=>{t.set({chain:99,items:item('gem')});t.update(0);assert.equal(t.get().score,20)});
check('missed gem resets combo',()=>{t.set({chain:5,items:[{type:'gem',lane:1,y:t.at()+40}]});t.update(0);assert.equal(t.get().chain,0)});
check('shield pickup activates protection',()=>{t.set({items:item('shield')});t.update(0);assert.equal(t.get().shield,true)});
check('shield absorbs collision',()=>{t.set({shield:true,items:item('block')});t.update(0);assert.equal(t.get().state,'playing');assert.equal(t.get().shield,false)});
check('unshielded collision ends run',()=>{t.set({items:item('block')});t.update(0);assert.equal(t.get().state,'over')});
check('menus preserve pause',()=>{t.openMenu('shop');t.openMenu('daily');t.click({action:'back'});assert.equal(t.get().state,'paused')});
check('daily reward cannot be claimed twice',()=>{const d=new Date();t.set({wallet:0,daily:{date:d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate(),gems:30,claimed:false}});t.click({action:'claim'});t.click({action:'claim'});assert.equal(t.get().data.wallet,25)});
check('purchase deducts gems and unlocks color',()=>{t.set({wallet:70});t.click({skin:'1'});assert.equal(t.get().data.wallet,20);assert(t.get().data.owned.includes(1));assert.equal(t.get().data.selected,1)});
check('insufficient funds cannot purchase',()=>{t.set({wallet:0});t.click({skin:'3'});assert.equal(t.get().data.selected,1);assert(!t.get().data.owned.includes(3))});

check('difficulty selection changes game and persists',()=>{t.click({action:'home'});t.click({mode:'hard'});assert.equal(t.get().data.mode,'hard');assert.equal(JSON.parse(storage.get('neonSwitchArcadeV2')).mode,'hard');assert(t.settingsAt('hard',0).speed>t.settingsAt('medium',0).speed);assert(t.settingsAt('medium',0).speed>t.settingsAt('easy',0).speed)});
check('levels advance every 15 seconds and cap at 50',()=>{assert.equal(t.levelAt(0),1);assert.equal(t.levelAt(15),2);assert.equal(t.levelAt(735),50);assert.equal(t.levelAt(9999),50)});
check('difficulty increases with level',()=>{for(const mode of ['easy','medium','hard']){assert(t.settingsAt(mode,735).speed>t.settingsAt(mode,0).speed);assert(t.settingsAt(mode,735).interval<t.settingsAt(mode,0).interval)}});
check('high scores are separate by difficulty',()=>{t.click({action:'home'});t.click({mode:'easy'});t.start();t.set({items:item('gem')});t.update(0);t.click({action:'end'});assert.equal(t.get().data.bests.easy,5);assert.equal(t.get().data.bests.hard,0)});
console.log(count+' game-rule checks passed. Android compilation/device tests not run.');
