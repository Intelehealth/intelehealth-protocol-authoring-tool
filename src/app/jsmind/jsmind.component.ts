import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { IHealthData } from '../Interfaces/ihealth-data';
import { IMindMapData } from '../Interfaces/mindmap-interface';
import { MindmapService } from '../services/mindmap.service';
import { Result, Ok, Err } from '@sniptt/monads';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModaldialogComponent } from '../modaldialog/modaldialog.component';
import { ModaladdhealthdataComponent } from '../modaladdhealthdata/modaladdhealthdata.component';
import { ModaledithealthdataComponent } from '../modaledithealthdata/modaledithealthdata.component';
import { FieldGuideComponent } from '../field-guide/field-guide.component';
import { FileService } from '../services/file.service';
import { FhirService } from '../services/fhir.service';
import { AlertService } from '../services/alert.service';
import { Router } from '@angular/router';
declare var jsMind: any;
const options = {
  container: 'jsmind_container',
  editable: true,
  mode: 'full',
  format: 'node_tree',
  support_html: true, // Does it support HTML elements in the node?
  view: {
    engine: 'canvas', // engine for drawing lines between nodes in the mindmap
    hmargin: 100, // Minimum horizontal distance of the mindmap from the outer frame of the container
    vmargin: 50, // Minimum vertical distance of the mindmap from the outer frame of the container
    line_width: 1, // thickness of the mindmap line
    line_color: '#555', // Thought mindmap line color
    draggable: true, // Drag the mind map with your mouse, when it's larger that the container
    hide_scrollbars_when_draggable: false, // Hide container scrollbars, when mind map is larger than container and draggable option is true.
  },
  layout: {
    hspace: 100, // horizontal spacing between nodes
    vspace: 25, // vertical spacing between nodes
    pspace: 10, // Horizontal spacing between node and connection line (to place node expander)
  },
  shortcut: {
    enable: true, // whether to enable shortcut
    handles: {
      enable_mousedown_handle: true,
      enable_click_handle: true,
      enable_dblclick_handle: true,
      enable_mousewheel_handle: true,
    },
    mapping: {
      // shortcut key mapping
      addchild: 45, // <Insert>
      addbrother: 13, // <Enter>
      editnode: 113, // <F2>
      delnode: 46, // <Delete>
      left: 37, // <Left>
      up: 38, // <Up>
      right: 39, // <Right>
      down: 40, // <Down>
    },
  },
};
@Component({
  selector: 'app-jsmind',
  templateUrl: './jsmind.component.html',
  styleUrls: ['./jsmind.component.css'],
})
export class JsmindComponent implements OnInit {
  isNew: boolean = true;
  file?: any;
  mindMap: any;
  title = 'Mindmap-SPA';
  isShown: boolean = false;
  clipboard: IMindMapData | null = null;
  @HostListener('window:beforeunload', ['$event']) unloadHandler(event: Event) {
    event.returnValue = false; // triggers the browser's native "leave page?" dialog
  }
  constructor(
    private dataService: MindmapService,
    private _modalService: NgbModal,
    private _fileService: FileService,
    private _fhirService: FhirService,
    private _alertService: AlertService,
    private _router: Router
  ) {
    let show = this._router.getCurrentNavigation()?.extras.state;
    if (show) {
      this.isNew = show.isNew;
    }
  }

  ngOnInit() {
    this.mindMap = new jsMind(options);
  }
  ngAfterViewInit() {
    if (this.isNew) {
      this.dataService.$data.subscribe((data) => {
        var mind = {
          meta: {
            name: 'sample',
            // author: 'hizzgdev@163.com',
            // version: '0.2',EB9357
          },
          format: 'node_tree',
          data: data
        };
        this.mindMap.show(mind);
      });
    } else {
      let data = this._fileService.getdata();
      let mmData = this.dataService.getMindMapData(data);
      var mind = {
        meta: {
          name: 'sample',
          // author: 'hizzgdev@163.com',
          // version: '0.2',EB9357
        },
        format: 'node_tree',
        data: mmData,
      };
      this.mindMap.show(mind);
    }
  }
  saveData(hdata: IHealthData) {
    let mmData = this.dataService.getMindMapData(hdata);
    let isAdd = this.addNode(mmData);
    if (isAdd.isErr()) {
      this._alertService.showAlert(isAdd.unwrapErr());
    } else {
      hdata = { text: '' };
      this.isShown = false;
    }
  }
  addShow() {
    let selectedNode = this.mindMap.get_selected_node();
    if (!selectedNode) {
      this._alertService.showAlert('Please Select Node');
      return;
    }

    let modal = this._modalService.open(ModaladdhealthdataComponent, {
      backdrop: true,
      size: 'xl',
    });
    modal.result.then((res: IMindMapData) => {
      if (res) {
        let isAdd = this.addNode(res);
        if (isAdd.isErr()) {
          this._alertService.showAlert(isAdd.unwrapErr());
        }
      }
    });
  }
  editNodeData() {
    let selectedNode = this.mindMap.get_selected_node();
    console.log(selectedNode);
    if (!selectedNode) {
      this._alertService.showAlert('Please Select Node');
      return;
    }
    let modal = this._modalService.open(ModaledithealthdataComponent, {
      backdrop: true,
      size: 'xl',
    });

    const strippedTopic = selectedNode.topic.replace(/<[^>]*>/g, '').trim();
    const nodeIndex = selectedNode.data?.index;
    const plainTopic = (nodeIndex !== undefined && nodeIndex !== null)
      ? (strippedTopic.startsWith(`${nodeIndex} `) ? strippedTopic.slice(`${nodeIndex} `.length) : strippedTopic)
      : strippedTopic;
    modal.componentInstance.healthdata = {...selectedNode.data, topic: plainTopic};
    modal.result.then((res: IMindMapData) => {
      if (res) {
        let isEdit = this.editNode(res);
        if (isEdit.isErr()) {
          this._alertService.showAlert(isEdit.unwrapErr());
        }
      }
    });
  }
  getDisplayTopic(mmData: IMindMapData): string {
    return (mmData.index !== undefined && mmData.index !== null)
      ? `<span class="node-index-badge">${mmData.index}</span> ${mmData.topic}`
      : mmData.topic;
  }
  addNode(mmData: IMindMapData): Result<string, string> {
    let selectedNode = this.mindMap.get_selected_node();
    if (!selectedNode) return Err('Please Select Node');
    this.mindMap.add_node(selectedNode, mmData.id, this.getDisplayTopic(mmData), this.getMindmapAdditionalData(mmData));
    return Ok('Node Added');
  }
  editNode(mmData: IMindMapData): Result<string, string> {
    let selectedNode = this.mindMap.get_selected_node();
    if (!selectedNode) return Err('Please Select Node');
    this.mindMap.update_node(selectedNode.id, this.getDisplayTopic(mmData));
    selectedNode.data = this.getMindmapAdditionalData(mmData);
    return Ok('Node Edited');
  }

