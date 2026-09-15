import MainLayout from '@/components/shared/layout/MainLayout';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <MainLayout>{children}</MainLayout>;
}
