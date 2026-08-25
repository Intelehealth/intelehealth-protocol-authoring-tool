import { Injectable } from '@angular/core';

const CODE_SYSTEM =
  'https://intelehealth.org/fhir/CodeSystem/questionnaire-options';
const EXT_BASE = 'https://intelehealth.org/fhir/StructureDefinition';
const TRANSLATION_EXT = 'http://hl7.org/fhir/StructureDefinition/translation';

const DEDUPLICATE_CHILD_TRANSLATIONS = true;

const EXTENSION_MAP: { [key: string]: string } = {
  display: 'display',
  language: 'language',
  gender: 'gender',
  'age-min': 'age-min',
  age_min: 'age-min',
  age_max: 'age-max',
  'age-max': 'age-max',
  'perform-physical-exam': 'performPhysicalExam',
  'job-aid-type': 'job-aid-type',
  'job-aid-file': 'job-aid-file',
  'associated-complaint': 'associated-complaint',
  'pop-up': 'pop-up',
  'exclude-from-multi-choice': 'exclude-from-multi-choice',
  'enable-exclusive-option': 'enable-exclusive-option',
  'is-exclusive-option': 'is-exclusive-option',
  'compare-duplicate-node': 'compare-duplicate-node',
};

const ANSWER_OPTION_KEYS: { [key: string]: string } = {
  'exclude-from-multi-choice': 'exclude-from-multi-choice',
  'enable-exclusive-option': 'enable-exclusive-option',
  gender: 'gender',
  'age-min': 'age-min',
  age_min: 'age-min',
  age_max: 'age-max',
  'age-max': 'age-max',
};

@Injectable({
  providedIn: 'root',
})
export class FhirService {
  constructor() {}

  writeToFile(protocolData: any, fileSaver: any) {
    const questionnaire = this.buildQuestionnaire(protocolData);
    fileSaver.save(
      JSON.stringify(questionnaire, undefined, 2),
      'application/json',
      this.generateOutputFilename(protocolData)
    );
  }

  buildQuestionnaire(root: any): any {
    const questionnaire: any = {
      resourceType: 'Questionnaire',
      id: this.sanitizeFhirId(root.id),
      title: root.text,
      name: (root.text || '').split(' ').join(''),
      status: 'active',
      publisher: 'www.intelehealth.org',
      language: 'en',
      item: [],
    };

    if (root.citation) {
      questionnaire.description = root.citation;
    }

    const ext = this.buildExtensions(root);
    if (ext.length > 0) {
      questionnaire.extension = ext;
    }

    const translations = this.extractTranslations(root);
    if (translations.length > 0) {
      questionnaire._title = { extension: translations };
    }

    (root.options || []).forEach((node: any) => {
      questionnaire.item.push(this.buildItem(node));
    });

    return questionnaire;
  }

  private isTrue(value: any): boolean {
    return String(value).toLowerCase() === 'true';
  }

  private sanitizeFhirId(value: any): string | null {
    if (!value) {
      return null;
    }
    return String(value)
      .replace(/[^A-Za-z0-9\-.]/g, '-')
      .substring(0, 64);
  }

  private generateOutputFilename(root: any): string {
    let protocolName = (root.text || 'protocol').toLowerCase().split(' ').join('_');
    protocolName = protocolName.replace(/[^a-z0-9_]/g, '');
    return `${protocolName}_questionnaire.json`;
  }

  private autoLinkId(): string {
    let hex = '';
    for (let i = 0; i < 8; i++) {
      hex += Math.floor(Math.random() * 16).toString(16);
    }
    return `AUTO_${hex}`;
  }

  private toValueString(value: any): string {
    if (value !== null && typeof value === 'object') {
      return JSON.stringify(value);
    }
    return String(value);
  }

