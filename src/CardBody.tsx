import {JubJubSignaturePCD} from "./JubJubSignaturePCD";
import React from 'react';

export function JubJubSignatureCardBody({pcd}: {pcd: JubJubSignaturePCD}) {
  return (
      <div style={{padding: "16px", overflow: "hidden", width: "100%"}}>
        <p> This PCD represents a JubJub Signature.</p>
        <div>R8: {"[" + pcd.claim.signature.R8[0].substring(0, 5) + "..., " + pcd.claim.signature.R8[1].substring(0, 5) + "... ]"}</div>
        <div>S: {pcd.claim.signature.S.substring(0, 5) + "..."} </div>
        <div>Message: {pcd.claim.message.substring(0, 5) + "..."}</div>
      </div>
  );
}