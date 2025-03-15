import { promptConfirm, promptList } from '@/cli/ask-user-details.js';
import { ABORTING_INSTALLTION } from '@/utils/constants/message.js';
import {
    Scaffold,
    checkIfDirExists,
    checkIfIsEmpty,
    clearDir,
    generateProjectNameAndPath,
    getConsumerPackageManager,
} from '@ragarwal06/sap-cloud-application-generator';
import chalk from 'chalk';
import { logger } from '@/utils/logger.js';
import ora, { type Ora } from 'ora';
import path from 'path';
import {
    type Boilerplate,
    availableOverrideChoices,
    sureConfirm,
} from '@ragarwal06/sap-cloud-application-generator-types';

export const prepareDirectoryForPackages = async (metadata: Boilerplate) => {
    // prepare dir for installation
    let dummy;
    console.log(dummy);
    const consumerPackageManager = getConsumerPackageManager();
    if (!metadata.flags.noInstall)
        logger.info(
            `\nUsing ${chalk.cyan.bold.underline(
                consumerPackageManager,
            )} package installer\n`,
        );

    const { path: projectDir, appName } = generateProjectNameAndPath(
        metadata.appName,
    );

    const projectDirectory = path.resolve(process.cwd(), projectDir);
    const loader = ora(
        `Scaffolding all packages in ${chalk.cyan.bold.underline(
            projectDir,
        )}...\n`,
    ).start();

    if (checkIfIsEmpty(projectDirectory))
        loader.info(
            `folder with the same name ${chalk.bold.gray.underline(
                appName,
            )} exists, continuing...`,
        );
    else if (
        checkIfDirExists(projectDirectory) &&
        !checkIfIsEmpty(projectDirectory)
    ) {
        loader.stopAndPersist();
        await userConfirmCleanDir(loader, appName, projectDirectory);
    }
    loader.start();
    return new Promise<void>((resolve, reject) => {
        try {
            const scaffolder = new Scaffold(metadata, projectDirectory);
            scaffolder.on('msg', (data: string) => {
                if (data == undefined || data.trim() == '') return;
                data = data.replace(/\n$/, '');
                loader.start(data);
            });
            scaffolder.on('error', (data: string) => {
                loader.fail(data);
                reject();
            });
            scaffolder.on('end', (data: string) => {
                loader.succeed(data);
                resolve();
            });
            dummy = scaffolder.start();
        } catch (e: unknown) {
            console.error(e);
            loader.fail('Error occoured while scaffolding');
            reject();
        } finally {
            loader.stop();
        }
    });
};

const userConfirmCleanDir = async (
    loader: Ora,
    appName: string,
    projectDirectory: string,
) => {
    const userInput = await promptList(availableOverrideChoices);
    if (userInput == 'abort') abortInstallation(loader);

    const userConfirm = await promptConfirm(sureConfirm);
    if (!userConfirm) abortInstallation(loader);

    loader.info(
        `Cool 👍! Cleaning the folder ${chalk.bold.gray.underline(
            appName,
        )} & continuing installation!`,
    );
    clearDir(projectDirectory);
};

export const abortInstallation = (loader: Ora) => {
    loader.fail(ABORTING_INSTALLTION);
    process.exit(1);
};
