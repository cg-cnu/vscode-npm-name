'use strict';
import * as vscode from 'vscode';
import * as name from 'npm-name';
import * as validate from 'validate-npm-package-name';

export const activate = (context: vscode.ExtensionContext) => {

    let query = vscode.commands.registerCommand('npmName.query', () => {
        // TODO: created by user @ 2017-10-8 12:53:34
        // finetune these!
        const falseMsg = [
            "oops! 🤦‍",
            "Thats 'Taken 3' 🎦",
            "Better luck next time 🤷",
            "You just missed it! 🚌 🏃",
            "You are late, Mate! Its gone! ⏳"
        ]
        const trueMsg = [
            "You lucky...! 🙊",
            "The princes is yours :princess:",
            "Right on time ⏳",
            "Congratulations!! You found it 👏",
            "Get it while it last."
        ]

        // Ask user for the name
        vscode.window.showInputBox({
            ignoreFocusOut: true,
            placeHolder: 'Enter the package name!',
        }).then(inputName => {
            if (!inputName) {
                return;
            }
            // validate 
            inputName = inputName.trim()
            // check availability
            // TODO: created by user @ 2017-10-8 01:28:15
            // multiple in one go ?
            name(inputName).then(available => {
                if (!available) {
                    vscode.window.showInformationMessage(
                        falseMsg[Math.floor(Math.random() * falseMsg.length)])
                    return;
                }
                // check validity
                const validity = validate(inputName);
                if (validity.validForNewPackages && validity.validForOldPackages) {
                    vscode.window.showInformationMessage(`${trueMsg[Math.floor(Math.random() * trueMsg.length)]} '${inputName}' is available`);
                    return;
                }
                // wrong ?
                if (validity.validForNewPackages || validity.validForOldPackages) {
                    vscode.window.showInformationMessage(`'${inputName}' has some issues. Check debug console!`);
                    console.log(validity);
                    return;
                }
            }).catch(err => {
                console.log("Error requesting the package!")
                console.log(err)
            });
        });
    });
    context.subscriptions.push(query);
}