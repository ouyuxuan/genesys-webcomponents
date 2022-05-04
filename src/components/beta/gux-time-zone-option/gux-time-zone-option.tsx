import { Component, Element, h, Host, JSX, Listen, Prop } from '@stencil/core';

import { randomHTMLId } from '../../../utils/dom/random-html-id';

@Component({
  styleUrl: 'gux-time-zone-option.less',
  tag: 'gux-time-zone-option-beta'
})
export class GuxTimeZoneOption {
  @Element()
  root: HTMLElement;

  @Prop({ mutable: true })
  value: string;

  @Prop()
  timezone: string;

  @Prop()
  offset: number;

  @Prop()
  active: boolean = false;

  @Prop()
  selected: boolean = false;

  @Prop()
  disabled: boolean = false;

  @Prop()
  filtered: boolean = false;

  @Prop({ mutable: true })
  hovered: boolean = false;

  @Listen('mouseenter')
  onmouseenter() {
    this.hovered = true;
  }

  @Listen('mouseleave')
  onMouseleave() {
    this.hovered = false;
  }

  componentWillLoad(): void {
    this.root.id = this.root.id || randomHTMLId('gux-time-zone-option-beta');
    this.formatTimeZoneOption(this.timezone, this.offset);
  }

  private getAriaSelected(): boolean | string {
    if (this.disabled) {
      return false;
    }

    return this.selected ? 'true' : 'false';
  }

  private formatOffset(offset: number) {
    const mins = Math.abs(offset) % 60;
    const formattedMins = mins.toString().padStart(2, '0');

    const hrs = Math.floor(Math.abs(offset) / 60);
    const formattedHrs = hrs.toString().padStart(2, '0');

    if (offset >= 0) {
      return `+${formattedHrs}:${formattedMins}`;
    }
    return `-${formattedHrs}:${formattedMins}`;
  }

  private formatTimeZoneOption(timezone: string, offset: number) {
    const utcOffset = this.formatOffset(offset);
    this.value = `${timezone} (${utcOffset})`;
  }

  render(): JSX.Element {
    return (
      <Host
        role="option"
        class={{
          'gux-active': this.active,
          'gux-disabled': this.disabled,
          'gux-filtered': this.filtered,
          'gux-hovered': this.hovered,
          'gux-selected': this.selected
        }}
        aria-selected={this.getAriaSelected()}
        aria-disabled={this.disabled.toString()}
        timezone={this.timezone}
        offset={this.offset}
      >
        {this.value}
      </Host>
    ) as JSX.Element;
  }
}
