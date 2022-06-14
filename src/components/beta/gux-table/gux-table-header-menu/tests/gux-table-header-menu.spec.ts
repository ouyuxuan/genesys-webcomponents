import { newSpecPage } from '@stencil/core/testing';
import { GuxTableHeaderMenu } from '../gux-table-header-menu';

const components = [GuxTableHeaderMenu];
const language = 'en';

describe('gux-table-header-popover', () => {
  it('should build', async () => {
    const html = `
      <gux-table-header-menu>
        <gux-all-row-select></gux-all-row-select>
        <gux-list slot="header-menu-options">
          <gux-list-item onclick="notify(event)">
            All on page
          </gux-list-item>
          <gux-list-item onclick="notify(event)"> None </gux-list-item>
          <gux-list-item onclick="notify(event)">
            Bring selected to top
          </gux-list-item>
        </gux-list>
      </gux-table-header-menu>
    `;
    const page = await newSpecPage({ components, html, language });

    expect(page.rootInstance).toBeInstanceOf(GuxTableHeaderMenu);
  });
});