  private buildExtensions(node: any): Array<any> {
    const extensions: Array<any> = [];
    Object.keys(EXTENSION_MAP).forEach((attr) => {
      if (attr in node) {
        extensions.push({
          url: `${EXT_BASE}/${EXTENSION_MAP[attr]}`,
          valueString: this.toValueString(node[attr]),
        });
      }
    });

    if (node['input-type'] === 'range') {
      extensions.push({
        url: 'http://hl7.org/fhir/StructureDefinition/minValue',
        valueInteger: 0,
      });
      extensions.push({
        url: 'http://hl7.org/fhir/StructureDefinition/maxValue',
        valueInteger: 100,
      });
    }

    if (node['input-type'] === 'frequency') {
      extensions.push({
        url: 'http://hl7.org/fhir/StructureDefinition/minValue',
        valueInteger: 0,
      });
      extensions.push({
        url: 'http://hl7.org/fhir/StructureDefinition/maxValue',
        valueInteger: 10,
      });
    }

    return extensions;
  }

  private buildAnswerOptionExtensions(option: any): Array<any> {
    const extensions: Array<any> = [];
    Object.keys(ANSWER_OPTION_KEYS).forEach((attr) => {
      if (attr in option) {
        extensions.push({
          url: `${EXT_BASE}/${ANSWER_OPTION_KEYS[attr]}`,
          valueString: this.toValueString(option[attr]),
        });
      }
    });
    return extensions;
  }

  private extractTranslations(node: any): Array<any> {
    const translations: Array<any> = [];
    Object.keys(node).forEach((key) => {
      if (key.indexOf('display-') === 0) {
        const lang = key.substring('display-'.length);
        translations.push({
          url: TRANSLATION_EXT,
          extension: [
            { url: 'lang', valueCode: lang },
            { url: 'content', valueString: node[key] },
          ],
        });
      }
    });
    return translations;
  }

  private applyTextTranslations(item: any, node: any): void {
    const translations = this.extractTranslations(node);
    if (translations.length > 0) {
      item._text = { extension: translations };
    }
  }

  private determineInputType(node: any): string {
    if (node.options && node.options.length > 0) {
      return 'choice';
    }
    const mapping: { [key: string]: string } = {
      text: 'string',
      number: 'integer',
      decimal: 'decimal',
      duration: 'quantity',
      date: 'date',
      camera: 'attachment',
      area: 'string',
      range: 'integer',
      frequency: 'integer',
    };
    return mapping[node['input-type']] || 'string';
  }

  private collapseSingleInput(node: any): any {
    const options = node.options || [];
    if (
      !(
        options.length === 1 &&
        options[0]['input-type'] &&
        !this.isTrue(options[0]['is-exclusive-option']) &&
        !node['multi-choice']
      )
    ) {
      return null;
    }

    const child = options[0];
    const merged: any = { ...node };

    merged['input-type'] = child['input-type'];

    Object.keys(EXTENSION_MAP).forEach((attr) => {
      if (!(attr in merged) && attr in child) {
        merged[attr] = child[attr];
      }
    });

    const SEPARATOR = ' - ';
    const append = (parentVal: any, childVal: any): any => {
      if (!childVal) {
        return parentVal;
      }
      if (!parentVal) {
        return childVal;
      }
      const p = String(parentVal).trim();
      const c = String(childVal).trim();
      if (!c || c === p || p.indexOf(c) !== -1) {
        return parentVal;
      }
      return `${p}${SEPARATOR}${c}`;
    };

    merged.text = append(node.text, child.text);

    const displayLangs = new Set<string>();
    Object.keys(node)
      .concat(Object.keys(child))
      .forEach((k) => {
        if (k.indexOf('display-') === 0) {
          displayLangs.add(k);
        }
      });
    displayLangs.forEach((key) => {
      merged[key] = append(node[key], child[key]);
    });

    if (node.display || child.display) {
      merged.display = append(node.display, child.display);
    }

    delete merged.options;
    return merged;
  }

