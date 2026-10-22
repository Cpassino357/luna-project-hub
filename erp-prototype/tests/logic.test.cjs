const assert=require('node:assert/strict');const E=require('../web/logic.js');
const s={parts:[{id:'bearing',price:10}],requirements:[{id:'a',part:'bearing',unit:'Chassis',qty:4,stage:'Released'},{id:'b',part:'bearing',unit:'Legs',qty:2,stage:'Design'}],orders:[]};
let g=E.groups(s)[0];assert.equal(g.qty,4);assert.equal(g.held.length,1);s.requirements[1].stage='Released';assert.equal(E.groups(s)[0].qty,6);
s.orders.push({requirement:'a',qty:2,price:12,extra:3});assert.equal(E.actual(s,'a'),27);assert.equal(E.expected(s,s.requirements[0]),47);assert.equal(E.groups(s)[0].qty,4);
s.orders.push({requirement:'a',qty:2,price:9,extra:1});assert.equal(E.expected(s,s.requirements[0]),46);assert.equal(E.groups(s)[0].qty,2);assert.equal(E.groups(s)[0].released.length,1);
s.parts[0].price=null;assert.equal(E.expected(s,s.requirements[1]),0);assert.equal(E.actual(s,'b'),0);console.log('Passed: consolidation, partial release, partial purchasing, cost allocation, missing estimates.');
