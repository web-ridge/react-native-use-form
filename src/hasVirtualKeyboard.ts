const hasTouch = typeof window !== 'undefined' && 'ontouchstart' in window;

// const screenIsPortrait = window.matchMedia('(orientation: portrait)').matches;
// return screenIsPortrait ? 'portrait' : 'landscape';
// let heightPerOrientation: Record<string, number> = {
//   [getOrientation()]: window.innerHeight,
// };
// window.addEventListener('resize', () => {
//   const initialHeight = heightPerOrientation[getOrientation()];
//   if (initialHeight) {
//     if (window.innerHeight < initialHeight) {
//       console.log('Virtual keyboard likely opened');
//     } else {
//       console.log('Virtual keyboard likely closed');
//       initialHeight = window.innerHeight;
//     }
//   }
// });

const screenIsLarge =
  typeof window !== 'undefined' &&
  window.matchMedia('(min-width: 1000px)').matches;
const hasVirtualKeyboard = hasTouch && !screenIsLarge;
export default hasVirtualKeyboard;
