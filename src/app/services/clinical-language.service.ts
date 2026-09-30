import { Injectable } from '@angular/core';
import OpenAI from 'openai';
import { environment } from '../../environments/environment';
import {
  CLINICAL_LANGUAGE_EXAMPLES,
  ClinicalLanguageExample,
} from './clinical-language-examples';

export interface ClinicalLanguageContext {
  path: string[];
  text: string;
  display?: string;
  inputType?: string;
  children?: string[];
  siblings?: string[];
  parentLanguage?: string;
  childLanguages?: string[];
  multiChoice?: boolean | null;
  isExclusiveOption?: boolean | null;
}

export interface ClinicalLanguageSuggestion {
  language: string;
  reasoning: string;
}

const SUGGESTION_SCHEMA = {
  type: 'object',
  properties: {
    language: {
      type: 'string',
      description:
        "The clinical phrasing for the history note, or '%' when no label should be printed.",
    },
    reasoning: {
      type: 'string',
      description:
        'One short sentence explaining the choice, shown to the author.',
    },
  },
  required: ['language', 'reasoning'],
  additionalProperties: false,
};

const SYSTEM_PROMPT = `You author the "Language to be shown in history note" field for Intelehealth clinical protocols.

BACKGROUND
A health worker answers protocol questions on a form. Those answers are rendered into a history note that a doctor reads. The question text is written for a patient; the history note must read as clinical documentation. This field holds the clinical wording.

HOW THE FIELD IS USED
- On an ANSWER OPTION (a leaf choice), the value REPLACES the option text in the note.
    "Does not move" -> "Pain does not radiate"
- On a QUESTION (a node with options below it), the value is the LABEL printed before the answer.
- The special value "%" means "print no label, just the answer". Use it whenever a label
  in front of the answer would be redundant or would read awkwardly.

RULES
1. Leaf option with NO input type (a plain choice) -> a complete, self-contained clinical
   statement. It must make sense on its own in a note, without the question. "Yes" under
   "Smell of the discharge" becomes "Foul-smelling vaginal discharge present", never "Yes".
1b. Leaf option WITH a free-text, duration, date or number input -> decide by whether the
   option's own text NAMES something or is just a GENERIC PROMPT:
   - GENERIC PROMPT (its words only tell the worker to type - "Describe", "Describe relation",
     "Other [describe]", "Yes [Describe]", "Mention all locations", "Enter additional
     information") -> "%". The typed text already reads on its own and the chain above it
     supplies the context, so any label you invent would be noise.
   - NAMES SOMETHING specific ("Scald (Hot liquids) [Describe]", "Color change in urine
     [describe]", "Medication name (Describe)", "Last menstruation period") -> keep the option's
     own words with the scaffolding stripped: "Scald (Hot liquids)", "Color change in urine",
     "Medication name", "LMP". Keep it SHORT - never expand it into "Burn caused by ..." prose.
   - A date or duration that answers "when" -> a bare connector: "on", "since".
2. PREFER "%" FOR QUESTIONS. A node that has options below it is a question, and in these
   protocols a question is almost always "%" - its options carry the wording. Only give a
   question a label when the answers below it are bare values (a number, a date, a free-text
   fragment) that would not say what was measured. Never simply echo the question's own text
   back as the label: if the best label you can think of is the question text itself, use "%".
3. Free-text, duration, date or number input -> a short connector phrase that the typed answer
   follows naturally ("since", "medications such as", "LMP"). If the typed answer already reads
   as a complete phrase on its own - generic "Other [describe]", "Yes [Describe]",
   "Additional information" - use "%" rather than inventing a label.
4. NEVER LEAVE THE LINE WITH NOTHING. A question and the free-text option under it print as one
   line. If you are judging a QUESTION whose options are ALL authored and ALL "%", give this
   question a short clinical label - otherwise the note shows a bare typed value with nothing
   saying what it is.
   This rule needs FULL COVERAGE. The user message tells you how many of the options are
   authored. If some options are still empty, you cannot conclude anything from the ones that
   are - a lone "%" on an "Other [describe]" option sitting among unauthored symptom options
   says nothing about the question. In that case fall back to rule 2 and answer "%".
   It also only applies when the options are bare values. A question whose options are plain
   choices (a symptom list, Yes/No) is "%" no matter what is authored below it - those options
   will each become self-contained statements under rule 1.
   This works in ONE DIRECTION ONLY. Do NOT use it in reverse: a node that should carry wording
   still carries it even when its parent or its own options already have values. Both a "Yes"
   option ("Recent h/o trauma / surgery") and the date under it ("on") legitimately carry
   wording - they read as one line together. Judge this node on its own merits first, and use
   the neighbouring values only to avoid the empty-line case above.
5. Negative and positive options in the same group must be symmetric:
   "Foul-smelling vaginal discharge present" / "No foul-smelling vaginal discharge".
6. Never carry instructions to the health worker into the note. A question like
   "Ask the patient to hold your two fingers tightly" is an instruction; the note records the
   FINDING, not the instruction. Such questions are almost always "%".
7. Strip authoring scaffolding: "[describe]", "[Enter ...]", trailing asterisks, numbering.
8. Keep it short and factual. No patient-facing phrasing ("you", "your"), no invented clinical
   detail, no diagnosis that the answer does not state, no trailing full stop.
9. Match the register of the examples exactly. They are real authored values from these protocols.

PHYSICAL EXAMINATION PROTOCOLS
Physical exam protocols (the path starts "Physical Exam") follow their own house style. When the
path tells you this is one, these override the general phrasing guidance above:
P1. A camera option - input type "camera", usually texted "Take a picture" - is ALWAYS exactly
    "[picture taken]". It is a marker the app looks for, not prose. Never write a label for it
    and never use "%".
P2. A body region or exam-group node near the top (Ear, Eyes, Mouth, Abdomen, Back, Joint,
    Skin Rash, Injury abrasion, Any Location ...) is a SECTION HEADING: its own name followed by
    a colon - "Ear:", "Abdomen:", "Injury abrasion:", "Skin Rash:". Keep the colon.
P3. Findings are written as lower-case observations, not sentences: "ulcer seen",
    "no ulcer seen", "redness seen in ear", "no tenderness", "joint is swollen",
    "nails normal", "no pedal oedema". Prefer "<finding> seen" / "no <finding> seen" over
    "present" / "absent", and do not capitalise the first word.
P4. When the option's own text already reads as a finding, keep its wording and word order -
    "Teeth discoloured" stays "discoloured teeth", not a re-ordered rewrite.

Return only the field value.`;

