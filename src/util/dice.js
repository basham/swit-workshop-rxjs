import { FACES } from '../constants.js'

// In: '2d6 1d20'
// Out:
//   [
//     { dieCount: 0, faceCount: 4, notation: '0d4', type: 'd4' },
//     { dieCount: 2, faceCount: 6, notation: '2d6', type: 'd6' },
//     { dieCount: 0, faceCount: 8, notation: '0d8', type: 'd8' },
//     { dieCount: 0, faceCount: 10, notation: '0d10', type: 'd10' },
//     { dieCount: 0, faceCount: 12, notation: '0d12', type: 'd12' },
//     { dieCount: 1, faceCount: 20, notation: '1d20', type: 'd20' }
//   ]
export function decodeFormula (formula) {
  const dice = (formula || '')
    .split(' ')
    .map((value) => value.match(/(\d+)d(\d+)/i))
    .filter((match) => match)
    .map(([ , dieCount, faceCount ]) => [ parseInt(faceCount), parseInt(dieCount) ])
    .map(([ faceCount, dieCount ]) => ({ [faceCount]: dieCount }))
    .reduce((all, value) => ({ ...all, ...value }), {})
  return FACES
    .map((faceCount) => {
      const dieCount = dice[faceCount] || 0
      const type = `d${faceCount}`
      const notation = `${dieCount}${type}`
      return { dieCount, faceCount, notation, type }
    })
}

// In:
//   [
//     { dieCount: 2, faceCount: 6 },
//     { dieCount: 1, faceCount: 20 }
//   ]
// Out: '2d6 1d20'
export function encodeFormula (diceSets) {
  return diceSets
    .filter(({ dieCount }) => dieCount)
    .filter(({ faceCount }) => FACES.includes(faceCount))
    .sort((a, b) => a.faceCount - b.faceCount)
    .map(({ dieCount, faceCount }) => `${dieCount}d${faceCount}`)
    .join(' ')
}
