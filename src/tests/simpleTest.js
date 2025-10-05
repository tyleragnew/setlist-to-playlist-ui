// Simple smoke test that runs with Node (ESM)
const assert = (cond, msg) => { if (!cond) { console.error('FAIL:', msg); process.exit(1) } }

console.log('Running simpleTest...')
assert(1 + 1 === 2, 'math is broken')
console.log('OK')
