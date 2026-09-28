import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FIELD_GLOSSARY, FieldSection } from './field-glossary.data';

@Component({
  selector: 'app-field-guide',
  templateUrl: './field-guide.component.html',
  styleUrls: ['./field-guide.component.css']
})
export class FieldGuideComponent {
  searchText = '';
  readonly allSections: FieldSection[] = FIELD_GLOSSARY;

  readonly totalFieldCount: number = FIELD_GLOSSARY.reduce(
    (sum, s) => sum + s.fields.length, 0
  );

  constructor(public activeModal: NgbActiveModal) {}

  get filteredSections(): FieldSection[] {
    const q = this.searchText.trim().toLowerCase();
    if (!q) return this.allSections;
    return this.allSections
      .map(section => ({
        ...section,
        fields: section.fields.filter(
          f =>
            f.key.toLowerCase().includes(q) ||
            f.label.toLowerCase().includes(q) ||
            f.plainLabel.toLowerCase().includes(q) ||
            f.description.toLowerCase().includes(q) ||
            (f.example ?? '').toLowerCase().includes(q)
        )
      }))
      .filter(section => section.fields.length > 0);
  }

  clearSearch(): void {
    this.searchText = '';
  }
}
