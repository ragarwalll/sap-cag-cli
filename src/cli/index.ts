import { Command } from 'commander';
import {
    AFTER_ALL,
    availableFlags,
    type AvailableFlagsType,
    PACKAGE_DESCRIPTION,
    PACKAGE_NAME,
    type UserInputMetadataConfirm,
    type UserInputMetadataInput,
    boilerplateDefaults,
} from '@ragarwal06/sap-cloud-application-generator-types';
import { getPackageVersion } from '@/utils/details/package-details.js';
import chalk from 'chalk';
import { logger } from '@/utils/logger.js';
import {
    INSTALLING_DEPENDENCIES,
    NON_INTERCTIVE_SHELL,
    NON_INTERCTIVE_SHELL_REQUIRED,
    SEE_YOU_SOON,
    SELECTION_SUCCESS,
} from '@/utils/constants/message.js';
import {
    promptBackendPackages,
    promptConfirm,
    promptFrontendPackages,
    promptInput,
} from '@/cli/ask-user-details.js';
import {
    formatArgumentInput,
    formatOptionInput,
} from '@/utils/constants/cli/cli-transformer.js';
import {
    getConsumerPackageManager,
    getIsConsumerUsingShell,
} from '@ragarwal06/sap-cloud-application-generator';

const supportedFlags: Partial<AvailableFlagsType>[] = [
    'name',
    'noGit',
    'noInstall',
    'default',
];

export const renderGenerator = async () => {
    const userOptions = boilerplateDefaults;
    const program = new Command().name(PACKAGE_NAME);
    program
        // description for the program
        .description(PACKAGE_DESCRIPTION)
        // Specify version
        .version(
            getPackageVersion(),
            formatOptionInput(availableFlags.version.name),
            availableFlags.version.description,
        )
        // Add help text end output
        .addHelpText(
            'afterAll',
            `\n ${AFTER_ALL.description[0]} ${chalk.bold(
                `${AFTER_ALL.description[1]}`,
            )} ${AFTER_ALL.description[2]} ${chalk.underline(
                `${AFTER_ALL.description[3]}`,
            )}`,
        );

    supportedFlags.forEach((e) => setCLIProps(e, program));

    program
        // Parse user cmd option
        .parse(process.argv);

    // Set appName by user
    const projectName = program.args[0];
    if (projectName) userOptions.appName = projectName;

    // Set flags from user
    userOptions.flags = program.opts();

    // Check if user is using an interactive shell
    try {
        if (getIsConsumerUsingShell()) {
            logger.warn(NON_INTERCTIVE_SHELL);

            const error = new Error();

            (error as any).isTTYError = true;
            throw error;
        }

        // constinue to ask user about the application to be generated
        if (!userOptions.flags.default) {
            // set app name
            if (!projectName)
                userOptions.appName = await promptInput(
                    availableFlags.name as UserInputMetadataInput,
                );

            // // get frontend packages
            const frontendPackages = await promptFrontendPackages();

            // // get backend packages
            const backendPackages = await promptBackendPackages();

            // set packages
            userOptions.packages = { ...frontendPackages, ...backendPackages };

            // set xsuaa
            userOptions.enableXSUAA = await promptConfirm(
                availableFlags.enableXSUAA as UserInputMetadataConfirm,
            );

            // set no git
            userOptions.flags.noGit = await promptConfirm(
                availableFlags.noGit as UserInputMetadataConfirm,
            );

            // set post/pre install
            if (!userOptions.flags.noInstall)
                userOptions.flags.noInstall = await promptConfirm(
                    availableFlags.noInstall as UserInputMetadataConfirm,
                );

            if (!userOptions.flags.noInstall)
                logger.success(INSTALLING_DEPENDENCIES);
            else
                logger.info(
                    `Umm 😶! You can run ${chalk.underline(
                        `${getConsumerPackageManager()} install`,
                    )} to install all the dependencies`,
                );
        }
    } catch (err) {
        if (err instanceof Error && (err as any).isTTYError)
            await errorWithDefaults();
        else throw err;
    }

    return userOptions;
};

export const setCLIProps = (
    e: Partial<AvailableFlagsType>,
    program: Command,
) => {
    const flagDetails = availableFlags[e];
    let value: boolean | string = '';
    switch (flagDetails.type) {
        case 'confirm':
            value = (flagDetails as UserInputMetadataConfirm).confirm;
            break;
        case 'input':
            value = (flagDetails as UserInputMetadataInput).input;
            break;
        default:
            break;
    }

    if (flagDetails.isArgument && typeof value === 'string' && !value)
        program
            // set arguments
            .argument(
                formatArgumentInput(flagDetails.name),
                flagDetails.description,
                value,
            );
    else
        program
            // set options
            .option(
                formatArgumentInput(flagDetails.name),
                flagDetails.description,
                value,
            );
};

export const errorWithDefaults = async () => {
    logger.warn(`${NON_INTERCTIVE_SHELL_REQUIRED}\n`);

    // ask continue with default params
    if (
        !(await promptConfirm(
            availableFlags.default as UserInputMetadataConfirm,
        ))
    ) {
        logger.info(SEE_YOU_SOON);
        process.exit(0);
    }

    // inform user
    logger.info(SELECTION_SUCCESS);
};
