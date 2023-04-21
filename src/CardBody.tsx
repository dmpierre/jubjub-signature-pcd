import { FieldLabel, HiddenText, Separator } from "@pcd/passport-ui";
import { JubJubSignaturePCD } from "jubjub-signature-pcd";
import styled from "styled-components";

export function JubJubSignatureCardBody({
  pcd,
}: {
  pcd: JubJubSignaturePCD;
}) {
  console.log("PCD: ", pcd);   
  return (
    <Container>
      <p>
        This PCD represents a JubJub Signature.
      </p>
      <Separator />
      <FieldLabel>Signature unique ID</FieldLabel>
      <HiddenText text={pcd.id} />
    </Container>
  );
}

const Container = styled.div`
  padding: 16px;
  overflow: hidden;
  width: 100%;
`;
