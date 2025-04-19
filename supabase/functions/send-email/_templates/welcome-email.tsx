
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface WelcomeEmailProps {
  firstName: string
  email: string
}

export const WelcomeEmail = ({
  firstName,
  email,
}: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to Our Platform!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Welcome, {firstName}!</Heading>
        <Text style={text}>
          Thank you for signing up with the email: {email}
        </Text>
        <Link
          href="https://yourwebsite.com"
          target="_blank"
          style={link}
        >
          Get Started
        </Link>
      </Container>
    </Body>
  </Html>
)

export default WelcomeEmail

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif'
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '580px',
  maxWidth: '100%'
}

const h1 = {
  color: '#black',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0'
}

const link = {
  color: '#2754C5',
  textDecoration: 'underline'
}

const text = {
  color: '#333',
  fontSize: '16px',
  margin: '24px 0'
}