  private addCheckboxControl(item: any): void {
    if (!item.extension) {
      item.extension = [];
    }
    item.extension.push({
      url: 'http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl',
      valueCodeableConcept: {
        coding: [
          {
            system: 'http://hl7.org/fhir/questionnaire-item-control',
            code: 'check-box',
          },
        ],
      },
    });
  }

  private processOptions(node: any, item: any): void {
    const options = node.options || [];
    if (options.length === 0) {
      return;
    }

    const containerPattern = options.every(
      (opt: any) =>
        opt.options &&
        opt.options.length === 1 &&
        opt.options[0].options &&
        opt.options[0].options.length > 0
    );
    if (containerPattern) {
      item.type = 'group';
      return;
    }

    if (item.type === 'group') {
      return;
    }

    const answerOptions: Array<any> = [];
    const exclusiveOptions: Array<any> = [];

    const nodeExtensions = this.buildExtensions(node);
    if (nodeExtensions.length > 0) {
      if (!item.extension) {
        item.extension = [];
      }
      item.extension = item.extension.concat(nodeExtensions);
    }

    const translations = this.extractTranslations(node);
    if (translations.length > 0) {
      item._text = { extension: translations };
    }

    options.forEach((option: any) => {
      if (this.isTrue(option['is-exclusive-option'])) {
        exclusiveOptions.push(option);
        return;
      }

      const coding: any = {
        system: CODE_SYSTEM,
        code: option.id,
        display: option.text,
      };

      const opt: any = { valueCoding: coding };

      const optTranslations = this.extractTranslations(option);
      if (optTranslations.length > 0) {
        coding._display = { extension: optTranslations };
      }

      const aoExtensions = this.buildAnswerOptionExtensions(option);
      if (aoExtensions.length > 0) {
        opt.extension = aoExtensions;
      }

      answerOptions.push(opt);
    });

    if (answerOptions.length > 0) {
      item.answerOption = answerOptions;
    }
  }

