'use strict';
import * as vscode from 'vscode';
import * as name from 'npm-name';
import * as validate from 'validate-npm-package-name';

export const activate = (context: vscode.ExtensionContext) => {

    let query = vscode.commands.registerCommand('npmName.query', () => {
        const falseMsg = [
            "oops! 🤦‍",
            "Thats 'Taken 3' 🎦",
            "Better luck next time 🤷🏾",
            "You just missed it! 🚌💨 🏃💦",
            "You are late, Mate! Its gone! ⏳ 🙄"
        ]
        const trueMsg = [
            "You lucky...! 🙊😂",
            "The 👸🏾 is yours 😊",
            "Right on time 💣",
            "Congratulations!! You found 🦄",
            "Get it while it last ⏲️"
        ]

        // Ask user for the name
        vscode.window.showInputBox({
            ignoreFocusOut: true,
            placeHolder: 'Enter the package name!',
        }).then(input => {
            if (!input) {
                return;
            }
            // validate 
            // FIXME: noticed by user @ 2017-10-11 01:19:20
            // fails on ' ' as input
            const inputNames = input.trim().split(',')
            // check availability
            for (let inputName of inputNames) {
                name(inputName).then(available => {
                    // if not available show message and return
                    if (!available) {
                        vscode.window.showInformationMessage(
                            `${falseMsg[Math.floor(Math.random() * falseMsg.length)]} -- '${inputName}' is not available 😞`)
                        return;
                    }
                    // if available check validity
                    const validity = validate(inputName);
                    // if valid for old and new packages
                    if (validity.validForNewPackages && validity.validForOldPackages) {
                        vscode.window.showInformationMessage(
                            `${trueMsg[Math.floor(Math.random() * trueMsg.length)]} -- '${inputName}' is available 😊`);
                            return;
                        }
                    // if not vaid for any of the packages
                    if (!validity.validForNewPackages || !validity.validForOldPackages) {
                        vscode.window.showInformationMessage(`'${inputName}' has some issues. Check debug console!`);
                        console.log(validity);
                        return;
                    }
                }).catch(err => {
                    console.log("Error requesting the package!")
                    console.log(err)
                });
            }
        });
    });
    context.subscriptions.push(query);
}