import { newSpecPage } from '@stencil/core/testing';
import MutationObserver from 'mutation-observer';

import { GuxFormFieldTimepicker } from '../gux-form-field-timepicker';

const components = [GuxFormFieldTimepicker];
const language = 'en';

describe('gux-form-field-timepicker-beta', () => {
  beforeEach(async () => {
    (
      global as NodeJS.Global & {
        MutationObserver: any;
      }
    ).MutationObserver = MutationObserver;
  });

  it('should build', async () => {
    const html = `
      <gux-form-field-timepicker-beta>
        <input slot="input" type="time"/>
        <label slot="label">Label</label>
        <span slot="error">Error message</span>
      </gux-form-field-timepicker-beta>
    `;
    const page = await newSpecPage({ components, html, language });

    expect(page.rootInstance).toBeInstanceOf(GuxFormFieldTimepicker);
  });

  describe('#render', () => {
    describe('label-position', () => {
      [
        '',
        'label-position="above"',
        'label-position="beside"',
        'label-position="screenreader"'
      ].forEach((componentAttribute, index) => {
        it(`should render component as expected (${index + 1})`, async () => {
          const html = `
            <gux-form-field-timepicker-beta ${componentAttribute}>
              <input slot="input" type="time"/>
              <label slot="label">Label</label>
            </gux-form-field-timepicker-beta>
          `;
          const page = await newSpecPage({ components, html, language });

          expect(page.root).toMatchSnapshot();
        });
      });
    });

    describe('intervals', () => {
      ['interval="15"', 'interval="30"', 'interval="60"'].forEach(
        (componentAttribute, index) => {
          it(`should render component as expected (${index + 1})`, async () => {
            const html = `
            <gux-form-field-timepicker-beta ${componentAttribute}>
              <input slot="input" type="time"/>
              <label slot="label">Label</label>
            </gux-form-field-timepicker-beta>
          `;
            const page = await newSpecPage({ components, html, language });

            expect(page.root).toMatchSnapshot();
          });
        }
      );
    });
  });
});
