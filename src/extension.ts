// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { promises } from 'dns';

export function activate(context: vscode.ExtensionContext) {
	let key_map: { [key: string]: string; } = {
		'`':'⋄', '1':'¨', '2':'¯', '3':'<', '4':'≤', '5':'=', '6':'≥', '7':'>', '8':'≠', '9':'∨', '0':'∧', '-':'×', '=':'÷',
		'q':'?', 'w':'⍵', 'e':'∊', 'r':'⍴', 't':'~', 'y':'↑', 'u':'↓', 'i':'⍳', 'o':'○', 'p':'*', '[':'←', ']':'→',
		'a':'⍺', 's':'⌈', 'd':'⌊', 'f':'_', 'g':'∇', 'h':'∆', 'j':'∘', 'k':'\'', 'l':'⎕', ';':'⍎', '\'':'⍕', '\\':'⊢',
		'z':'⊂', 'x':'⊃', 'c':'∩', 'v':'∪', 'b':'⊥', 'n':'⊤', 'm':'|', ',':'⍝', '.': '⍀', '/':'⌿',
		'~':'⌺', '!':'⌶', '@':'⍫', '#':'⍒', '$':'⍋', '%':'⌽', '^':'⍉', '&':'⊖', '*':'⍟', '(':'⍱', ')':'⍲', '_':'!', '+':'⌹',
		'Q':'?', 'W':'⍵', 'E':'⍷', 'R':'⍴', 'T':'⍨', 'Y':'↑', 'U':'↓', 'I':'⍸', 'O':'⍥', 'P':'⍣', '{':'⍞', '}':'⍬',
		'A':'⍺', 'S':'⌈', 'D':'⌊', 'F':'_', 'G':'∇', 'H':'∆', 'J':'⍤', 'K':'⌸', 'L':'⌷', ':':'≡', '"':'≢', '|':'⊣',
		'Z':'⊆', 'X':'⊃', 'C':'∩', 'V':'∪', 'B':'⊥', 'N':'⊤', 'M':'|', '<':'⍪', '>':'⍙', '?':'⍠',
		' ':'⋄'
	};

	let pending = false;

	const command = vscode.commands.registerTextEditorCommand("extension.backtick", (te, e) => {
		e.insert(te.selection.active, "`");
		if (pending) {
			return;
		}
		pending = true;
		let active_pos = te.selection.active;
		let sub1 = vscode.workspace.onDidChangeTextDocument(_ => {
			sub1.dispose();
			let sub2 = vscode.workspace.onDidChangeTextDocument(ev => {
				sub2.dispose();
				let this_pos = ev.contentChanges[0].range.start;
				if (this_pos.line === active_pos.line
					&& (this_pos.character - active_pos.character) === 1
					&& ev.contentChanges[0].text.length === 1) {
						let replace_range = new vscode.Range(active_pos, this_pos.translate(0, 1));
						let key = ev.contentChanges[0].text;
						if (key in key_map) {
							let symbol = key_map[key];
							te.edit((e) => e.replace(replace_range, symbol)).then();
						}
				}
				pending = false;
			});
		});
	});

	context.subscriptions.push(command);
}

// this method is called when your extension is deactivated
export function deactivate() {}