function formatExample(e: ClinicalLanguageExample): string {
  const lines = [`Path: ${e.path}`, `Text: ${e.text}`];
  if (e.inputType) lines.push(`Input type: ${e.inputType}`);
  if (e.children?.length) lines.push(`Options: ${e.children.join(', ')}`);
  lines.push(`-> ${e.language}`);
  return lines.join('\n');
}

const EXAMPLES_BLOCK = `Authored examples:\n\n${CLINICAL_LANGUAGE_EXAMPLES.map(
  formatExample
).join('\n\n')}`;

@Injectable({ providedIn: 'root' })
export class ClinicalLanguageService {
  private client?: OpenAI;

  get isConfigured(): boolean {
    return !!environment.openaiApiKey;
  }

  private getClient(): OpenAI {
    if (!this.client) {
      this.client = new OpenAI({
        apiKey: environment.openaiApiKey,
        dangerouslyAllowBrowser: true,
      });
    }
    return this.client;
  }

  async suggest(
    ctx: ClinicalLanguageContext
  ): Promise<ClinicalLanguageSuggestion> {
    if (!this.isConfigured) {
      throw new Error(
        'No OpenAI API key configured. Set openaiApiKey in src/environments/environment.ts.'
      );
    }

    const { data: response, response: httpResponse } = await this.getClient()
      .responses.create({
        model: environment.openaiModel,
        input: [
          { role: 'developer', content: `${SYSTEM_PROMPT}\n\n${EXAMPLES_BLOCK}` },
          { role: 'user', content: this.describeNode(ctx) },
        ],
        text: {
          format: {
            type: 'json_schema',
            name: 'suggestion',
            strict: true,
            schema: SUGGESTION_SCHEMA,
          },
        },
      })
      .withResponse();

    if (!response) {
      const body = await httpResponse.clone().text().catch(() => '');
      console.error('Empty suggestion response', {
        status: httpResponse.status,
        contentType: httpResponse.headers.get('content-type'),
        body,
      });
      throw new Error(
        `OpenAI returned no body (HTTP ${httpResponse.status}). ${
          body.slice(0, 160) || 'See the browser console.'
        }`
      );
    }

    const text = this.extractText(response);

    let parsed: ClinicalLanguageSuggestion;
    try {
      parsed = JSON.parse(text);
    } catch {
      console.error('Unparseable suggestion response', response);
      throw new Error(
        text
          ? `Model did not return the expected format: ${text.slice(0, 120)}`
          : 'The model returned no text. See the browser console for the full response.'
      );
    }
    return {
      language: (parsed.language ?? '').trim(),
      reasoning: parsed.reasoning ?? '',
    };
  }

  private extractText(response: any): string {
    const parts: string[] = [];
    for (const item of response?.output ?? []) {
      if (item?.type !== 'message') continue;
      for (const content of item?.content ?? []) {
        if (content?.type === 'output_text' && content.text) {
          parts.push(content.text);
        }
      }
    }
    if (parts.length === 0 && typeof response?.output_text === 'string') {
      return response.output_text;
    }
    return parts.join('');
  }

  private describeNode(ctx: ClinicalLanguageContext): string {
    const lines: string[] = [];
    lines.push(`Path: ${[...ctx.path, ctx.text].join(' > ')}`);
    lines.push(`Text: ${ctx.text}`);
    if (ctx.display) lines.push(`Display (English): ${ctx.display}`);
    if (ctx.inputType) lines.push(`Input type: ${ctx.inputType}`);
    if (ctx.multiChoice != null) lines.push(`Multi choice: ${ctx.multiChoice}`);
    if (ctx.isExclusiveOption != null) {
      lines.push(`Is exclusive option: ${ctx.isExclusiveOption}`);
    }
    if (ctx.children?.length) {
      lines.push(`Options below this node: ${ctx.children.join(', ')}`);
    } else {
      lines.push('Options below this node: none (this is an answer option)');
    }
    if (ctx.siblings?.length) {
      lines.push(`Sibling options: ${ctx.siblings.join(', ')}`);
    }
    if (ctx.parentLanguage) {
      lines.push(`Parent question's authored value: ${ctx.parentLanguage}`);
    }
    if (ctx.childLanguages?.length) {
      const total = ctx.children?.length ?? ctx.childLanguages.length;
      lines.push(
        `Authored values on the options below (${ctx.childLanguages.length} of ` +
          `${total} options authored; the rest are still empty): ` +
          ctx.childLanguages.join(', ')
      );
    } else if (ctx.children?.length) {
      lines.push('None of the options below have an authored value yet.');
    }
    return lines.join('\n');
  }
}
