'use strict';
import * as vscode from 'vscode';
import * as name from 'npm-name';
import * as validate  from 'validate-npm-package-name';

export const activate = (context: vscode.ExtensionContext) => {

    let query = vscode.commands.registerCommand('npmName.query', () => {
        // The code you place here will be executed every time your command is executed

        // Display a message box to the user
        vscode.window.showInputBox({
            ignoreFocusOut: true,
            placeHolder: 'enter package name',
        }).then( name => {
            if(!name){
                return;
            }
            // find if the package already exists
            // if not validate and give report to console
        });
    });
    context.subscriptions.push(query);
}

// this method is called when your extension is deactivated
export const deactivate = () => { }