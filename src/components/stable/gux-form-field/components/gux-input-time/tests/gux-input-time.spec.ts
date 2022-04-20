import { newSpecPage, SpecPage } from '@stencil/core/testing';
import MutationObserver from 'mutation-observer';

import { GuxInputTime } from '../gux-input-time';

const components = [GuxInputTime];
const language = 'en';

describe('gux-input-time', () => {
  let page: SpecPage;

  beforeEach(async () => {
    global.MutationObserver = MutationObserver;

    page = await newSpecPage({
      components,
      html: `
        <gux-input-time>
          <input type="time" slot="input"/>
        </gux-input-time>
      `,
      language
    });
  });

  it('should build', async () => {
    expect(page.rootInstance).toBeInstanceOf(GuxInputTime);
  });

  it('should render', async () => {
    expect(page.root).toMatchSnapshot();
  });
});
