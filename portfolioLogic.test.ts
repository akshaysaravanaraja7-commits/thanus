import test from 'node:test';
import assert from 'node:assert/strict';
import {
  INITIAL_PORTFOLIO_DATA,
  filterSkillCategories,
  formatDisplayNameTitleCase,
  toggleSkillSelection,
  validateContactForm,
} from './portfolioLogic';

test('filterSkillCategories returns all categories for "all" and narrows for specific ids', () => {
  const all = filterSkillCategories(INITIAL_PORTFOLIO_DATA.technical_skills, 'all');
  assert.equal(all.length, 4);

  const frameworks = filterSkillCategories(
    INITIAL_PORTFOLIO_DATA.technical_skills,
    'frameworks',
  );
  assert.equal(frameworks.length, 1);
  assert.equal(frameworks[0].title, 'Frameworks');
  assert.deepEqual(frameworks[0].items, ['FastAPI']);
});

test('toggleSkillSelection adds missing skills and removes existing skills immutably', () => {
  const initial = ['Python', 'Java'];
  const added = toggleSkillSelection(initial, 'FastAPI');
  assert.deepEqual(added, ['Python', 'Java', 'FastAPI']);
  assert.deepEqual(initial, ['Python', 'Java']);

  const removed = toggleSkillSelection(added, 'Java');
  assert.deepEqual(removed, ['Python', 'FastAPI']);
});

test('formatDisplayNameTitleCase formats uppercase name into clean editorial title case', () => {
  assert.equal(
    formatDisplayNameTitleCase('AREKATIKA THANUSH LAL'),
    'Arekatika Thanush Lal',
  );
});

test('validateContactForm catches invalid inputs and approves valid inquiries', () => {
  const invalid = validateContactForm({
    name: 'A',
    email: 'bad-email',
    subject: '',
    message: 'Short',
  });
  assert.equal(invalid.isValid, false);
  assert.ok(invalid.errors.name);
  assert.ok(invalid.errors.email);
  assert.ok(invalid.errors.message);

  const valid = validateContactForm({
    name: 'Ananya Rao',
    email: 'ananya@example.com',
    subject: 'B.Tech Software Internship',
    message: 'Hi Thanush, we saw your Student Gap Analyser project and would like to connect.',
  });
  assert.equal(valid.isValid, true);
  assert.deepEqual(valid.errors, {});
});
