import {
  Component,
  Element,
  State,
  JSX,
  h,
  Prop,
  Method,
  Listen
} from '@stencil/core';
import { trackComponent } from '../../../../usage-tracking';

@Component({
  tag: 'gux-toolbar-action',
  shadow: true
})
export class GuxToolbarAction {
  /**
   * Reference to the host element.
   */
  @Element()
  root: HTMLElement;

  @State()
  label: string;

  @State()
  active: boolean = false;

  @Prop()
  primary: boolean;

  @Prop()
  icon: string;

  @State()
  iconOnly: boolean = false;

  @Listen('emitLayoutChange', { target: 'body' })
  emitLayoutChangeHandler(event: CustomEvent<boolean>) {
    if (event.detail == true) {
      if (!this.primary) {
        this.iconOnly = true;
      }
    } else {
      this.iconOnly = false;
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  @Method()
  async guxGetActiveAction() {
    return this.active;
  }

  private onSlotChange(event: Event) {
    const slotAssignedNodes = (
      event.composedPath()[0] as HTMLSlotElement
    ).assignedNodes();
    this.label = slotAssignedNodes
      .map(nodeItem => nodeItem.textContent)
      .join('');
  }

  private renderActionTitle(): JSX.Element {
    if (!this.iconOnly) {
      return (
        <span>
          <slot
            aria-hidden="true"
            onSlotchange={this.onSlotChange.bind(this)}
          />
        </span>
      ) as JSX.Element;
    }
  }

  private renderIcon(): JSX.Element {
    if (this.icon) {
      return (
        <gux-icon iconName={this.icon} screenreaderText={this.label} />
      ) as JSX.Element;
    }
  }

  componentWillLoad() {
    trackComponent(this.root);
  }

  render(): JSX.Element {
    return (
      <gux-button accent={this.primary ? 'primary' : null} type="button">
        {this.renderIcon()}
        {this.renderActionTitle()}
      </gux-button>
    ) as JSX.Element;
  }
}
