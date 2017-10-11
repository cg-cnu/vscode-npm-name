'use strict';
import * as vscode from 'vscode';
import * as name from 'npm-name';
import * as validate from 'validate-npm-package-name';

export const activate = (context: vscode.ExtensionContext) => {

    let query = vscode.commands.registerCommand('npmName.query', () => {
        const falseMsg: string[] = [
            "oops! 🤦‍",
            "Thats 'Taken 3' 🎦",
            "Better luck next time 🤷🏾",
            "You just missed it! 🚌💨 🏃💦",
            "You are late, Mate! Its gone! ⏳ 🙄"
        ]
        const trueMsg: string[] = [
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
            if (!input || input.trim() === " ") {
                return;
            }
            const pkgNames: string[] = input.trim().split(',')
            // check availability
            for (let pkgName of pkgNames) {
                name(pkgName).then(available => {
                    // if not available show message and return
                    if (!available) {
                        vscode.window.showErrorMessage(
                            `${falseMsg[Math.floor(Math.random() * falseMsg.length)]} -- '${pkgName}' is not available 😞`)
                        return;
                    }
                    // if available check validity
                    const validity: any = validate(pkgName);
                    // if valid for old and new packages
                    if (validity.validForNewPackages && validity.validForOldPackages) {
                        vscode.window.showInformationMessage(
                            `${trueMsg[Math.floor(Math.random() * trueMsg.length)]} -- '${pkgName}' is available 😊`);
                        return;
                    }
                    // if not vaid for any of the packages
                    if (!validity.validForNewPackages || !validity.validForOldPackages) {
                        vscode.window.showWarningMessage(`'${pkgName}' has some issues. Check debug console!`);
                        // FIXME: noticed by user @ 2017-10-11 01:30:54
                        // find the better way to log to the output
                        console.log(`# NPM Name ####################`);
                        console.log(`'${pkgName}' is not valid for the following reasons...`);
                        for( let warning of validity.warnings ){
                            console.log(`* ${warning}`);
                        }
                        console.log(`###############################`);
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