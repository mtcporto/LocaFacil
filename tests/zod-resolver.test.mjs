import {test} from 'node:test';
import assert from 'node:assert/strict';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';

const schema = z.object({
  amount: z.coerce.number({error: 'Informe um numero.'}).positive({message: 'Use um valor positivo.'}),
  category: z.enum(['rent', 'services'], {error: issue => issue.input === undefined ? 'Selecione a categoria.' : undefined}),
  date: z.date({error: issue => issue.input === undefined ? 'Informe a data.' : undefined}),
}).refine(value => value.category !== 'services' || value.amount <= 100, {
  path: ['amount'],
  message: 'Limite de servicos excedido.',
});
const resolve = values => zodResolver(schema)(values, {}, {
  criteriaMode: 'all',
  shouldUseNativeValidation: false,
});

test('resolver returns parsed numeric output and Date without changing valid values', async () => {
  const date = new Date('2026-11-10T12:00:00Z');
  const result = await resolve({amount: '12.50', category: 'rent', date});
  assert.deepEqual(result, {errors: {}, values: {amount: 12.5, category: 'rent', date}});
});

test('resolver maps Zod 4 issues to form errors instead of rejecting', async () => {
  const result = await resolve({amount: 'invalid'});
  assert.deepEqual(result.values, {});
  assert.deepEqual(Object.keys(result.errors).sort(), ['amount', 'category', 'date']);
  assert.equal(result.errors.amount.message, 'Informe um numero.');
  assert.equal(result.errors.category.message, 'Selecione a categoria.');
  assert.equal(result.errors.date.message, 'Informe a data.');
});

test('resolver preserves numeric constraints and cross-field refinement errors', async () => {
  const date = new Date('2026-11-10T12:00:00Z');
  const nonpositive = await resolve({amount: '0', category: 'rent', date});
  assert.equal(nonpositive.errors.amount.message, 'Use um valor positivo.');
  const refined = await resolve({amount: '101', category: 'services', date});
  assert.equal(refined.errors.amount.message, 'Limite de servicos excedido.');
});
