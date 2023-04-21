import {
     PCD,
     PCDPackage,
     SerializedPCD,
     BigIntArgument
} from "@pcd/pcd-types";
import JSONBig from "json-bigint";
import {
     hash2,
     verifySignature
} from "maci-crypto";
import { v4 as uuid } from "uuid";
import {
     signatureToBigInt,
     stringifyBigIntArray,
     unstringifyBigIntArray
} from "../utils/bigint";
import { JubJubSignatureCardBody } from "./CardBody";

export const JubJubSignatureTypeName = "jubjub-signature-pcd";

export class JubJubSignaturePCD implements PCD<JubJubSignaturePCDClaim, JubJubSignaturePCDProof> {

     type = JubJubSignatureTypeName;
     claim: JubJubSignaturePCDClaim;
     proof: JubJubSignaturePCDProof;
     id: string;

     public constructor(
          id: string,
          claim: JubJubSignaturePCDClaim,
          proof: JubJubSignaturePCDProof
     ) {
          this.claim = claim;
          this.id = id;
          this.proof = proof;
     }
}

export interface JubJubSignaturePCDArgs {
     xR8: BigIntArgument;
     yR8: BigIntArgument;
     S: BigIntArgument;
     xSigningKeys: BigIntArgument;
     ySigningKeys: BigIntArgument;
     message: BigIntArgument;
     xMessagePreImage: BigIntArgument;
     yMessagePreImage: BigIntArgument;
}

export type JubJubSignature = {
     /**
      * Stringified `BigInt` array
      */
     R8: string[],

     /**
      * Stringified `BigInt`
      */
     S: string;
};

export interface JubJubSignaturePCDClaim {

     signature: JubJubSignature;

     /**
      * Stringified `BigInt` array
      */
     signingKeys: string[];

     /**
      * Stringified `BigInt`
      */
     message: string;

     /** 
      * Stringified `BigInt` array
      */
     messagePreImage: string[];
}

//@dev Not too sure about how proof and claim differ here (?)
export interface JubJubSignaturePCDProof {
     signature: JubJubSignature;

     /**  
      * Stringified `BigInt` array
      */
     signingKeys: string[];

     /**
      * Stringified `BigInt`
      */
     message: string;

     /** 
     * Stringified `BigInt` array
     */
     messagePreImage: string[];
}


export const prove = async (args: JubJubSignaturePCDArgs): Promise<PCD<JubJubSignaturePCDClaim, JubJubSignaturePCDProof>> => {
     if ((!args.xR8.value) || (!args.yR8.value) || (!args.S.value)) {
          throw new Error("Invalid signature");
     }
     const signature = { R8: [ BigInt(args.xR8.value), BigInt(args.yR8.value) ], S: BigInt(args.S.value) };

     if ((!args.xSigningKeys.value) || (!args.ySigningKeys.value)) {
          throw new Error("Invalid signing keys");
     }
     const signingKeys = [ BigInt(args.xSigningKeys.value), BigInt(args.ySigningKeys.value) ];

     if (!args.message.value) {
          throw new Error("Invalid message");
     }
     const message = BigInt(args.message.value);

     if ((!args.xMessagePreImage.value) || (!args.yMessagePreImage.value)) {
          throw new Error("Invalid message pre-image");
     }
     const preImage = [ BigInt(args.xMessagePreImage.value), BigInt(args.yMessagePreImage.value) ];

     const verified = verifySignature(message, signature, signingKeys);
     const computedHash = hash2(preImage);

     const proof = {
          signature: {
               R8: stringifyBigIntArray(signature.R8),
               S: signature.S.toString()
          },
          signingKeys: stringifyBigIntArray(signingKeys),
          message: message.toString(),
          messagePreImage: stringifyBigIntArray(preImage)
     };

     const claim = {
          signature: {
               R8: stringifyBigIntArray(signature.R8),
               S: signature.S.toString()
          },
          signingKeys: stringifyBigIntArray(signingKeys),
          message: message.toString(),
          messagePreImage: stringifyBigIntArray(preImage)
     };

     if (verified && computedHash === message) {
          return new JubJubSignaturePCD(uuid(), proof, claim);
     }

     throw new Error(`Could not generate proof. Verified: ${verified}, Hash: ${computedHash === message}`);
};


export const verify = async (pcd: JubJubSignaturePCD) => {
     const signatureVerified = verifySignature(BigInt(pcd.proof.message), signatureToBigInt(pcd.proof.signature), unstringifyBigIntArray(pcd.proof.signingKeys));
     const preImageVerified = hash2(unstringifyBigIntArray(pcd.proof.messagePreImage)) === BigInt(pcd.proof.message);
     return (signatureVerified && preImageVerified);
};

export const serialize = async (
     pcd: JubJubSignaturePCD
): Promise<SerializedPCD<PCD<JubJubSignaturePCD>>> => {
     return {
          type: JubJubSignatureTypeName,
          pcd: JSONBig().stringify(pcd)
     } as SerializedPCD<PCD<JubJubSignaturePCD>>;
};

export const deserialize = async (
     serialized: string
): Promise<JubJubSignaturePCD> => {
     return JSONBig().parse(serialized);
};

export const getDisplayOptions = (pcd: JubJubSignaturePCD) => {
     return {
          header: "JubJub Signature",
          displayName: 
               "jubjub-sig-" +
               pcd.claim.signature.R8[0].toString().slice(0, 5)
     }
}

export const JubJubSignaturePCDPackage: PCDPackage<
     JubJubSignaturePCDClaim,
     JubJubSignaturePCDProof,
     JubJubSignaturePCDArgs
> = {
     name: JubJubSignatureTypeName,
     renderCardBody: JubJubSignatureCardBody,
     getDisplayOptions,
     prove,
     verify,
     serialize,
     deserialize
};