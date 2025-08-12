import { probabilityData } from './probabilitycalcs.js';

const stats = ['HP', 'Atk', 'Def', "SpA", "SpD", "Spe"]
const tablebody = document.getElementById("tablebody")!;
let targetIVs: number[] = [];

function calculate(targetIVs: number[]): void {
    tablebody.replaceChildren();
    const probabilitydata = probabilityData(targetIVs);
    //generate tablerows with the data.
    for (const [parentAIVs, parentBIVs, numerator, denominator] of probabilitydata) {
        //add a row for each parent
        for (const parent of [parentAIVs, parentBIVs]) {
            const tablerow = document.createElement("tr");
            for (let i = 0; i < stats.length; i++) {
                const tabledata = document.createElement("td");
                tabledata.textContent = parent.includes(i) ? stats[i] : "";
                tablerow.appendChild(tabledata);
            }
            tablebody.appendChild(tablerow);
        }
        //add probability row
        const probabilityrow = document.createElement("tr");
        const cell = document.createElement("td");
        cell.colSpan = 6;
        cell.textContent = `Probability: 1/${(denominator / numerator).toFixed(2)}`;
        probabilityrow.appendChild(cell);
        tablebody.appendChild(probabilityrow);
    }
}

document.getElementById("target-ivs-header-row")!.addEventListener("click", (event: MouseEvent) => {
    if (event.target instanceof HTMLTableCellElement) {
        //toggle background color.
        event.target.classList.toggle('selected');
        //update targetIVs
        const index = Number(event.target.dataset.stat);
        if (targetIVs.includes(index)) {
            targetIVs = targetIVs.filter((x) => x !== index);
        } else {
            targetIVs.push(index);
            targetIVs.sort((a, b) => a - b);
        }
        calculate(targetIVs);
    }
});
