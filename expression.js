/*
Fōrmulæ chemistry package. Module for expression definition & visualization.
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

Chemistry.Element = class extends Expression.Literal {
	getTag() {
		return "Chemistry.Element." + Chemistry.common.elements[this.atomicNumber - 1][0];
	}
	
	getName() {
		return Chemistry.common.elements[this.atomicNumber - 1][0];
	}
	
	getLiteral()  {
		return Chemistry.common.elements[this.atomicNumber - 1][1];
	}
};

Chemistry.HomonuclearCompound = class extends Expression {
	getTag() {
		return "Chemistry.HomonuclearCompound";
	}
	
	canHaveChildren(n) {
		return n => n == 2;
	}
	
	getName() {
		return "Homonuclear compound";
	}
	
	prepareDisplay(context) {
		let left = this.children[0], right = this.children[1];
		let leftParentheses = left.getTag() === "Chemistry.HeteronuclearCompound";
		
		left.prepareDisplay(context);
		{
			let bkp = context.fontInfo.size;
			context.fontInfo.setSizeRelative(context, -4);
			
			right.prepareDisplay(context);
			
			context.fontInfo.setSizeAbsolute(context, bkp);
		}
		
		left.x = leftParentheses ? 4 : 0;
		left.y = 0;
		
		if (left.height >= right.horzBaseline) {
			right.y = left.height - right.horzBaseline;
		}
		else {
			right.y = left.horzBaseline;
		}
		
		this.width = (right.x = left.x + left.width + (leftParentheses ? 4 : 0) + 1) + right.width;
		this.height = right.y + right.height;
		
		this.horzBaseline = left.horzBaseline;
		this.vertBaseline = left.vertBaseline;
	}
	
	display(context, x, y) {
		let left = this.children[0], right = this.children[1];
		
		if (left.getTag() === "Chemistry.HeteronuclearCompound") {
			left.drawParenthesesAround(context, x + left.x, y + left.y);
		}
		
		left.display(context, x + left.x, y + left.y);
		
		{
			let bkp = context.fontInfo.size;
			context.fontInfo.setSizeRelative(context, -4);
			
			right.display(context, x + right.x, y + right.y);
			
			context.fontInfo.setSizeAbsolute(context, bkp);
		}
	}
};

Chemistry.HeteronuclearCompound = class extends Expression {
	getTag() {
		return "Chemistry.HeteronuclearCompound";
	}
	
	canHaveChildren(n) {
		return n => n >= 2;
	}
	
	getName() {
		return "Heteronuclear compound";
	}
	
	prepareDisplay(context) {
		this.horzBaseline = 0;
		this.width = 0;
		
		let i, n = this.children.length;
		let expr;
		
		for (i = 0; i < n; ++i) {
			(expr = this.children[i]).prepareDisplay(context);
			
			if (i > 0) ++this.width;
			
			if (expr.getTag() == "Chemistry.HeteronuclearCompound") { // parentheses
				this.width += 4;
				expr.x = this.width;
				this.width += 4;
			}
			else {
				expr.x = this.width;
			}
			
			this.width += expr.width;
			if (expr.horzBaseline > this.horzBaseline) this.horzBaseline = expr.horzBaseline;
		}
		
		let maxSemiHeight = 0;
		for (i = 0; i < n; ++i) {
			expr = this.children[i];
			expr.y = this.horzBaseline - expr.horzBaseline;
			if (expr.height - this.horzBaseline > maxSemiHeight) maxSemiHeight = expr.height - this.horzBaseline;
		}
		
		this.height = this.horzBaseline + maxSemiHeight;
		this.vertBaseline = Math.round(this.width / 2);
	}
	
	display(context, x, y) {
		let expr;
		for (let i = 0, n = this.children.length; i < n; ++i) {
			expr = this.children[i]
			
			if (expr.getTag() === "Chemistry.HeteronuclearCompound") { // parentheses
				expr.drawParenthesesAround(context, x + expr.x, y + expr.y);
			}
			
			expr.display(context, x + expr.x, y + expr.y);
		}
	}
};

Chemistry.setExpressions = function(module) {
	console.log(Chemistry.common);
	
	for (let i = 0, n = Chemistry.common.elements.length; i < n; ++i) {
		Formulae.setExpression(module, "Chemistry.Element." + Chemistry.common.elements[i][0], {
			clazz: Chemistry.Element,
			atomicNumber: i + 1
		});
	}
	
	[ "ElementFromAtomicNumber", "ElementFromSymbol", "GetAtomicNumber", "GetAtomicMass", "GetElementSymbol", "GetElementName" ].forEach(tag => Formulae.setExpression(module, "Chemistry." + tag, {
		clazz:        Expression.Function,
		getTag:       () => "Chemistry." + tag,
		getMnemonic:  () => tag,
		getName:      () => tag,
		getChildName: index => "abc"
	}));
	
	Formulae.setExpression(module, "Chemistry.HomonuclearCompound",   Chemistry.HomonuclearCompound);
	Formulae.setExpression(module, "Chemistry.HeteronuclearCompound", Chemistry.HeteronuclearCompound);
};

