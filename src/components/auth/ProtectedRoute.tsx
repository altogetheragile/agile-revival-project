
// This component no longer protects routes, it just renders children
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
