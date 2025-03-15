import {
    type AvailableBackendPackagesMap,
    type AvailableFrontendPackagesMap,
    SkipPackageData,
    type ChoiceOps,
} from '@ragarwal06/sap-cloud-application-generator-types';

export const getPackageListChoices = (
    choices:
        | Partial<AvailableFrontendPackagesMap>
        | Partial<AvailableBackendPackagesMap>,
    withSkip = true,
) => {
    const choiceArray: ChoiceOps[] = [];

    withSkip &&
        choiceArray.push({
            value: SkipPackageData.displayName?.toLowerCase(),
            name: SkipPackageData.displayName,
            short: SkipPackageData.displayName,
        });

    for (const [key, value] of Object.entries(choices)) {
        choiceArray.push({
            value: key,
            name: value.displayName,
            short: value.displayName,
        });
    }

    return choiceArray;
};

export const getValueFromChoiceOps = (choices: ChoiceOps[]): string[] => {
    const options: string[] = [];
    choices.forEach((e) => options.push(e.value));
    return options;
};
