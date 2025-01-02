/*
Fōrmulæ chemistry package. Module for reduction.
Copyright (C) 2015-2025 Laurence R. Ugalde

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

Chemistry.fromNumber = async (fromNumber, session) => {
	let n = CanonicalArithmetic.getInteger(fromNumber.children[0]);
	if (n === undefined) {
		ReductionManager.setInError(fromNumber.children[0], "Expression must be a positive integer number");
		throw new ReductionError();
	}
	
	if (n <= 0 || n > Chemistry.common.elements.length) {
		ReductionManager.setInError(fromNumber.children[0], "Invalid number");
		throw new ReductionError();
	}
	fromNumber.replaceBy(Formulae.createExpression("Chemistry.Element." + Chemistry.common.elements[n - 1][0]));
	return true;
};

Chemistry.fromSymbol = async (fromSymbol, session) => {
	let stringExpr = fromSymbol.children[0];
	
	//if (stringExpr.getTag().equals(ChemistryDescriptor.TAG_SYMBOL)) {
	//	return false; // Ok, to keep is symbolically
	//}
	
	if (stringExpr.getTag() !== "String.String") {
		ReductionManager.setInError(fromSymbol.children[0], "Expression must be a string");
		throw new ReductionError();
	}
	
	let s = stringExpr.get("Value");
	
	let i = 0, n = Chemistry.common.elements.length;
	search: {
		for (; i < n; ++i) {
			if (Chemistry.common.elements[i][1] === s) {
				break search;
			}
		}
		
		ReductionManager.setInError(fromSymbol.children[0], "String does not match with any chemical symbol");
		throw new ReductionError();
	}
	
	fromSymbol.replaceBy(Formulae.createExpression(
		"Chemistry.Element." + Chemistry.common.elements[i][0])
	);
	return true;
};

Chemistry.getAtomicNumber = async (getAtomicNumber, session) => {
	let elementExpr = getAtomicNumber.children[0];
	
	if (!elementExpr.getTag().startsWith("Chemistry.Element.")) return false;
	
	getAtomicNumber.replaceBy(
		CanonicalArithmetic.createInternalNumber(
			CanonicalArithmetic.createInteger(elementExpr.atomicNumber, session)
		)
	);
	return true;
};

Chemistry.getAtomicSymbol = async (getAtomicSymbol, session) => {
	let elementExpr = getAtomicSymbol.children[0];
	
	if (!elementExpr.getTag().startsWith("Chemistry.Element.")) return false;
	
	let result = Formulae.createExpression("String.String");
	result.set("Value", Chemistry.common.elements[elementExpr.atomicNumber - 1][1]);
	getAtomicSymbol.replaceBy(result);
	return true;
};

Chemistry.getAtomicName = async (getAtomicName, session) => {
	let elementExpr = getAtomicName.children[0];
	
	if (!elementExpr.getTag().startsWith("Chemistry.Element.")) return false;
	
	let result = Formulae.createExpression("String.String");
	result.set("Value", Chemistry.common.elements[elementExpr.atomicNumber - 1][0]);
	getAtomicName.replaceBy(result);
	return true;
};

Chemistry.getAtomicMass = async (getAtomicMass, session) => {
	let elementExpr = getAtomicMass.children[0];
	
	if (!elementExpr.getTag().startsWith("Chemistry.Element.")) return false;
	
	getAtomicMass.replaceBy(
		CanonicalArithmetic.createInternalNumber(
			CanonicalArithmetic.createDecimal(Chemistry.common.elements[elementExpr.atomicNumber - 1][2], session)
		)
	);
	return true;
};

Chemistry.setReducers = () => {
	ReductionManager.addReducer("Chemistry.ElementFromAtomicNumber", Chemistry.fromNumber,      "Chemistry.fromNumber");
	ReductionManager.addReducer("Chemistry.ElementFromSymbol",       Chemistry.fromSymbol,      "Chemistry.fromSymbol");
	ReductionManager.addReducer("Chemistry.GetAtomicNumber",         Chemistry.getAtomicNumber, "Chemistry.getAtomicNumber");
	ReductionManager.addReducer("Chemistry.GetAtomicMass",           Chemistry.getAtomicMass,   "Chemistry.getAtomicMass");
	ReductionManager.addReducer("Chemistry.GetElementSymbol",        Chemistry.getAtomicSymbol, "Chemistry.getAtomicSymbol");
	ReductionManager.addReducer("Chemistry.GetElementName",          Chemistry.getAtomicName,   "Chemistry.getAtomicName");
};
