import parser from './parser';
import transpile from './transpiler';
import {b2ab} from './utils';

export default (source) => transpile(...parser(b2ab(source)));
export const raw = true;
