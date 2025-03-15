import gradient from 'gradient-string';
import { ASCII_PACKAGE_NAME } from '@/utils/constants/ascii-text.js';
import { getConsumerPackageManager } from '@ragarwal06/sap-cloud-application-generator';

// colors inpired by SAP Evening Horizon theme
const eveningHorizon = {
    accent1: '#FFDF72',
    accent2: '#FF8CB2',
    accent3: '#FECBDA',
    accent4: '#FFAFED',
    accent5: '#D3B6FF',
};

export const renderPackageTitle = () => {
    const colored = gradient(Object.values(eveningHorizon));
    const pkg = getConsumerPackageManager();

    if (pkg === 'yarn' || pkg === 'pnpm') console.log('');
    console.log(colored.multiline(ASCII_PACKAGE_NAME));
};
