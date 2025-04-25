
import React from 'npm:react@18.3.1';
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Button,
} from 'npm:@react-email/components@0.0.22';

interface ResetPasswordEmailProps {
  actionLink?: string;
  email: string;
}

export default function ResetPasswordEmail({ actionLink, email }: ResetPasswordEmailProps) {
  // Use the provided actionLink or fall back to a constructed one
  const baseUrl = Deno.env.get('PUBLIC_URL') || 'https://altogetheragile.com';
  const resetLink = actionLink || `${baseUrl}/reset-password?email=${encodeURIComponent(email)}`;
  
  // Current timestamp for cache busting in logs
  const timestamp = new Date().toISOString();
  console.log(`Generating reset password email for ${email} at ${timestamp}`);
  console.log(`Using reset link: ${resetLink}`);
  
  return (
    <Html>
      <Head />
      <Preview>Reset your AltogetherAgile password</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section>
            <Heading style={h1}>Reset Your Password</Heading>
            <Text style={text}>
              Hello,
            </Text>
            <Text style={text}>
              We received a request to reset the password for your AltogetherAgile account ({email}).
              If you did not make this request, you can safely ignore this email.
            </Text>
            
            <Section style={btnContainer}>
              <Button
                style={button}
                href={resetLink}
              >
                Reset Your Password
              </Button>
            </Section>
            
            <Text style={text}>
              If the button above doesn't work, you can also copy and paste this link into your browser:
            </Text>
            
            <Text style={linkContainer}>
              <Link href={resetLink} style={linkStyle}>
                {resetLink}
              </Link>
            </Text>
            
            <Text style={text}>
              <strong>Important:</strong> This password reset link will expire in 24 hours. Please use it as soon as possible.
            </Text>
            
            <Text style={noteStyle}>
              Note: Password reset links contain a security token that will expire for your protection. 
              If you see an "expired token" message, simply request a new reset link and use it immediately.
            </Text>
            
            <Text style={footer}>
              If you have any questions or need assistance, please contact our support team.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: "#f5f5f5",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '580px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '30px 0',
  padding: '0',
  lineHeight: '1.5',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '16px 0',
};

const noteStyle = {
  color: '#664d03',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '16px 0',
  padding: '12px',
  backgroundColor: '#fff3cd',
  borderRadius: '4px',
  border: '1px solid #ffecb5',
};

const linkStyle = {
  color: '#2563eb',
  textDecoration: 'underline',
  wordBreak: 'break-all' as const,
};

const linkContainer = {
  margin: '16px 0',
  padding: '12px',
  backgroundColor: '#f0f0f0',
  borderRadius: '4px',
  wordBreak: 'break-all' as const,
};

const btnContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#2563eb',
  borderRadius: '4px',
  color: '#fff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
  fontWeight: 'bold',
};

const footer = {
  color: '#898989',
  fontSize: '14px',
  margin: '32px 0 0',
};
