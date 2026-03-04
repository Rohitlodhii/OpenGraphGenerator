import chroma from "chroma-js"

export function generateShades(baseColor: string, steps = 6) {
  return chroma
    .scale([
      chroma.mix(baseColor, "black", 0.6), // lightest
      baseColor,
      chroma.mix(baseColor, "white", 0.7), // darkest
    ])
    .mode("lch") // better gradient interpolation
    .colors(steps)
}


//EXAMPLE USAGE
// generateShades('#FFAE00' ) 
// RETURNS : 
// [
//  '#ffe7b3',
//  '#ffd374',
//  '#ffc247',
//  '#ffae00',
//  '#d49100',
//  '#8f6400'
// ]