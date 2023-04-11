import { JubJubSignature } from "../src/JubJubSignaturePCD";

export const stringifyBigIntArray = (arr: bigint[]) => {
     return arr.map((i) => i.toString());
};

export const unstringifyBigIntArray = (arr: string[]) => {
     return arr.map((i) => BigInt(i));
};

export const signatureToBigInt = (signature: JubJubSignature) => {
     return {
          R8: signature.R8.map((i) => BigInt(i)),
          S: BigInt(signature.S)
     };
};