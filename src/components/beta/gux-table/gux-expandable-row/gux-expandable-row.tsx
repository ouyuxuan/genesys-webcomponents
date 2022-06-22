import { Component, Element, Prop, JSX, h, Listen } from '@stencil/core';

import { randomHTMLId } from '../../../../utils/dom/random-html-id';

@Component({
  styleUrl: 'gux-expandable-row.less',
  tag: 'gux-expandable-row',
  shadow: true
})
export class GuxExpandableRow {
  private buttonElement: HTMLButtonElement;

  @Element()
  root: HTMLElement;

  private id: string = randomHTMLId('gux-expandable-row');

  @Prop()
  expanded: boolean = false;

  @Listen('guxexpanded')
  onCheck(event: CustomEvent): void {
    event.stopPropagation();

    this.expanded = !this.expanded;
    console.log('expanded');
  }

  render(): JSX.Element {
    return (
      <button type="button" id={this.id} aria-expanded={this.expanded}>
        <slot />
      </button>
    ) as JSX.Element;
  }
}
