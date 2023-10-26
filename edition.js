/*
Fōrmulæ chemistry package. Module for edition.
Copyright (C) 2015-2023 Laurence R. Ugalde

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

'use strict';

export class Chemistry extends Formulae.Package {}

Chemistry.spec = [
	null, [ true,   1,   1, "#FF9A9A" ], [ false, 16,   0, null      ], [ true, 1,   2, "#FF9A9A" ],  //  1
	null, [ true,   2,   3, "#FF9A9A" ], [ false, 10,   0, null      ], [ true, 6,   5, "#FDFF8D" ],  //  2
	null, [ true,   2,  11, "#FF9A9A" ], [ false, 10,   0, null      ], [ true, 6,  13, "#FDFF8D" ],  //  3
	null, [ true,   2,  19, "#FF9A9A" ], [ true,  10,  21, "#9ACDFF" ], [ true, 6,  31, "#FDFF8D" ],  //  4
	null, [ true,   2,  37, "#FF9A9A" ], [ true,  10,  39, "#9ACDFF" ], [ true, 6,  49, "#FDFF8D" ],  //  5
	null, [ true,   2,  55, "#FF9A9A" ], [ true,  10,  71, "#9ACDFF" ], [ true, 6,  81, "#FDFF8D" ],  //  6
	null, [ true,   2,  87, "#FF9A9A" ], [ true,  10, 103, "#9ACDFF" ], [ true, 6, 113, "#FDFF8D" ],  //  7
	null,                                                                                             //  8
	null, [ false,  2,   0, null      ], [ true,  14,  57, "#9CFF9A" ],                               //  9
	null, [ false,  2,   0, null      ], [ true,  14,  89, "#9CFF9A" ],                               // 10
	null, [ true,   2, 119, null      ]                                                               // 11
];

Chemistry.editionElement = function() {
	if (Chemistry.periodcTable === undefined) {
		let table = document.createElement("table");
		let i, I = Chemistry.spec.length, j, J, n, color;
		let spec, row, cell, button;
		
		let callback = e => {
			Formulae.modal.style.display = "none";
			
			let newElement = Formulae.createExpression("Chemistry.Element." + Chemistry.common.elements[e.currentTarget.name - 1][0]);
			//newElement.atomicNumber = e.currentTarget.name
			Formulae.sExpression.replaceBy(newElement);
			
			Formulae.sHandler.prepareDisplay();
			Formulae.sHandler.display();
			Formulae.setSelected(Formulae.sHandler, newElement, false);
		};
		
		for (i = 0; i < I; ++i) {
			spec = Chemistry.spec[i];
			
			if (spec == null) {
				row = table.insertRow();
				continue;
			}
			
			J = spec[1];
			n = spec[2];
			color = spec[3];
			
			for (j = 0; j < J; ++j) {
				cell = row.insertCell();
				
				if (spec[0]) {
					button = document.createElement("button");
					button.innerHTML = (n + j) + "<br><b>" + Chemistry.common.elements[n + j - 1][1] + "</b>";
					button.style.width = "100%";
					if (color != null) button.style.background = color;
					button.title = Chemistry.common.elements[n + j - 1][0];
					button.addEventListener("click", callback);
					button.name = n + j;
					cell.appendChild(button);
				}
			}
		}
		
		Chemistry.periodicTable = table;
	}
	
	Formulae.modalContent.removeChild(Formulae.modalContent.childNodes[0]);
	Formulae.modalContent.appendChild(Chemistry.periodicTable);
	Formulae.modal.style.display = "block";
	Formulae.modal.focus();
}

Chemistry.setEditions = function() {
	Formulae.addEdition("Chemistry", null, "Select element ...", () => Chemistry.editionElement());
	
	[ "ElementFromAtomicNumber", "ElementFromSymbol", "GetAtomicNumber", "GetAtomicMass", "GetElementSymbol", "GetElementName" ].forEach(tag => {
		Formulae.addEdition("Chemistry", null, tag, () => Expression.wrapperEdition("Chemistry." + tag));
	});
	
	Formulae.addEdition("Chemistry", null, "Homonuclear compound",   () => Expression.binaryEdition("Chemistry.HomonuclearCompound", false));
	Formulae.addEdition("Chemistry", null, "Heteronuclaer compound", () => Expression.binaryEdition("Chemistry.HeteronuclearCompound", false));
};
