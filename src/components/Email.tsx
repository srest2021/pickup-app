import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Preview,
    Tailwind,
    Text,
  } from "@react-email/components";
  import * as React from "react-native";

  interface ContactMeEmailProps {
    name: string;
    emailAddress: string;
    phoneNumber: string;
    content: string;
  }

  const VercelInviteUserEmail = ({
    name,
    content,
    emailAddress,
    phoneNumber,
  }: ContactMeEmailProps) => {};

  const previewText = `has a message`;

  <Html>
  <Head />
  <Preview>{previewText}</Preview>
  <Tailwind>
    <Body className="bg-white my-auto mx-auto font-sans">
      {...}
    </Body>
  </Tailwind>
</Html>