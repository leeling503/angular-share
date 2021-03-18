import { CdkOverlayOrigin, OverlayRef, Overlay } from '@angular/cdk/overlay';
import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { SelectOption, SelectConfig, SelectInput, SelectInputType } from './share-select.model';
import { shareIsEmpty, shareIsEqual } from 'share-libs/src/utils/util';
@Component({
  selector: 'share-select',
  templateUrl: './share-select.component.html',
  styleUrls: ['./share-select.component.less']
})
export class ShareSelectComponent implements OnInit {
  constructor(private overlay: Overlay, private el: ElementRef) {
    this.nativeEl = this.el.nativeElement;
  }
  nativeEl: HTMLElement;
  @Input() selectConfig: SelectConfig = new SelectConfig();
  @Input() selectOptions: SelectOption[] = [];
  @Input() selectOption: SelectInput;
  activeNodes: SelectOption[] = [];
  activeValues: any[] = [];
  optionsOpen: boolean = false;
  inputType: SelectInputType;
  cdkConnectedOverlayWidth: number | string;
  outNodes: SelectInput = undefined;
  @ViewChild(CdkOverlayOrigin, { static: true }) cdkOverlayOrigin: CdkOverlayOrigin;
  @Output() emitOptionChange: EventEmitter<SelectInput> = new EventEmitter();
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectOption && changes.selectOption.firstChange) {
      let option = this.selectOption;
      if (Array.isArray(option)) {
        this.selectConfig.multi = true;
        let input = option[0];
        this.inputType = typeof input == 'string' || typeof input == 'number' ? 'string' : 'SelectOption';
      } else {
        this.inputType = typeof option == 'string' || typeof option == 'number' ? 'string' : 'SelectOption';
      }
    }
    if (changes.selectOptions) {
      this.setActiveNode()
    }
  }

  ngOnInit() {
    this.selectConfig = Object.assign(new SelectConfig(), this.selectConfig)
    this.setActiveNode();
    this.setOpenWidth(this.selectConfig.openWidth);
  }

  setOpenWidth(width?: number | string) {
    if (width) {
      this.cdkConnectedOverlayWidth = this.selectConfig.openWidth;
    } else {
      this.nativeEl = this.nativeEl.querySelector('.share-select')
      let rect = this.nativeEl.getBoundingClientRect();
      this.cdkConnectedOverlayWidth = rect.width;
    }
  }

  setActiveNode() {
    this.activeValues = [];
    this.activeNodes = [];
    if (this.selectConfig.leastOne && shareIsEmpty(this.selectOption) && !shareIsEmpty(this.selectOptions)) {
      let option = this.selectOptions && this.selectOptions[0]
      if (this.inputType == 'string') {
        this.selectOption = option.value
      } else {
        this.selectOption = option
      }
      this.outNodes = this.selectOption;
      Promise.resolve().then(
        res => this.emitOptionChange.emit(this.outNodes)
      )
    }
    if (shareIsEmpty(this.selectOption) || shareIsEmpty(this.selectOptions)) {
      this.activeNodes = [];
      return
    } else if (typeof this.selectOption == 'string' || typeof this.selectOption == 'number') {
      let value = this.selectOption;
      this.activeValues.push(value)
    } else if (Array.isArray(this.selectOption)) {
      this.selectOption.forEach(e => {
        let value = e.value || e;
        this.activeValues.push(value);
      })
    } else {
      let value = this.selectOption.value;
      this.activeValues.push(value)
    }
    this.getNode()
  }

  getNode() {
    this.selectOptions.forEach(e => {
      if (this.activeValues.includes(e.value)) {
        this.activeNodes.push(e);
      }
      if (e.children && e.children.length > 0) {
        e.showChild = this.inChildren(e, e.children, this.activeValues)
      }
    })
  }

  inChildren(node: SelectOption, nodes: SelectOption[], values: string[]): boolean {
    for (let i = 0, len = nodes.length; i < len; i++) {
      let e = nodes[i]
      if (values.includes(e.value)) {
        node.showChild = false;
        this.activeNodes.push(e);
        return true;
      } else if (e.children && e.children.length > 0) {
        node.showChild = this.inChildren(e, e.children, values)
        return node.showChild
      }
    }
    return !1;
  }

  clickClearNodes() {
    event.stopPropagation();
    this.activeNodes = [];
    this.activeValues = [];
    this.closeOptions();
  }

  clickClearNode(node: SelectOption) {
    event.stopPropagation();
    let index = this.activeValues.findIndex(e => e === node.value)
    this.activeNodes.splice(index, 1);
    this.activeValues.splice(index, 1);
    this.closeOptions();
  }

  clickToggleOpen() {
    this.optionsOpen = !this.optionsOpen;
  }

  onClickOptionNode(option: SelectOption) {
    event.stopPropagation();
    let value = option.value;
    if (this.selectConfig.multi) {
      if (this.activeValues.includes(value)) {
        this.activeValues = this.activeValues.filter(e => e != value);
        this.activeNodes = this.activeNodes.filter(e => e.value != value);
      } else {
        this.activeNodes.push(option);
        this.activeValues.push(option.value);
      }
      return;
    } else {
      this.activeNodes = [option];
      this.activeValues = [value]
    }
    this.closeOptions();
  }

  onClickOptionChild(option: SelectOption) {
    event.stopPropagation();
    option.showChild = !option.showChild;
  }

  closeOptions() {
    this.optionsOpen = !1;
    this.setOutNodes()
  }

  setOutNodes() {
    let outNodes;
    if (this.inputType == 'string') {
      outNodes = this.activeValues;
    } else {
      outNodes = this.activeNodes;
    }
    if (!this.selectConfig.multi) {
      outNodes = outNodes[0];
    }
    if (shareIsEqual(outNodes, this.outNodes)) {
      return
    }
    this.outNodes = outNodes;
    this.emitOptionChange.emit(outNodes);
  }

  backdropClick() {
    this.closeOptions();
  }

}
