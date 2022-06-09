import { newSpecPage } from '@stencil/core/testing';
import { GuxAllRowSelect } from '../gux-table-header-menu';

const components = [GuxAllRowSelect];
const language = 'en';

describe('gux-all-row-select', () => {
  it('should build', async () => {
    const html = '<gux-all-row-select></gux-all-row-select>';
    const page = await newSpecPage({ components, html, language });

    expect(page.rootInstance).toBeInstanceOf(GuxAllRowSelect);
  });
});
