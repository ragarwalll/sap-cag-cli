import inquirer from 'inquirer';
import {
    type UserInputMetadataInput,
    type UserInputMetadataConfirm,
    type AvailablePackagesMap,
    availableFrontendPackages,
    type AvailableFrontendPackagesMap,
    type UserInputMetadata,
    type PackageMetadata,
    type AvailableBackendPackagesMap,
    availableBackendPackages,
    type UserInputMetadataList,
} from '@ragarwal06/sap-cloud-application-generator-types';
import {
    getPackageListChoices,
    getValueFromChoiceOps,
} from '@/utils/inquirer.js';

export const promptInput = async (
    metadata: UserInputMetadataInput,
): Promise<string> => {
    const { input } = await inquirer.prompt<{
        input: string;
    }>({
        name: 'input',
        type: 'input',
        message: metadata.message,
        default: metadata.input,
        transformer: (input: string) => input.trim(),
    });
    return input;
};

export const promptConfirm = async (
    metadata: UserInputMetadataConfirm,
): Promise<boolean> => {
    const { confirm } = await inquirer.prompt<{ confirm: boolean }>({
        name: 'confirm',
        type: 'confirm',
        message: metadata.message,
        default: metadata.confirm,
    });
    return confirm;
};

export const promptList = async (
    metadata: UserInputMetadataList,
): Promise<string> => {
    const _availableValues = getValueFromChoiceOps(metadata.list);
    const { list } = await inquirer.prompt<{
        list: (typeof _availableValues)[number];
    }>({
        name: 'list',
        type: 'list',
        message: metadata.message,
        choices: metadata.list,
        default: metadata.value,
    });
    return list;
};

export const promptPackageMetadata = async (metadata: UserInputMetadata) => {
    if (metadata == undefined) return;

    const userInputMetadata: UserInputMetadataInput = {
        name: {
            name: 'default',
            alt: '',
        },
        type: metadata.type,
        description: '',
        isArgument: false,
        message: metadata.message,
        input: metadata.value,
    };
    metadata.value = await promptInput(userInputMetadata);
};

export const promptPackageMetadataList = async ({
    metadata = {},
    next = [],
}: {
    metadata: Record<string, UserInputMetadata>;
    next: string[];
}): Promise<void> => {
    if (Object.keys(metadata).length == 0) return;

    const index = next[0];
    if (index === undefined) return;

    const data = metadata[index];
    if (data == undefined) return;

    await promptPackageMetadata(data);
    next.shift();
    await promptPackageMetadataList({
        metadata,
        next,
    });
};

export interface PromptPackageOptions<T extends Partial<AvailablePackagesMap>> {
    message: string;
    choices: T;
    defaultValue: Partial<keyof T>;
}

export const promptPackageList = async <
    T extends Partial<AvailablePackagesMap>,
>({
    message = '',
    choices,
    defaultValue,
}: PromptPackageOptions<T>): Promise<T> => {
    const { list } = await inquirer.prompt<{ list: keyof T | 'skip' }>({
        name: 'list',
        type: 'list',
        message: message,
        choices: getPackageListChoices(choices),
        default: defaultValue,
    });

    if (list === 'skip') return {} as T;
    const packageDetails = choices[list] as PackageMetadata;

    // ask metadata
    if (Object.keys(packageDetails.metadata).length !== 0) {
        await promptPackageMetadataList({
            metadata: packageDetails.metadata,
            next: Object.keys(packageDetails.metadata),
        });
    }

    return { [list]: packageDetails } as Pick<T, keyof T>;
};

export const promptFrontendPackages = async (): Promise<
    Partial<AvailablePackagesMap>
> => {
    try {
        return await promptPackageList<AvailableFrontendPackagesMap>({
            message: 'Choose the frontend package',
            choices: availableFrontendPackages,
            defaultValue: 'ui5',
        });
    } catch (e: unknown) {
        console.log('Skipping frontend package', e);
        return {};
    }
};

export const promptBackendPackages = async (): Promise<
    Partial<AvailablePackagesMap>
> => {
    try {
        return await promptPackageList<AvailableBackendPackagesMap>({
            message: 'Choose the backend package',
            choices: availableBackendPackages,
            defaultValue: 'springboot',
        });
    } catch (e: unknown) {
        console.log('Skipping backend package', e);
        return {};
    }
};
