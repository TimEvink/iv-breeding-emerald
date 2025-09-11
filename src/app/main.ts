import { probabilityDataWithCache } from './probabilitycalcs.js';
import { ConfigurationOptions, State } from './interfaces.js';

const stats: readonly string[] = ['HP', 'Atk', 'Def', 'SpA', 'SpD', 'Spe'];
const state: State = {
    targetIVs: [],
    options: {
        missingAIVs: 1,
        missingBIVs: 1
    }
}

//update state from url query parameters if needed
function initializeState(): void {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.size === 0) return;
    const raw = searchParams.get('s');
    try {
        if (!raw) throw new Error('Invalid query parameter used');
        if (!/^[0-3]{2}[0-5]{0,6}$/.test(raw)) throw new Error('Invalid parameter format');
        //set state from url
        state.targetIVs = Array.from(new Set(raw.slice(2)), Number).sort((a, b) => a - b);
        state.options = { missingAIVs: Number(raw[0]), missingBIVs: Number(raw[1]) };
        //set user input from state
        for (const i of state.targetIVs) {
            document.querySelector(`#target-ivs-header-row td.toggleable[data-stat="${i}"]`)!.classList.toggle('selected', true);
        }
        document.querySelector<HTMLInputElement>('input[data-prop="missingAIVs"]')!.value = state.options.missingAIVs.toString();
        document.querySelector<HTMLInputElement>('input[data-prop="missingBIVs"]')!.value = state.options.missingBIVs.toString();
    } catch (err) {
        console.warn("Falling back to default state because of bad query parameters:", err);
    }
}

function updateUrl(): void {
    const url = (state.targetIVs.length === 0 && state.options.missingAIVs === 1 && state.options.missingBIVs === 1)
        ? `${location.origin}${location.pathname}`
        : `${location.origin}${location.pathname}?s=${state.options.missingAIVs}${state.options.missingBIVs}${state.targetIVs.join('')}`;
    history.replaceState(null, "", url);
}

//fetches probability data and constructs the relevant tables.
function calculateAndRender(): void {
    const tablebody = document.getElementById('parent-ivs-data')!;
    tablebody.replaceChildren();
    const probabilitydata = probabilityDataWithCache(state.targetIVs, state.options);
    if (probabilitydata.length === 0) {
        document.getElementById('noresultplaceholder')!.classList.toggle('hidden', false);
        return;
    }
    document.getElementById('noresultplaceholder')!.classList.toggle('hidden', true);
    //table data
    for (const [parentAIVs, parentBIVs, numerator, denominator] of probabilitydata) {
        //add a row for each parent
        for (const parent of [parentAIVs, parentBIVs]) {
            const tablerow = document.createElement('tr');
            const parentcell = document.createElement('td');
            parentcell.textContent = (parent === parentAIVs) ? 'A' : 'B';
            tablerow.appendChild(parentcell);
            for (let i = 0; i < stats.length; i++) {
                const tabledata = document.createElement('td');
                tabledata.textContent = parent.includes(i) ? stats[i] : '';
                tablerow.appendChild(tabledata);
            }
            //add probabilitycell
            if (parent === parentAIVs) {
                const probabilitycell = document.createElement('td');
                probabilitycell.rowSpan = 2;
                probabilitycell.textContent = `1/${(denominator / numerator).toFixed(2)}`;
                tablerow.appendChild(probabilitycell);
            }
            tablebody.appendChild(tablerow);
        }
    }
    updateUrl();
}

document.getElementById('target-ivs-header-row')!.addEventListener('click', (event) => {
    if (event.target instanceof HTMLTableCellElement && 'stat' in event.target.dataset) {
        event.target.classList.toggle('selected');
        //update targetIVs
        const index = Number(event.target.dataset.stat);
        if (state.targetIVs.includes(index)) {
            state.targetIVs = state.targetIVs.filter((x) => x !== index);
        } else {
            state.targetIVs.push(index);
            state.targetIVs.sort((a, b) => a - b);
        }
        calculateAndRender();
    }
});

document.getElementById('options-body')!.addEventListener('input', (event) => {
    if (event.target instanceof HTMLInputElement) {
        //retrieve and sanitize value
        let value = Math.round(Number(event.target.value) || 0);
        value = Math.max(value, 0);
        value = Math.min(value, 3);
        event.target.value = value.toString();
        //update state
        state.options[event.target.dataset.prop! as keyof ConfigurationOptions] = value;
        calculateAndRender();
    }
});

initializeState();
calculateAndRender();
