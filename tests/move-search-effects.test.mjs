import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { filterMoves } from '../src/query.js';
import { moveEffects, effectCopy } from '../src/move-effects.js';
const load = async id => JSON.parse(await readFile(new URL(`../public/data/${id}.json`,import.meta.url)));
const kazuya = await load('kazuya'), king = await load('king');
test('input search unifies slash, arrows, full-width characters, spacing and button names', () => {
  for(const query of ['df+2','d/f + 2','df2','↘＋２','D / F + RP']) {
    const found = filterMoves(kazuya.moves,{query});
    assert.equal(found[0].command,'df+2',query);
  }
  const simultaneous = {command:'1+2', name:'Both punches',notes:'',section:'',target:'m'};
  const sequence = {command:'1,2',name:'Two punches',notes:'',section:'',target:'h,h'};
  assert.deepEqual(filterMoves([sequence,simultaneous],{query:'1+2'}),[simultaneous]);
  assert.deepEqual(filterMoves([sequence,simultaneous],{query:'1,2'}),[sequence]);
});
test('names support reordered keywords, minor misspellings and curated Chinese aliases', () => {
  for(const query of ['电风','EWGF','fist electric','electrc wind']) {
    assert.ok(filterMoves(kazuya.moves,{query}).some(m => m.name === 'Electric Wind God Fist'),query);
  }
  const found = filterMoves(kazuya.moves,{query:'中段 浮空'});
  assert.ok(found.length);
  assert.ok(found.every(m => /^(m|mid)$/.test(m.target) && /\d+a/.test(m.hit)));
  const alt = {command:'FC.df+2',alt:['ws+2'],name:'Alternate input',notes:'',section:''};
  assert.equal(filterMoves([alt],{query:'ws2'})[0],alt);
  assert.equal(filterMoves(kazuya.moves,{query:'zzzzzzzz'}).length,0);
});
test('exact input ranks above longer strings and note mentions', () => {
  const moves = [{command:'df+2,1',name:'String'}, {command:'3',notes:'Use df+2 afterwards'}, {command:'df+2',name:'Exact'}];
  assert.equal(filterMoves(moves,{query:'df+2'})[0].name,'Exact');
  assert.equal(filterMoves(moves,{query:''})[0],moves[0]);
});
test('effects separate defender crouch, airborne, knockdown, missing counter and attacker recovery', () => {
  const e = moveEffects({block:'-9c',hit:'+35a (+25)',counter_hit:'+0d',recovery:'t40 r21 FC',states:'cs6~',notes:''});
  assert.equal(e.block.state,'crouch'); assert.equal(e.hit.state,'airborne');
  assert.equal(e.counter.state,'down'); assert.equal(e.self.state,'FC');
  const unknown = moveEffects({block:'-9',hit:'+5',counter_hit:'',states:'cs6~',notes:'Same attack as Spring Up (FUFT.b+3+4)'});
  assert.equal(unknown.block.state,'guard'); assert.equal(unknown.hit.state,'normal');
  assert.equal(unknown.counter.state,'counterUnknown'); assert.equal(unknown.self.state,'unknown');
  assert.equal(moveEffects({notes:'Forces crouch on CH',hit:'+6',counter_hit:'+14'}).counter.state,'crouch');
});
test('explicit opponent orientations do not come from self recovery, inputs or Heat Dash alternatives', () => {
  for(const code of ['FUFT','FUFA','FDFT','FDFA','FUFL','FUFR','FDFL','FDFR']) {
    assert.equal(moveEffects({hit:'+0d',notes:`Opponent recovers in ${code}.`}).hit.state,code);
  }
  assert.equal(moveEffects({hit:'+0d',notes:'Opponent left FUFR?'}).hit.tentative,true);
  assert.equal(moveEffects({hit:'+0d',notes:'Opponent recovers in FDFL/FDFR.'}).hit.state,'FDFL_FDFR');
  const conditional = moveEffects({hit:'+5',notes:'Heat Dash +5, +43d (+35) Only launches standing opponents',recovery:'r FUFA'});
  assert.equal(conditional.hit.state,'normal');assert.equal(conditional.conditional,true);
  const real = king.moves.find(m => /Opponent recovers in FUFT/.test(m.notes));
  assert.equal(moveEffects(real).hit.state,'FUFT');
});
test('all source records have translatable outcome states without altering source data', async () => {
  const roster = await load('roster');
  // Roster is an array, not a character dataset.
  for (const fighter of roster) {
    const data = await load(fighter.id);
    for (const move of data.moves) {
      const before = JSON.stringify(move), result = moveEffects(move);
      for (const lang of ['zh','en','ja']) for(const kind of ['block','hit','counter','self']) {
        assert.ok(effectCopy[lang][result[kind].state],`${fighter.id} ${move.command} ${kind} ${result[kind].state}`);
      }
      assert.equal(JSON.stringify(move),before);
    }
  }
  assert.match(effectCopy.zh.FUFT,/脚朝对手/);assert.match(effectCopy.zh.FUFA,/头朝对手/);
});
