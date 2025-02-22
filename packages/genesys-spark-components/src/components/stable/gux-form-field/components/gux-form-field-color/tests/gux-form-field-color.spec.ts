import { newSpecPage } from '@stencil/core/testing';
import MutationObserver from 'mutation-observer';

import { GuxFormFieldColor } from '../gux-form-field-color';

const components = [GuxFormFieldColor];
const language = 'en';

describe('gux-form-field-color', () => {
  beforeEach(async () => {
    (
      global as NodeJS.Global & {
        MutationObserver: any;
      }
    ).MutationObserver = MutationObserver;
  });

  it('should build', async () => {
    const html = `
      <gux-form-field-color>
        <input slot="input" type="color" value="#ff0000"/>
        <label slot="label">Label</label>
        <span slot="error">Error message</span>
      </gux-form-field-color>
    `;
    const page = await newSpecPage({ components, html, language });

    expect(page.rootInstance).toBeInstanceOf(GuxFormFieldColor);
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
            <gux-form-field-color ${componentAttribute}>
              <input slot="input" type="color" value="#ff0000"/>
              <label slot="label">Label</label>
            </gux-form-field-color>
          `;
          const page = await newSpecPage({ components, html, language });

          expect(page.root).toMatchSnapshot();
        });
      });
    });

    describe('input attributes', () => {
      ['', 'disabled', 'required'].forEach((inputAttribute, index) => {
        it(`should render component as expected (${index + 1})`, async () => {
          const html = `
            <gux-form-field-color>
              <input slot="input" type="color" value="#ff0000" ${inputAttribute}/>
              <label slot="label">Label</label>
            </gux-form-field-color>
          `;
          const page = await newSpecPage({ components, html, language });

          expect(page.root).toMatchSnapshot();
        });
      });
    });

    describe('help', () => {
      it('should render component as expected', async () => {
        const html = `
        <gux-form-field-color>
        <input slot="input" type="color" name="e-1" value="#cc3ebe" />
        <label slot="label">Default</label>
        <span slot="help">This is a help message</span>
      </gux-form-field-color>
        `;
        const page = await newSpecPage({ components, html, language });

        expect(page.root).toMatchSnapshot();
      });
    });
  });
});
