import { Injectable } from '@angular/core';
import { IHealthData } from '../Interfaces/ihealth-data';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private dataDictionary: any = {
    id: 'id',
    index: 'index',
    text: 'text',
    'perform-physical-exam': 'perform_physical_exam',
    display: 'display',
    isRequired: 'isRequired',
    'multi-choice': 'multi_choice',
    'exclude-from-multi-choice': 'exclude_from_multi_choice',
    'havingNestedQuestion':'having_nested_question',
    'compare-duplicate-node':'compare_duplicate_node',
    'enable-exclusive-option':'enable_exclusive_option',
    'is-exclusive-option':'is_exclusive_option',
    'display-or': 'display_or',
    'display-hi': 'display_hi',
    'display-mr': 'display_mr',
    'pop-up': 'pop_up',
    'pop-up-hi': 'pop_up_hi',
    'pop-up-or': 'pop_up_or',
    'pop-up-mr': 'pop_up_mr',
    language: 'language',
    'input-type': 'input_type',
    gender: 'gender',
    'age-min': 'age_min',
    'age-max': 'age_max',
    'range-min': 'range_min',
    'range-max': 'range_max',
    'pos-condition': 'pos_condition',
    'neg-condition': 'neg_condition',
    citation: 'citation',
    snomed: 'snomed',
    'icd-11': 'icd_11',
    loinc: 'loinc',
    'job-aid-type': 'job_aid_type',
    'job-aid-file': 'job_aid_file',
    'associated-complaint': 'associated_complaint',
  };
  globalData: IHealthData = {
    text: '',
  };
  constructor() {}
  public readFile(file: File): Promise<IHealthData> {
    var reader = new FileReader();
    let data: IHealthData = { text: '' };
    return new Promise<IHealthData>((resolve, reject) => {
      try {
        reader.onload = () => {
          //console.log(reader.result);
          if (reader.result) {
            let data = JSON.parse(reader.result?.toString());
            this.globalData = this.getHealthData(data);
            resolve(this.globalData);
          }
        };
        reader.readAsText(file);
      } catch (e) {
        return reject(e);
      }
    });
  }

  public getdata(): IHealthData {
    return this.globalData;
  }
  private getHealthData(data: any): IHealthData {
    let item: any = {
      text: '',
    };
    if (data) {
      let datakey = Object.keys(this.dataDictionary);
      datakey.forEach((key) => {
        let val: string = this.dataDictionary[key].toString();
        item[val] = data[key];
      });
      item.options = [];
      if (data.options && data.options.length > 0) {
        data.options.forEach((element: any) => {
          item.options?.push(this.getHealthData(element));
        });
      }
    }
    return item as IHealthData;
  }
  private getDataForFile(data: any): any {
    let item: any = {
      text: '',
    };
    if (data) {
      let datakey = Object.keys(this.dataDictionary);
      datakey.forEach((key) => {
        let val: string = this.dataDictionary[key].toString();
        item[key] = data[val];
      });
      item.options = [];
      if (data.options && data.options.length > 0) {
        data.options.forEach((element: any) => {
          item.options?.push(this.getDataForFile(element));
        });
      }
    }
    return item;
  }
  writeToFile(heathdata: IHealthData, fileSaver: any, fileName: string) {
    let data = this.getDataForFile(heathdata);
    let mind_str = JSON.stringify(data, undefined, 4);
    fileSaver.save(mind_str, 'text/json', fileName + '.json');
  }
}
