import { newSparkE2EPage, a11yCheck } from '../../../../../tests/e2eTestUtils';

describe('gux-month-calendar-beta', () => {
  it('renders', async () => {
    const page = await newSparkE2EPage({
      html: '<gux-month-calendar-beta lang="en"></gux-month-calendar-beta>'
    });
    const element = await page.find('gux-month-calendar-beta');
    await a11yCheck(page);

    expect(element).toHaveAttribute('hydrated');
  });
});
