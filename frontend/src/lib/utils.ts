import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getCoefsFromString = (coeffString: string) => {
  const coefs = coeffString.split(',').map(c => c.trim()).filter(c => c);
  return coefs
}

export const formatPolynomialFromString = (coeffString: string) => {
  const coefs = getCoefsFromString(coeffString); 
  return formatPolynomial(coefs);
}

export const formatPolynomial = (coeffs: string[]) => {
            if (coeffs.length === 0) return '0';
            if (coeffs.length === 1) return coeffs[0];
            
            let result = '';
            for (let i = 0; i < coeffs.length; i++) {
                const coeff = coeffs[i];
                const power = coeffs.length - 1 - i;
                
                if (i > 0 && parseFloat(coeff) >= 0) result += ' + ';
                else if (parseFloat(coeff) < 0) result += ' - ';
                
                const absCoeff = Math.abs(parseFloat(coeff));
                
                if (power === 0) {
                    result += absCoeff;
                } else if (power === 1) {
                    result += (absCoeff === 1 ? 's' : `${absCoeff}s`);
                } else {
                    result += (absCoeff === 1 ? `s^${power}` : `${absCoeff}s^${power}`);
                }
            }
            return result;
        };
        

export const formatTransferFunction = ({numerator, denominator} : {numerator: string, denominator: string}) => {
        if (!numerator || !denominator) return '';
        
        // Format numerator
        const numCoeffs = numerator.split(',').map(c => c.trim()).filter(c => c);
        const denCoeffs = denominator.split(',').map(c => c.trim()).filter(c => c);
        
        
        const numFormatted = formatPolynomial(numCoeffs);
        const denFormatted = formatPolynomial(denCoeffs);
        
        return `G(s) = (${numFormatted}) / (${denFormatted})`;
    };

