export interface IMindMapData {
  id?: string;
  topic: string;
  text?: string;
  perform_physical_exam?: string;
  display?: string;
  isRequired?: boolean;
  multi_choice?: boolean;
  exclude_from_multi_choice?: boolean;
  display_or?: string;
  display_hi?: string;
  pop_up?: string;
  pop_up_hi?: string;
  language?: string;
  input_type?: string;
  gender?: string;
  age_min?: number;
  age_max?: number;
  pos_condition?: string;
  neg_condition?: string;
  direction?: string;
  children?: Array<IMindMapData>;
}
