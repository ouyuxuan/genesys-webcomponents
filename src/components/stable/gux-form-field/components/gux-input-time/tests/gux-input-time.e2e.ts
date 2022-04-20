import {
  newSparkE2EPage,
  a11yCheck
} from '../../../../../../../tests/e2eTestUtils';

const axeExclusions = [
  {
    issueId: 'label',
    target: 'input',
    exclusionReason:
      'gux-input-time is used within the gux-form-field component which provides a label'
  }
];

describe('gux-input-time', () => {
  it('renders', async () => {
    const html = `
      <gux-input-time lang="en">
        <input slot="input" type="time">
      </gux-input-time>
    `;
    const page = await newSparkE2EPage({ html });
    const element = await page.find('gux-input-time');
    await a11yCheck(page, axeExclusions);

    expect(element).toHaveClass('hydrated');
  });
});
