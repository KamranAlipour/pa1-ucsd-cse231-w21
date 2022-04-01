import * as mocha from 'mocha';
import {expect} from 'chai';
import { parser } from 'lezer-python';
import { traverseExpr, traverseStmt, traverse, parse } from '../parser';

// We write tests for each function in parser.ts here. Each function gets its 
// own describe statement. Each it statement represents a single test. You
// should write enough unit tests for each function until you are confident
// the parser works as expected. 
describe('traverseExpr(c, s) function', () => {
  it('parses a number in the beginning', () => {
    const source = "987";
    const cursor = parser.parse(source).cursor();

    // go to statement
    cursor.firstChild();
    // go to expression
    cursor.firstChild();

    const parsedExpr = traverseExpr(cursor, source);

    // Note: we have to use deep equality when comparing objects
    expect(parsedExpr).to.deep.equal({tag: "num", value: 987});
  })

  it('parses a variable name', () => {
    const source = "A";
    const cursor = parser.parse(source).cursor();

    // go to statement
    cursor.firstChild();
    // go to expression
    cursor.firstChild();

    const parsedExpr = traverseExpr(cursor, source);

    // Note: we have to use deep equality when comparing objects
    expect(parsedExpr).to.deep.equal({tag: "id", name:"A"});
  })

  it('parses a call expression with 1 argument', () => {
    const source = "test_func(A)";
    const cursor = parser.parse(source).cursor();

    // go to statement
    cursor.firstChild();
    // go to expression
    cursor.firstChild();

    const parsedExpr = traverseExpr(cursor, source);

    // Note: we have to use deep equality when comparing objects
    expect(parsedExpr).to.deep.equal({ tag: "builtin1", name: "test_func", arg: { tag: "id", name: "A" }});
  })

  it('parses a call expression with 2 arguments', () => {
    const source = "test_func(A,12)";
    const cursor = parser.parse(source).cursor();

    // go to statement
    cursor.firstChild();
    // go to expression
    cursor.firstChild();

    const parsedExpr = traverseExpr(cursor, source);

    // Note: we have to use deep equality when comparing objects
    expect(parsedExpr).to.deep.equal({ tag: "builtin2", name: "test_func", 
                                       arg1: { tag: "id", name: "A" },
                                       arg2: { tag: "num", value: 12 },
                                     });
  })

  it('parses a binary operation', () => {
    const source = "11 - 3";
    const cursor = parser.parse(source).cursor();

    // go to statement
    cursor.firstChild();
    // go to expression
    cursor.firstChild();

    const parsedExpr = traverseExpr(cursor, source);

    // Note: we have to use deep equality when comparing objects
    expect(parsedExpr).to.deep.equal({tag: "biexp", name:"-", 
                                      value1: {tag: "num", value: 11}, 
                                      value2: {tag: "num", value: 3}
                                     });
  })

  // TODO: add additional tests here to ensure traverseExpr works as expected
});

describe('traverseStmt(c, s) function', () => {

  it('parses an assign statement', () => {
    const source = 'A = 212';
    const cursor = parser.parse(source).cursor();

    // go to statement
    cursor.firstChild();

    const parsedStmt = traverseStmt(cursor, source);

    // Note: we have to use deep equality when comparing objects
    expect(parsedStmt).to.deep.equal({tag: "define", name: "A", value: {tag: "num", value: 212} });
  })

  it('parses an expression statement', () => {
    const source = 'A = 39+21';
    const cursor = parser.parse(source).cursor();

    // go to statement
    cursor.firstChild();

    const parsedStmt = traverseStmt(cursor, source);

    // Note: we have to use deep equality when comparing objects
    expect(parsedStmt).to.deep.equal({tag: "define", name: "A", 
                                      value: 
                                       {tag: "biexp", name:"+", 
                                        value1: {tag: "num", value: 39}, 
                                        value2: {tag: "num", value: 21}
                                       } 
                                     });
  })
  // TODO: add tests here to ensure traverseStmt works as expected
});

describe('traverse(c, s) function', () => {
  it('parses a script', () => {
    const source = 'A = 39+21\nA';
    const cursor = parser.parse(source).cursor();

    const parsedScript = traverse(cursor, source);

    // Note: we have to use deep equality when comparing objects
    expect(parsedScript).to.deep.equal([{tag: "define", name: "A", 
                                      value: 
                                       {tag: "biexp", name:"+", 
                                        value1: {tag: "num", value: 39}, 
                                        value2: {tag: "num", value: 21}
                                       } 
                                       },
                                       {tag: "expr", expr: {tag: "id", name: "A"}}
                                       ]);
  })
  // TODO: add tests here to ensure traverse works as expected
});

describe('parse(source) function', () => {
  it('parse a number', () => {
    const parsed = parse("987");
    expect(parsed).to.deep.equal([{tag: "expr", expr: {tag: "num", value: 987}}]);
  });  

  // TODO: add additional tests here to ensure parse works as expected
});