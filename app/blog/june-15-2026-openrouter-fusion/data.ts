/** Figures and constants for the OpenRouter Fusion opinion post.
 *
 * The three figures are inlined as raw SVG strings (rendered via
 * dangerouslySetInnerHTML) so they scale to the content column and need no
 * image optimisation config. The root <svg> tags are made fluid with
 * width="100%" height="auto" while keeping the original viewBox.
 */

/* ── Hero stat cells ── */
export const heroStats = [
  { label: 'Cost vs Fable 5', value: '~½', sub: 'for near-equal quality', direction: 'up' as const },
  { label: 'Quality gap to Fable 5', value: '~1%', sub: 'budget panel, fused', direction: 'nt' as const },
  { label: 'Gain from synthesis', value: '75%', sub: "OpenRouter's own split", direction: 'up' as const },
  { label: 'Gain from diversity', value: '25%', sub: 'the panel of models', direction: 'dn' as const },
];

/* ── Figure 1: where the gains come from (75 / 25 synthesis vs diversity) ── */
export const figSynthesisSplit = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="auto" viewBox="0 0 1200 660" style="display:block;max-width:100%"><defs><filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="4" stdDeviation="7" flood-color="#1a1a1a" flood-opacity="0.12"/></filter></defs><rect width="1200" height="660" fill="#F4F1EA"/>
<text x="72" y="78" font-family="DejaVu Sans Mono, monospace" font-size="14" font-weight="bold" fill="#FF5A39" text-anchor="start" letter-spacing="2.5">FUSION · FIGURE 1</text>
<line x1="72" y1="96" x2="116" y2="96" stroke="#FF5A39" stroke-width="3"/>
<text x="72" y="140" font-family="Liberation Sans, DejaVu Sans, Arial, sans-serif" font-size="37" font-weight="bold" fill="#17171B" text-anchor="start" letter-spacing="-0.4">Where the gains actually come from</text>
<text x="72" y="190" font-family="Liberation Sans, DejaVu Sans, Arial, sans-serif" font-size="18" font-weight="normal" fill="#6F6A60" text-anchor="start">OpenRouter&#x27;s own breakdown of what makes Fusion smarter.</text>
<rect x="72" y="300" width="792" height="140" fill="#FF5A39" rx="4"/>
<rect x="864" y="300" width="264" height="140" fill="#2540F2" rx="4"/>
<rect x="863" y="300" width="3" height="140" fill="#F4F1EA"/>
<text x="106" y="392" font-family="Liberation Sans, DejaVu Sans, Arial, sans-serif" font-size="72" font-weight="bold" fill="#FFFFFF" text-anchor="start" letter-spacing="-1">75%</text>
<text x="1106" y="388" font-family="Liberation Sans, DejaVu Sans, Arial, sans-serif" font-size="46" font-weight="bold" fill="#FFFFFF" text-anchor="end" letter-spacing="-1">25%</text>
<text x="74" y="486" font-family="DejaVu Sans Mono, monospace" font-size="18" font-weight="bold" fill="#FF5A39" text-anchor="start" letter-spacing="1.5">SYNTHESIS</text>
<text x="74" y="512" font-family="Liberation Sans, DejaVu Sans, Arial, sans-serif" font-size="16" font-weight="normal" fill="#17171B" text-anchor="start">The judge and synthesizer reconciling</text>
<text x="74" y="534" font-family="Liberation Sans, DejaVu Sans, Arial, sans-serif" font-size="16" font-weight="normal" fill="#17171B" text-anchor="start">every model&#x27;s answer into one.</text>
<text x="868" y="486" font-family="DejaVu Sans Mono, monospace" font-size="18" font-weight="bold" fill="#2540F2" text-anchor="start" letter-spacing="1.5">DIVERSITY</text>
<text x="868" y="512" font-family="Liberation Sans, DejaVu Sans, Arial, sans-serif" font-size="16" font-weight="normal" fill="#17171B" text-anchor="start">Using a panel of</text>
<text x="868" y="534" font-family="Liberation Sans, DejaVu Sans, Arial, sans-serif" font-size="16" font-weight="normal" fill="#17171B" text-anchor="start">different models.</text>
<line x1="72" y1="600" x2="1128" y2="600" stroke="#D8D3C7" stroke-width="1.5"/>
<text x="72" y="622" font-family="DejaVu Sans Mono, monospace" font-size="13" font-weight="normal" fill="#6F6A60" text-anchor="start">Source: OpenRouter, company benchmarks (DRACO)</text>
<text x="1128" y="622" font-family="DejaVu Sans Mono, monospace" font-size="13" font-weight="normal" fill="#6F6A60" text-anchor="end">Opinion — JLabs</text></svg>`;

/* ── Figure 2: how Fusion answers one prompt (the pipeline) ── */
export const figHowItWorks = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="auto" viewBox="0 0 1200 600" style="display:block;max-width:100%"><defs><filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="4" stdDeviation="7" flood-color="#1a1a1a" flood-opacity="0.12"/></filter></defs><rect width="1200" height="600" fill="#F4F1EA"/>
<text x="72" y="78" font-family="DejaVu Sans Mono, monospace" font-size="14" font-weight="bold" fill="#FF5A39" text-anchor="start" letter-spacing="2.5">FUSION · FIGURE 2</text>
<line x1="72" y1="96" x2="116" y2="96" stroke="#FF5A39" stroke-width="3"/>
<text x="72" y="140" font-family="Liberation Sans, DejaVu Sans, Arial, sans-serif" font-size="37" font-weight="bold" fill="#17171B" text-anchor="start" letter-spacing="-0.4">How Fusion answers one prompt</text>
<text x="72" y="190" font-family="Liberation Sans, DejaVu Sans, Arial, sans-serif" font-size="18" font-weight="normal" fill="#6F6A60" text-anchor="start">Your question is fanned out, judged, then rewritten as a single answer.</text>
<rect x="72" y="300" width="150" height="132" rx="12" fill="#FBFAF6" stroke="#17171B" stroke-width="1.6" filter="url(#soft)"/>
<text x="147.0" y="350" font-family="DejaVu Sans Mono, monospace" font-size="15" font-weight="bold" fill="#FF5A39" text-anchor="middle" letter-spacing="1.5">PROMPT</text>
<text x="147.0" y="382" font-family="Liberation Sans, DejaVu Sans, Arial, sans-serif" font-size="16" font-weight="normal" fill="#17171B" text-anchor="middle">your</text>
<text x="147.0" y="402" font-family="Liberation Sans, DejaVu Sans, Arial, sans-serif" font-size="16" font-weight="normal" fill="#17171B" text-anchor="middle">question</text>
<path d="M 230 356.0 L 244 366.0 L 230 376.0" fill="none" stroke="#6F6A60" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
<rect x="252" y="300" width="250" height="132" rx="12" fill="#FBFAF6" stroke="#17171B" stroke-width="1.6" filter="url(#soft)"/>
<text x="377.0" y="334" font-family="DejaVu Sans Mono, monospace" font-size="14" font-weight="bold" fill="#2540F2" text-anchor="middle" letter-spacing="1.2">PANEL OF MODELS</text>
<rect x="274.0" y="350" width="60.666666666666664" height="34" rx="7" fill="#F4F1EA" stroke="#D8D3C7" stroke-width="1.4"/>
<text x="304.3333333333333" y="373" font-family="DejaVu Sans Mono, monospace" font-size="16" font-weight="bold" fill="#17171B" text-anchor="middle">A</text>
<rect x="346.66666666666663" y="350" width="60.666666666666664" height="34" rx="7" fill="#F4F1EA" stroke="#D8D3C7" stroke-width="1.4"/>
<text x="376.99999999999994" y="373" font-family="DejaVu Sans Mono, monospace" font-size="16" font-weight="bold" fill="#17171B" text-anchor="middle">B</text>
<rect x="419.3333333333333" y="350" width="60.666666666666664" height="34" rx="7" fill="#F4F1EA" stroke="#D8D3C7" stroke-width="1.4"/>
<text x="449.66666666666663" y="373" font-family="DejaVu Sans Mono, monospace" font-size="16" font-weight="bold" fill="#17171B" text-anchor="middle">C</text>
<text x="377.0" y="412" font-family="Liberation Sans, DejaVu Sans, Arial, sans-serif" font-size="13" font-weight="normal" fill="#6F6A60" text-anchor="middle">run in parallel · web + bash</text>
<path d="M 510 356.0 L 524 366.0 L 510 376.0" fill="none" stroke="#6F6A60" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
<rect x="532" y="300" width="224" height="132" rx="12" fill="#FBFAF6" stroke="#17171B" stroke-width="1.6" filter="url(#soft)"/>
<text x="644.0" y="334" font-family="DejaVu Sans Mono, monospace" font-size="14" font-weight="bold" fill="#FF5A39" text-anchor="middle" letter-spacing="1.5">JUDGE</text>
<text x="644.0" y="362" font-family="Liberation Sans, DejaVu Sans, Arial, sans-serif" font-size="15" font-weight="normal" fill="#17171B" text-anchor="middle">maps agreement,</text>
<text x="644.0" y="384" font-family="Liberation Sans, DejaVu Sans, Arial, sans-serif" font-size="15" font-weight="normal" fill="#17171B" text-anchor="middle">conflicts, gaps and</text>
<text x="644.0" y="406" font-family="Liberation Sans, DejaVu Sans, Arial, sans-serif" font-size="15" font-weight="normal" fill="#17171B" text-anchor="middle">unique insights</text>
<path d="M 764 356.0 L 778 366.0 L 764 376.0" fill="none" stroke="#6F6A60" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
<rect x="786" y="300" width="200" height="132" rx="12" fill="#FBFAF6" stroke="#17171B" stroke-width="1.6" filter="url(#soft)"/>
<text x="886.0" y="334" font-family="DejaVu Sans Mono, monospace" font-size="14" font-weight="bold" fill="#2540F2" text-anchor="middle" letter-spacing="1.2">SYNTHESIZER</text>
<text x="886.0" y="366" font-family="Liberation Sans, DejaVu Sans, Arial, sans-serif" font-size="15" font-weight="normal" fill="#17171B" text-anchor="middle">writes the final</text>
<text x="886.0" y="388" font-family="Liberation Sans, DejaVu Sans, Arial, sans-serif" font-size="15" font-weight="normal" fill="#17171B" text-anchor="middle">answer from</text>
<text x="886.0" y="410" font-family="Liberation Sans, DejaVu Sans, Arial, sans-serif" font-size="15" font-weight="normal" fill="#17171B" text-anchor="middle">that map</text>
<path d="M 994 356.0 L 1008 366.0 L 994 376.0" fill="none" stroke="#6F6A60" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
<rect x="1016" y="300" width="156" height="132" rx="12" fill="#17171B" filter="url(#soft)"/>
<text x="1094.0" y="350" font-family="DejaVu Sans Mono, monospace" font-size="15" font-weight="bold" fill="#FF5A39" text-anchor="middle" letter-spacing="1.5">ANSWER</text>
<text x="1094.0" y="382" font-family="Liberation Sans, DejaVu Sans, Arial, sans-serif" font-size="16" font-weight="normal" fill="#FFFFFF" text-anchor="middle">one</text>
<text x="1094.0" y="402" font-family="Liberation Sans, DejaVu Sans, Arial, sans-serif" font-size="16" font-weight="normal" fill="#FFFFFF" text-anchor="middle">reply</text>
<text x="72" y="490" font-family="Liberation Sans, DejaVu Sans, Arial, sans-serif" font-size="16" font-weight="normal" fill="#6F6A60" text-anchor="start">By OpenRouter&#x27;s measurement, the judge and synthesizer steps do most of the work, not the panel.</text>
<line x1="72" y1="540" x2="1128" y2="540" stroke="#D8D3C7" stroke-width="1.5"/>
<text x="72" y="562" font-family="DejaVu Sans Mono, monospace" font-size="13" font-weight="normal" fill="#6F6A60" text-anchor="start">Source: OpenRouter, Fusion announcement</text>
<text x="1128" y="562" font-family="DejaVu Sans Mono, monospace" font-size="13" font-weight="normal" fill="#6F6A60" text-anchor="end">Opinion — JLabs</text></svg>`;

