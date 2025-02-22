import { newSpecPage } from '@stencil/core/testing';
import MutationObserver from 'mutation-observer';

import { GuxFormFieldTimePicker } from '../gux-form-field-time-picker';
import { GuxScreenReader } from '../../../../../beta/gux-screen-reader/gux-screen-reader';

const components = [GuxFormFieldTimePicker, GuxScreenReader];
const language = 'en';

describe('gux-form-field-time-picker', () => {
  beforeEach(async () => {
    (
      global as NodeJS.Global & {
        MutationObserver: any;
      }
    ).MutationObserver = MutationObserver;
  });

  it('should build', async () => {
    const html = `
      <gux-form-field-time-picker>
        <gux-time-picker-beta></gux-time-picker-beta>
        <label slot="label">Label</label>
        <span slot="error">Error message</span>
      </gux-form-field-time-picker>
    `;
    const page = await newSpecPage({ components, html, language });

    expect(page.rootInstance).toBeInstanceOf(GuxFormFieldTimePicker);
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
            <gux-form-field-time-picker ${componentAttribute}>
              <gux-time-picker-beta value="07:00"></gux-time-picker-beta>
              <label slot="label">Label</label>
            </gux-form-field-time-picker>
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
            <gux-form-field-time-picker>
              <gux-time-picker-beta value="07:00" ${componentAttribute}></gux-time-picker-beta>
              <label slot="label">Label</label>
            </gux-form-field-time-picker>
          `;
            const page = await newSpecPage({ components, html, language });

            expect(page.root).toMatchSnapshot();
          });
        }
      );
    });

    describe('help', () => {
      it('should render component as expected', async () => {
        const html = `
        <gux-form-field-time-picker>
        <gux-time-picker-beta value="09:00"></gux-time-picker-beta>
        <label slot="label">Select Time</label>
        <span slot="help">This is a help message</span>
      </gux-form-field-time-picker>
        `;
        const page = await newSpecPage({ components, html, language });

        expect(page.root).toMatchSnapshot();
      });
    });
  });
});
