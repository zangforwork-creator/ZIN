export function chapterDiagram(){
 const box=(x,y,i,title,subtitle)=>`<g class="concept-node" role="button" tabindex="0" data-learn-map-node="${i}" aria-label="Explore ${title}" transform="translate(${x} ${y})"><rect width="260" height="90" rx="14"/><text x="130" y="36" text-anchor="middle">${title}</text><text class="node-subtitle" x="130" y="64" text-anchor="middle">${subtitle}</text></g>`;
 const edge=(d,label,x,y)=>`<path class="concept-edge" d="${d}" marker-end="url(#learn-arrow)"/><text class="edge-label" x="${x}" y="${y}" text-anchor="middle">${label}</text>`;
 return `<figure class="learn-linked-map"><div class="learn-diagram-scroll" tabindex="0" role="region" aria-label="Connected consumer behavior diagram. Scroll horizontally on small screens."><svg viewBox="0 0 1000 650" role="img" aria-labelledby="learn-map-title learn-map-desc"><title id="learn-map-title">Consumer behavior: connected chapter model</title><desc id="learn-map-desc">External and internal influences shape self-concept and lifestyle, which shape needs and decisions. Perceived value and meaning help explain choices. Consumer responses inform marketing strategy; strategy changes the offer and perceived value. Experience feeds back into the consumer. Select a node to explore its lesson.</desc><defs><marker id="learn-arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto" markerUnits="userSpaceOnUse"><path d="M0 0L10 5L0 10Z"/></marker></defs>
 ${edge('M290 100H366','shapes',330,82)}${edge('M710 100H634','shapes',671,82)}
 ${edge('M500 145V279','shapes needs &amp; choices',500,214)}
 ${edge('M290 325H366','informs',327,304)}${edge('M710 325H634','frames',672,304)}
 ${edge('M500 370V499','responses inform research',500,445)}
 ${edge('M370 545H160V372','changes the offer &amp; value',165,477)}
 ${edge('M630 350H675V125H634','experience feedback',763,234)}
 ${box(30,55,3,'External influences','Culture · family · groups')}
 ${box(370,55,3,'Self-concept &amp; lifestyle','Who I am · how I live')}
 ${box(710,55,3,'Internal influences','Perception · motives · attitudes')}
 ${box(30,280,1,'Customer value','Benefits · monetary &amp; other costs')}
 ${box(370,280,0,'Consumer process','Select · acquire · use · dispose')}
 ${box(710,280,4,'Consumption meaning','Functional · symbolic')}
 ${box(370,500,2,'Marketing strategy','Research · STP · 4Ps')}
 </svg></div><figcaption>Follow the arrowheads and relationship labels. Select a node to open its topic below. On small screens, swipe across the diagram; the same connections are available in the text list.</figcaption></figure>`;
}
export function lessonDiagram(section,escape,rich){
 const labels={roles:['leads into','followed by'],value:['evaluated through','compared across alternatives','checked through'],strategy:['informs','guides the offer','produces a response'],influences:['shapes','interacts with','produces experience'],knorr:['informs','guides','assessed through']};
 return `<figure class="learn-flow-figure"><div class="learn-flow" aria-label="${escape(section.title)} connected learning diagram">${section.diagram.map(([title,text],i)=>`${i?`<div class="learn-flow-connector"><span>${escape(labels[section.id]?.[i-1]||'connects to')}</span><svg viewBox="0 0 70 24" aria-hidden="true"><path d="M2 12H64M53 3L65 12L53 21"/></svg></div>`:''}<details><summary>${escape(title)}</summary><p>${rich(text)}</p></details>`).join('')}</div><figcaption>${section.id==='roles'?'A learning sequence, not a compulsory path for every consumer.':section.id==='influences'?'Experience can feed back into later perceptions and lifestyle. These relationships are not a deterministic prediction.':section.id==='strategy'?'Responses feed back into research; strategy is revised as evidence changes.':'A learning adaptation of the lecture. Open each connected node to read the explanation.'}</figcaption></figure>`;
}
