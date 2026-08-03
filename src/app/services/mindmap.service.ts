import { Injectable } from '@angular/core';
import { IMindMapData } from '../Interfaces/mindmap-interface';
import { BehaviorSubject } from 'rxjs';
import { IHealthData } from '../Interfaces/ihealth-data';

@Injectable({
  providedIn: 'root',
})
export class MindmapService {
  private mockData: IHealthData = {
    id: 'ID_1000991358',
    text: 'Enter Text',
    perform_physical_exam:
      'Abdomen:Scars;Abdomen:Distension;Abdomen:Tenderness;Abdomen:Lumps;Abdomen:Rebound tenderness;Abdomen:Peristaltic sound;Physical Growth:Sexual Maturation;',
    display_or: 'ପେଟଯନ୍ତ୍ରଣା',
    display_hi: 'पेट दर्द ',
    display_mr: 'पोट दुखणे'
  };
  private dataSubject = new BehaviorSubject<IMindMapData>(
    this.getMindMapData(this.mockData)
  );
  $data = this.dataSubject.asObservable();

  getMindMapData(healthdata?: IHealthData): IMindMapData {
    let item: IMindMapData = { topic: ''};
    if (healthdata) {
      item.id = healthdata.id;
      item.index = healthdata.index;
      item.topic = healthdata.text;
      item.perform_physical_exam = healthdata.perform_physical_exam;
      item.display = healthdata.display;
      item.isRequired = healthdata.isRequired;
      item.multi_choice = healthdata.multi_choice;
      item.exclude_from_multi_choice = healthdata.exclude_from_multi_choice;
      item.display_or = healthdata.display_or;
      item.display_hi = healthdata.display_hi;
      item.display_mr = healthdata.display_mr;
      item.pop_up = healthdata.pop_up;
      item.pop_up_hi = healthdata.pop_up_hi;
      item.pop_up_or = healthdata.pop_up_or;
      item.pop_up_mr = healthdata.pop_up_mr;
      item.language = healthdata.language;
      item.input_type = healthdata.input_type;
      item.gender = healthdata.gender;
      item.age_min = healthdata.age_min;
      item.age_max = healthdata.age_max;
      item.range_min = healthdata.range_min;
      item.range_max = healthdata.range_max;
      item.pos_condition = healthdata.pos_condition;
      item.neg_condition = healthdata.neg_condition;
      item.citation = healthdata.citation;
      item.snomed = healthdata.snomed;
      item.icd_11 = healthdata.icd_11;
      item.loinc = healthdata.loinc;
      item.job_aid_type = healthdata.job_aid_type;
      item.job_aid_file = healthdata.job_aid_file;
      item.associated_complaint = healthdata.associated_complaint;
      item.children = [];
      if (healthdata.options && healthdata.options.length > 0) {
        healthdata.options.forEach((element, index) => {
          let mmdata = this.getMindMapData(element);
          mmdata.direction = index % 2 === 0 ? 'left' : 'right';
          item.children?.push(mmdata);
        });
      }
    }
    return item;
  }
  resetNodeRules(data: IMindMapData): void {
    data.input_type = '';
    data.gender = '';
    data.age_min = undefined;
    data.age_max = undefined;
    data.isRequired = null as any;
    data.multi_choice = null as any;
    data.exclude_from_multi_choice = null as any;
    data.display = '';
    data.having_nested_question = null as any;
    data.compare_duplicate_node = '';
    data.enable_exclusive_option = null as any;
    data.is_exclusive_option = null as any;
    data.language = '';
    data.range_min = undefined;
    data.range_max = undefined;
    data.index = undefined;
  }

  getHealthData(mmdata?: IMindMapData): IHealthData {
    let item: IHealthData = { text: '' };
    if (mmdata) {
      item.id = mmdata.id;
      item.index = mmdata.index;
      item.text = mmdata.topic;
      item.perform_physical_exam = mmdata.perform_physical_exam;
      item.display = mmdata.display;
      item.isRequired = mmdata.isRequired;
      item.multi_choice = mmdata.multi_choice;
      item.exclude_from_multi_choice = mmdata.exclude_from_multi_choice;
      item.having_nested_question = mmdata.having_nested_question;
      item.compare_duplicate_node = mmdata.compare_duplicate_node;
      item.enable_exclusive_option = mmdata.enable_exclusive_option;
      item.is_exclusive_option = mmdata.is_exclusive_option;
      item.display_or = mmdata.display_or;
      item.display_hi = mmdata.display_hi;
      item.display_mr = mmdata.display_mr;
      item.pop_up = mmdata.pop_up;
      item.pop_up_hi = mmdata.pop_up_hi;
      item.pop_up_or = mmdata.pop_up_or;
      item.pop_up_mr = mmdata.pop_up_mr;
      item.language = mmdata.language;
      item.input_type = mmdata.input_type;
      item.gender = mmdata.gender;
      item.age_min = mmdata.age_min;
      item.age_max = mmdata.age_max;
      item.range_min = mmdata.range_min;
      item.range_max = mmdata.range_max;
      item.pos_condition = mmdata.pos_condition;
      item.neg_condition = mmdata.neg_condition;
      item.citation = mmdata.citation;
      item.snomed = mmdata.snomed;
      item.icd_11 = mmdata.icd_11;
      item.loinc = mmdata.loinc;
      item.job_aid_type = mmdata.job_aid_type;
      item.job_aid_file = mmdata.job_aid_file;
      item.associated_complaint = mmdata.associated_complaint;
      item.options = [];
      if (mmdata.children && mmdata.children.length > 0) {
        mmdata.children.forEach((element) => {
          item.options?.push(this.getHealthData(element));
        });
      }
    }
    return item;
  }
}
