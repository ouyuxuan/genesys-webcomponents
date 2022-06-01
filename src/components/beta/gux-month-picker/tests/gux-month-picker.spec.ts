import { newSpecPage } from '@stencil/core/testing';

import { GuxMonthPicker } from '../gux-month-picker';

const components = [GuxMonthPicker];
const language = 'en';

describe('gux-month-picker-beta', () => {
  it('should build', async () => {
    const page = await newSpecPage({
      components,
      html: `<gux-month-picker-beta></gux-month-picker-beta>`,
      language
    });
    expect(page.rootInstance).toBeInstanceOf(GuxMonthPicker);
  });

  describe('#render', () => {
    [
      `<gux-month-picker-beta value="January 2022"></gux-month-picker-beta>`
    ].forEach((input, index) => {
      it(`should render component as expected (${index + 1})`, async () => {
        const page = await newSpecPage({
          components,
          html: input,
          language
        });

        expect(page.root).toMatchSnapshot();
      });
    });
  });
});
