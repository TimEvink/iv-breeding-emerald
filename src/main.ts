import { probabilityData } from './probabilitycalcs.js';
import { ConfigurationOptions } from './interfaces.js';

//to keep track of all user input
interface State {
    targetIVs: number[],
    options: ConfigurationOptions
};

//initial state, hardcoded to match default values of input fields.
const state: State = {
    targetIVs: [],
    options: {
        minmissingAIVs: 1,
        maxmissingAIVs: 1,
        minmissingBIVs: 1,
        maxmissingBIVs: 1
    }
};

const stats: readonly string[] = ['HP', 'Atk', 'Def', 'SpA', 'SpD', 'Spe'];
const tablecellwidth = 8;
const decimals = 2;
const tablebody = document.getElementById('tablebody')!;

//fetches probability data and constructs the relevant tables.
function calculateAndRender(): void {
    tablebody.replaceChildren();
    const probabilitydata = probabilityData(state.targetIVs, state.options);
    //generate tablerows with the data.
    if (probabilitydata.length === 0) {
        const warningrow = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = tablecellwidth;
        cell.innerHTML = 'No results for current target IVs.<br> Toggle more stats and/or change settings.';
        warningrow.appendChild(cell);
        tablebody.appendChild(warningrow);
        return;
    }
    for (const [parentAIVs, parentBIVs, numerator, denominator] of probabilitydata) {
        //add a row for each parent
        for (const parent of [parentAIVs, parentBIVs]) {
            const tablerow = document.createElement('tr');
            const parentcell = document.createElement('td');
            parentcell.classList.add('left-column');
            parentcell.textContent = (parent === parentAIVs) ? 'Parent A' : 'Parent B';
            tablerow.appendChild(parentcell);
            for (let i = 0; i < stats.length; i++) {
                const tabledata = document.createElement('td');
                tabledata.classList.add('middle-column');
                tabledata.textContent = parent.includes(i) ? stats[i] : '';
                tablerow.appendChild(tabledata);
            }
            tablebody.appendChild(tablerow);
            //add probabilitycell
            if (parent === parentAIVs) {
                const probabilitycell = document.createElement('td');
                probabilitycell.colSpan = 2;
                probabilitycell.classList.add('right-column');
                probabilitycell.textContent = `1/${(denominator / numerator).toFixed(decimals)}`;
                tablerow.appendChild(probabilitycell);
            }
        }
    }
}

document.getElementById('target-ivs-header-row')!.addEventListener('click', (event: MouseEvent) => {
    if (event.target instanceof HTMLTableCellElement && 'stat' in event.target.dataset) {
        //toggle background color.
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
