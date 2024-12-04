/// <reference types="@cloudflare/workers-types" />
import TestD1PreparedStatement from './test-d1-prepared-statement.js';
import unimplementedMethod from './unimplemented-method.js';

interface Result {
  readonly error?: Error | undefined;
  readonly lastRowId?: number | undefined;
  readonly results?: readonly unknown[] | undefined;
}

export default class TestD1Database implements D1Database {
  public readonly batch: D1Database['batch'] = unimplementedMethod;
  public readonly dump: D1Database['dump'] = unimplementedMethod;
  public readonly exec: D1Database['exec'] = unimplementedMethod;
  readonly #preparedStatements = new Map<string, TestD1PreparedStatement>();
  readonly #queries = new Map<string, Result>();

  public constructor(queries: Record<string, Result> = {}) {
    for (const [query, result] of Object.entries(queries)) {
      this.#queries.set(query, result);
    }
  }

  public readonly expectToHaveQueried = (
    query: string,
    values: readonly (null | number | string)[],
  ): void => {
    const statement: TestD1PreparedStatement | undefined =
      this.#preparedStatements.get(query);
    if (typeof statement === 'undefined') {
      throw new Error(`Expected query to have been prepared:
${query}`);
    }

    const { expectToHaveBound } = statement;
    expectToHaveBound(...values);
  };

  public readonly prepare = (query: string): D1PreparedStatement => {
    const result: Result | undefined = this.#queries.get(query);
    if (typeof result === 'undefined') {
      throw new Error(`Expected query to be mocked:
${query}`);
    }

    const statement = new TestD1PreparedStatement(result);
    this.#preparedStatements.set(query, statement);
    return statement;
  };
}