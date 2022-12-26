// Input is an array of objects
export function generateKeyFromLabel(label) {
  return label.toLowerCase().replaceAll(/[\s./]/g, '_')
}
