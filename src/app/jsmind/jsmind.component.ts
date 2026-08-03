import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { IHealthData } from '../Interfaces/ihealth-data';
import { IMindMapData } from '../Interfaces/mindmap-interface';
import { MindmapService } from '../services/mindmap.service';
import { Result, Ok, Err } from '@sniptt/monads';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModaldialogComponent } from '../modaldialog/modaldialog.component';
import { ModaladdhealthdataComponent } from '../modaladdhealthdata/modaladdhealthdata.component';
import { ModaledithealthdataComponent } from '../modaledithealthdata/modaledithealthdata.component';
import { FileService } from '../services/file.service';
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
  @HostListener('window:beforeunload', ['$event']) unloadHandler(event: Event) {
    let result = confirm('Changes you made may not be saved.');
    if (result) {
      // Do more processing...
    }
    event.returnValue = false; // stay on same page
  }
  constructor(
    private dataService: MindmapService,
    private _modalService: NgbModal,
    private _fileService: FileService,
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
      alert(isAdd.unwrapErr());
    } else {
      hdata = { text: '' };
      this.isShown = false;
    }
  }
  addShow() {
    //this.isShown = true;
    let selectedNode = this.mindMap.get_selected_node();
    if (!selectedNode) {
      alert('Please Select Node');
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
          alert(isAdd.unwrapErr());
        }
      }
    });
  }
  editNodeData() {
    let selectedNode = this.mindMap.get_selected_node();
    console.log(selectedNode);
    if (!selectedNode) {
      alert('Please Select Node');
      return;
    }
    let modal = this._modalService.open(ModaledithealthdataComponent, {
      backdrop: true,
      size: 'xl',
    }); 

    modal.componentInstance.healthdata = {...selectedNode.data,topic:selectedNode.topic};
    modal.result.then((res: IMindMapData) => {
      if (res) {
        let isEdit = this.editNode(res);
        if (isEdit.isErr()) {
          alert(isEdit.unwrapErr());
        }
      }
    });
  }
  addNode(mmData: IMindMapData): Result<string, string> {
    let selectedNode = this.mindMap.get_selected_node();
    if (!selectedNode) return Err('Please Select Node');
    this.mindMap.add_node(selectedNode, mmData.id, mmData.topic, this.getMindmapAdditionalData(mmData));
    return Ok('Node Added');
  }
  editNode(mmData: IMindMapData): Result<string, string> {
    let selectedNode = this.mindMap.get_selected_node();
    if (!selectedNode) return Err('Please Select Node');
    this.mindMap.update_node(selectedNode.id, mmData.topic);
    selectedNode.data = this.getMindmapAdditionalData(mmData);
    return Ok('Node Edited');
  }

  deleteNode() {
    let selectedNode = this.mindMap.get_selected_node();
    if (!selectedNode) {
      alert('Please Select Node to delete');
    } else {
      if(selectedNode.isroot){
        alert("Parent Node cannot be deleted");
      } else {
        let answer = window.confirm('Are you sure you want to delete node?');
        if (answer) {
          this.mindMap.remove_node(selectedNode);
          // alert('Node deleted');
        }
      }
    }
  }
  getJsonData() {
    var mind_data = this.mindMap.get_data('node_tree');
    var mind_name = mind_data.meta.name;
    var helth_data = this.dataService.getHealthData(mind_data.data);
    this._fileService.writeToFile(helth_data, jsMind.util.file, mind_name);
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

  getMindmapAdditionalData(mmData:IMindMapData){
    let node_data: any = {...mmData};
    delete node_data.id;
    delete node_data.topic;
    return node_data;
  }
}
