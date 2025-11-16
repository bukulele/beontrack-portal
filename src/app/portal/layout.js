/**
 * Portal Layout
 *
 * Simple layout for the public applicant portal.
 * No sidebar - just a header with logo and sign out button.
 */

export const metadata = {
  title: 'Applicant Portal',
  description: 'Application portal',
};

export default function PortalLayout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}