  async deleteNode() {
    let selectedNode = this.mindMap.get_selected_node();
    if (!selectedNode) {
      this._alertService.showAlert('Please Select Node to delete');
      return;
    }
    if (selectedNode.isroot) {
      this._alertService.showAlert('Parent Node cannot be deleted');
      return;
    }
    let answer = await this._alertService.showConfirm(
      'Are you sure you want to delete node?',
      'Confirm Delete'
    );
    if (answer) {
      this.mindMap.remove_node(selectedNode);
    }
  }
  getJsonData() {
    var mind_data = this.mindMap.get_data('node_tree');
    var mind_name = mind_data.data.topic || mind_data.meta.name;
    var helth_data = this.dataService.getHealthData(mind_data.data);
    this._fileService.writeToFile(helth_data, jsMind.util.file, mind_name);
  }
  getFhirData() {
    var mind_data = this.mindMap.get_data('node_tree');
    var mind_name = mind_data.data.topic || mind_data.meta.name;
    var helth_data = this.dataService.getHealthData(mind_data.data);
    var protocol_data = this._fileService.getFileData(helth_data);
    this._fhirService.writeToFile(protocol_data, jsMind.util.file, mind_name);
  }
  handleFileInput(event: Event) {
    this.file = (event.target as HTMLInputElement).files?.item(0);
    this.readFile(this.file);
  }
  async readFile(file: File) {
    let healthdata = await this._fileService.readFile(file);
    let mmData = this.dataService.getMindMapData(healthdata);
    var mind = {
      meta: {
        name: 'sample',
        // author: 'hizzgdev@163.com',
        // version: '0.2',
      },
      format: 'node_tree',
      data: mmData,
    };
    this.mindMap.show(mind);
    var root = this.mindMap.get_root();
    this.mindMap.set_node_color(root.id, '#FFA500', null);
  }
  zoomin() {
    this.mindMap.view.zoomIn();
  }
  zoomout() {
    this.mindMap.view.zoomOut();
  }
  expandNode() {
    this.mindMap.expand_all();
  }
  collapseNode() {
    this.mindMap.collapse_all();
  }

  openFieldGuide() {
    this._modalService.open(FieldGuideComponent, {
      size: 'xl',
      scrollable: true,
    });
  }

  async copyNode() {
    const selectedNode = this.mindMap.get_selected_node();
    if (!selectedNode) {
      await this._alertService.showAlert('Please select a node to copy');
      return;
    }
    this.clipboard = this.cloneSubtree(selectedNode);
    this._alertService.showAlert('Node copied! Select a parent node and click Paste.');
  }

  private cloneSubtree(node: any): IMindMapData {
    const strippedTopic = node.topic.replace(/<[^>]*>/g, '').trim();
    const nodeIndex = node.data?.index;
    const plainTopic = (nodeIndex !== undefined && nodeIndex !== null)
      ? (strippedTopic.startsWith(`${nodeIndex} `) ? strippedTopic.slice(`${nodeIndex} `.length) : strippedTopic)
      : strippedTopic;
    return {
      ...node.data,
      topic: plainTopic,
      children: (node.children || []).map((child: any) => this.cloneSubtree(child))
    };
  }

  async pasteNode() {
    if (!this.clipboard) {
      await this._alertService.showAlert('Nothing to paste. Copy a node first.');
      return;
    }
    const selectedNode = this.mindMap.get_selected_node();
    if (!selectedNode) {
      await this._alertService.showAlert('Please select a node to paste under');
      return;
    }
    this.pasteSubtree(this.clipboard, selectedNode);
  }

  private pasteSubtree(data: IMindMapData, parentNode: any) {
    const newId = Math.random().toString();
    this.mindMap.add_node(parentNode, newId, this.getDisplayTopic(data), this.getMindmapAdditionalData(data));
    const newNode = this.mindMap.get_node(newId);
    if (data.children && data.children.length > 0) {
      for (const child of data.children) {
        this.pasteSubtree(child, newNode);
      }
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const tag = (event.target as HTMLElement).tagName.toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
    if (event.ctrlKey && event.key === 'c') { event.preventDefault(); this.copyNode(); }
    if (event.ctrlKey && event.key === 'v') { event.preventDefault(); this.pasteNode(); }
  }

  getMindmapAdditionalData(mmData:IMindMapData){
    let node_data: any = {...mmData};
    delete node_data.id;
    delete node_data.topic;
    return node_data;
  }
}
