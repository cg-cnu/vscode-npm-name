'use strict';
import * as vscode from 'vscode';
import * as name from 'npm-name';
import * as validate from 'validate-npm-package-name';

export const activate = (context: vscode.ExtensionContext) => {

    let query = vscode.commands.registerCommand('npmName.query', () => {

        // Ask user for the name
        vscode.window.showInputBox({
            ignoreFocusOut: true,
            placeHolder: 'Enter the package name!',
        }).then(inputName => {
            if (!inputName) {
                return;
            }
            // check availability
            name(inputName).then(available => {
                if (!available) {
                    // TODO: created by salapati @ 2017-10-7 21:24:19
                    // different fun messages ?
                    vscode.window.showInformationMessage("oops! That's taken!")
                    return;
                }
                // TODO: created by salapati @ 2017-10-7 22:03:18
                // Provide the validity info here and point to the log
                vscode.window.showInformationMessage(`Yo! ${inputName} is available`);
                // HACK: implementation noticed by salapati @ 2017-10-7 21:22:25
                // need to find a proper way to show this message
                console.log(validate(inputName));
            });
        });
    });
    context.subscriptions.push(query);
}