/* ── Figure 3: cheap models, fused, kept up (quality vs cost) ── */
export const figBenchmarkCost = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="auto" viewBox="0 0 1200 700" style="display:block;max-width:100%"><defs><filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="4" stdDeviation="7" flood-color="#1a1a1a" flood-opacity="0.12"/></filter></defs><rect width="1200" height="700" fill="#F4F1EA"/>
<text x="72" y="78" font-family="DejaVu Sans Mono, monospace" font-size="14" font-weight="bold" fill="#FF5A39" text-anchor="start" letter-spacing="2.5">FUSION · FIGURE 3</text>
<line x1="72" y1="96" x2="116" y2="96" stroke="#FF5A39" stroke-width="3"/>
<text x="72" y="140" font-family="Liberation Sans, DejaVu Sans, Arial, sans-serif" font-size="37" font-weight="bold" fill="#17171B" text-anchor="start" letter-spacing="-0.4">Cheap models, fused, kept up</text>
<text x="72" y="190" font-family="Liberation Sans, DejaVu Sans, Arial, sans-serif" font-size="18" font-weight="normal" fill="#6F6A60" text-anchor="start">Relative results OpenRouter reported on the DRACO deep-research benchmark.</text>
<text x="72" y="296" font-family="DejaVu Sans Mono, monospace" font-size="14" font-weight="bold" fill="#17171B" text-anchor="start" letter-spacing="1.5">QUALITY  (DRACO)</text>
<rect x="72" y="320" width="600" height="56" rx="9" fill="#FBFAF6" stroke="#D8D3C7" stroke-width="1.4"/>
<rect x="72" y="320" width="600" height="56" rx="9" fill="#17171B"/>
<text x="90" y="347" font-family="Liberation Sans, DejaVu Sans, Arial, sans-serif" font-size="17" font-weight="bold" fill="#FFFFFF" text-anchor="start">Claude Fable 5</text>
<text x="90" y="366" font-family="Liberation Sans, DejaVu Sans, Arial, sans-serif" font-size="12.5" font-weight="normal" fill="#FFFFFF" text-anchor="start" style="opacity:0.85">single frontier model</text>
<text x="672" y="312" font-family="DejaVu Sans Mono, monospace" font-size="13" font-weight="bold" fill="#6F6A60" text-anchor="end">benchmark top</text>
<rect x="72" y="406" width="600" height="56" rx="9" fill="#FBFAF6" stroke="#D8D3C7" stroke-width="1.4"/>
<rect x="72" y="406" width="582" height="56" rx="9" fill="#FF5A39"/>
<text x="90" y="433" font-family="Liberation Sans, DejaVu Sans, Arial, sans-serif" font-size="17" font-weight="bold" fill="#FFFFFF" text-anchor="start">Budget panel, fused</text>
<text x="90" y="452" font-family="Liberation Sans, DejaVu Sans, Arial, sans-serif" font-size="12.5" font-weight="normal" fill="#FFFFFF" text-anchor="start" style="opacity:0.85">Gemini 3 Flash · Kimi K2.6 · DeepSeek V4 Pro</text>
<text x="672" y="398" font-family="DejaVu Sans Mono, monospace" font-size="13" font-weight="bold" fill="#FF5A39" text-anchor="end">within ~1%</text>
<rect x="72" y="492" width="600" height="56" rx="9" fill="#FBFAF6" stroke="#D8D3C7" stroke-width="1.4"/>
<rect x="72" y="492" width="444" height="56" rx="9" fill="#2540F2"/>
<text x="90" y="519" font-family="Liberation Sans, DejaVu Sans, Arial, sans-serif" font-size="17" font-weight="bold" fill="#FFFFFF" text-anchor="start">Solo GPT-5.5</text>
<text x="90" y="538" font-family="Liberation Sans, DejaVu Sans, Arial, sans-serif" font-size="12.5" font-weight="normal" fill="#FFFFFF" text-anchor="start" style="opacity:0.85">single frontier model</text>
<text x="672" y="484" font-family="DejaVu Sans Mono, monospace" font-size="13" font-weight="bold" fill="#2540F2" text-anchor="end">beaten</text>
<rect x="72" y="574" width="600" height="56" rx="9" fill="#FBFAF6" stroke="#D8D3C7" stroke-width="1.4"/>
<rect x="72" y="574" width="426" height="56" rx="9" fill="#2540F2"/>
<text x="90" y="601" font-family="Liberation Sans, DejaVu Sans, Arial, sans-serif" font-size="17" font-weight="bold" fill="#FFFFFF" text-anchor="start">Solo Opus 4.8</text>
<text x="90" y="620" font-family="Liberation Sans, DejaVu Sans, Arial, sans-serif" font-size="12.5" font-weight="normal" fill="#FFFFFF" text-anchor="start" style="opacity:0.85">single frontier model</text>
<text x="672" y="566" font-family="DejaVu Sans Mono, monospace" font-size="13" font-weight="bold" fill="#2540F2" text-anchor="end">beaten</text>
<line x1="704" y1="278" x2="704" y2="630" stroke="#D8D3C7" stroke-width="1.5"/>
<text x="736" y="296" font-family="DejaVu Sans Mono, monospace" font-size="14" font-weight="bold" fill="#17171B" text-anchor="start" letter-spacing="1.5">COST</text>
<text x="736" y="392" font-family="Liberation Sans, DejaVu Sans, Arial, sans-serif" font-size="104" font-weight="bold" fill="#FF5A39" text-anchor="start">½</text>
<text x="736" y="446" font-family="Liberation Sans, DejaVu Sans, Arial, sans-serif" font-size="19" font-weight="normal" fill="#17171B" text-anchor="start">the price of Fable 5,</text>
<text x="736" y="474" font-family="Liberation Sans, DejaVu Sans, Arial, sans-serif" font-size="19" font-weight="normal" fill="#17171B" text-anchor="start">for near-equal quality.</text>
<rect x="736" y="506" width="392" height="76" rx="10" fill="#FBFAF6" stroke="#D8D3C7" stroke-width="1.4"/>
<text x="752" y="536" font-family="Liberation Sans, DejaVu Sans, Arial, sans-serif" font-size="13.5" font-weight="bold" fill="#17171B" text-anchor="start">Bars are relative, not exact:</text>
<text x="752" y="558" font-family="Liberation Sans, DejaVu Sans, Arial, sans-serif" font-size="13" font-weight="normal" fill="#6F6A60" text-anchor="start">OpenRouter didn&#x27;t publish per-model</text>
<text x="752" y="575" font-family="Liberation Sans, DejaVu Sans, Arial, sans-serif" font-size="13" font-weight="normal" fill="#6F6A60" text-anchor="start">scores, only these comparisons.</text>
<line x1="72" y1="640" x2="1128" y2="640" stroke="#D8D3C7" stroke-width="1.5"/>
<text x="72" y="662" font-family="DejaVu Sans Mono, monospace" font-size="13" font-weight="normal" fill="#6F6A60" text-anchor="start">Source: OpenRouter benchmarks · DRACO (Perplexity)</text>
<text x="1128" y="662" font-family="DejaVu Sans Mono, monospace" font-size="13" font-weight="normal" fill="#6F6A60" text-anchor="end">Opinion — JLabs</text></svg>`;
