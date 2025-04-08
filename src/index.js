// import './date.js';
import * as copyStack from './copy_stack.js';

const globalThis = (Function('return this')());

for (const [key, value] of Object.entries(copyStack)) {
  globalThis[key] = value;
}