  private processChildren(node: any, item: any): void {
    const options = node.options || [];
    if (options.length === 0) {
      return;
    }

    if (item.type === 'group' && !node['multi-choice']) {
      const groupChildren: Array<any> = [];
      options.forEach((option: any) => {
        const childItem = this.buildItem(option);
        if (childItem) {
          groupChildren.push(childItem);
        }
      });
      if (groupChildren.length > 0) {
        item.item = groupChildren;
      }
      return;
    }

    const exclusiveOptions = options.filter((opt: any) =>
      this.isTrue(opt['is-exclusive-option'])
    );
    const regularOptions = options.filter(
      (opt: any) => !this.isTrue(opt['is-exclusive-option'])
    );

    exclusiveOptions.forEach((exclOpt: any) => {
      const childItem: any = {
        linkId: `${item.linkId}_${exclOpt.id}`,
        text: exclOpt.display !== undefined ? exclOpt.display : exclOpt.text,
        type: this.determineInputType(exclOpt),
      };
      const translations = this.extractTranslations(exclOpt);
      if (translations.length > 0) {
        childItem._text = { extension: translations };
      }
      const ext = this.buildExtensions(exclOpt);
      if (ext.length > 0) {
        childItem.extension = ext;
      }

      const enableConditions = regularOptions.map((opt: any) => ({
        question: item.linkId,
        operator: '=',
        answerCoding: { system: CODE_SYSTEM, code: opt.id },
      }));
      if (enableConditions.length > 0) {
        childItem.enableWhen = enableConditions;
        childItem.enableBehavior = 'any';
      }

      if (!item.item) {
        item.item = [];
      }
      item.item.push(childItem);
    });

    if (
      node['multi-choice'] &&
      options.every((opt: any) => !opt.options || opt.options.length === 0)
    ) {
      const leafChildren: Array<any> = [];
      options.forEach((option: any) => {
        if (option['input-type']) {
          const triggering = { system: CODE_SYSTEM, code: option.id };
          const childItem: any = {
            linkId: `${item.linkId}_${option.id}`,
            text: option.display !== undefined ? option.display : option.text,
            type: this.determineInputType(option),
            enableWhen: [
              {
                question: item.linkId,
                operator: '=',
                answerCoding: triggering,
              },
            ],
          };

          if (!DEDUPLICATE_CHILD_TRANSLATIONS) {
            const translations = this.extractTranslations(option);
            if (translations.length > 0) {
              childItem._text = { extension: translations };
            }
          }

          const ext = this.buildExtensions(option);
          if (ext.length > 0) {
            childItem.extension = ext;
          }

          leafChildren.push(childItem);
        }
      });
      if (leafChildren.length > 0) {
        item.item = leafChildren;
      }
      return;
    }

    const children: Array<any> = [];

    options.forEach((option: any) => {
      const hasOptions = option.options && option.options.length > 0;

      if (hasOptions && !node['multi-choice']) {
        const grandchildren = option.options;
        const lovPattern = grandchildren.every(
          (gc: any) =>
            (!gc.options || gc.options.length === 0) && !gc['input-type']
        );
        if (lovPattern) {
          const childItem = this.buildItem(option, item.linkId, {
            system: CODE_SYSTEM,
            code: option.id,
          });
          if (childItem) {
            children.push(childItem);
          }
          return;
        }
      }

      const triggering = { system: CODE_SYSTEM, code: option.id };

      if (item.answerOption && hasOptions) {
        const grandchildren = option.options;

        if (
          grandchildren.every(
            (gc: any) => !gc.options || gc.options.length === 0
          )
        ) {
          const childItem = this.buildItem(option, item.linkId, triggering);
          if (childItem) {
            children.push(childItem);
          }
        } else {
          option.options.forEach((childNode: any) => {
            const childItem = this.buildItem(childNode, item.linkId, triggering);
            if (childItem) {
              children.push(childItem);
            }
          });
        }
      }

      if (option['input-type'] && !this.isTrue(option['is-exclusive-option'])) {
        const childItem: any = {
          linkId: `${item.linkId}_${option.id}`,
          text: option.display !== undefined ? option.display : option.text,
          type: this.determineInputType(option),
          enableWhen: [
            {
              question: item.linkId,
              operator: '=',
              answerCoding: triggering,
            },
          ],
        };

        if (!DEDUPLICATE_CHILD_TRANSLATIONS) {
          const translations = this.extractTranslations(option);
          if (translations.length > 0) {
            childItem._text = { extension: translations };
          }
        }

        const ext = this.buildExtensions(option);
        if (ext.length > 0) {
          childItem.extension = ext;
        }

        children.push(childItem);
      }
    });

    if (children.length > 0) {
      item.item = children;
    }
  }

  private buildItem(
    node: any,
    parentLink?: string,
    triggeringOption?: any
  ): any {
    const collapsed = this.collapseSingleInput(node);
    if (collapsed) {
      node = collapsed;
    }

    let itemType = this.determineInputType(node);
    if (node['multi-choice']) {
      itemType = 'choice';
    }

    const linkId = this.sanitizeFhirId(node.id) || this.autoLinkId();

    const item: any = {
      linkId: linkId,
      text: node.text,
      type: itemType,
    };

    if (node.isRequired) {
      item.required = true;
    }

    if (node['multi-choice']) {
      item.repeats = true;
      this.addCheckboxControl(item);
    }

    if (parentLink && triggeringOption) {
      item.enableWhen = [
        {
          question: parentLink,
          operator: '=',
          answerCoding: triggeringOption,
        },
      ];
    }

    this.applyTextTranslations(item, node);

    if (
      (!node.options || node.options.length === 0) &&
      node['input-type']
    ) {
      const ext = this.buildExtensions(node);
      if (ext.length > 0) {
        if (!item.extension) {
          item.extension = [];
        }
        item.extension = item.extension.concat(ext);
      }
    }

    this.processOptions(node, item);
    this.processChildren(node, item);

    return item;
  }
}
