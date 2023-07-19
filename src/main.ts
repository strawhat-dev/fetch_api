import { isPrimitive } from '@/utils';

const cloneFn = (fn: Function) => new Function(`return ${fn}`)();
const fn = () => 'hello';
fn.key = 'value';

const fn2 = cloneFn(fn);

console.log(fn2());
