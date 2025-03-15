import { type FlagsNames } from '@ragarwal06/sap-cloud-application-generator-types';

export const formatArgumentInput = ({
    name = 'name',
    alt = '',
}: FlagsNames): string => {
    if (alt.length === 0) return `--${name}`;
    if (alt.length === 1) return `-${alt}, --${name}`;
    return `--${name}`;
};

export const formatOptionInput = ({
    name = 'name',
    alt = '',
}: FlagsNames): string => {
    if (alt.length === 0) return `-${name}`;
    return `-${alt}, --${name}`;
};
