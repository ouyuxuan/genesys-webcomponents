import { Component, h, Prop, Element } from '@stencil/core';
import { trackComponent } from '../../../usage-tracking';
import { DateTimeFormatter, GuxDateTimeFormat } from '../../../i18n/DateTimeFormatter';
import { getDesiredLocale } from '../../../i18n/index';

@Component({
  styleUrl: 'gux-date-time.less',
  tag: 'gux-date-time-beta',
  shadow: true
})
export class GuxDateTime {
  private formatter : DateTimeFormatter;

  /**
   * Reference to the host element.
   */
  @Element()
  root: HTMLElement;

  /**
   * The Date object to format 
   */
  @Prop()
  date: Date = new Date();

  /**
   * Format option type 
   */
  @Prop()
  format: GuxDateTimeFormat = 'full';

  componentWillLoad(): void {
    trackComponent(this.root);
    this.formatter = new DateTimeFormatter(getDesiredLocale(this.root));
  }

  render() {
    return (<span>{ this.formatter.formatDateTime(this.date, this.format) }</span>);
  }
}
