import { probabilityDataWithCache } from './probabilitycalcs.js';
//initial state, hardcoded to match default values of input fields.
const state = {
    targetIVs: [],
    options: {
        missingAIVs: 1,
        missingBIVs: 1
    }
};
const stats = ['HP', 'Atk', 'Def', 'SpA', 'SpD', 'Spe'];
const tablebody = document.getElementById('parent-ivs-data');
//fetches probability data and constructs the relevant tables.
function calculateAndRender() {
    tablebody.replaceChildren();
    const probabilitydata = probabilityDataWithCache(state.targetIVs, state.options);
    if (probabilitydata.length === 0) {
        document.getElementById('noresultplaceholder').classList.toggle('hidden', false);
        return;
    }
    document.getElementById('noresultplaceholder').classList.toggle('hidden', true);
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
}
document.getElementById('target-ivs-header-row').addEventListener('click', (event) => {
    if (event.target instanceof HTMLTableCellElement && 'stat' in event.target.dataset) {
        event.target.classList.toggle('selected');
        //update targetIVs
        const index = Number(event.target.dataset.stat);
        if (state.targetIVs.includes(index)) {
            state.targetIVs = state.targetIVs.filter((x) => x !== index);
        }
        else {
            state.targetIVs.push(index);
            state.targetIVs.sort((a, b) => a - b);
        }
        calculateAndRender();
    }
});
document.getElementById('options-body').addEventListener('input', (event) => {
    if (event.target instanceof HTMLInputElement) {
        //retrieve and sanitize value
        let value = Math.round(Number(event.target.value) || 0);
        value = Math.max(value, 0);
        value = Math.min(value, 3);
        event.target.value = value.toString();
        //update state
        state.options[event.target.dataset.prop] = value;
        calculateAndRender();
    }
});
