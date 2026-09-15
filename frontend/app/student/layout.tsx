import MainLayout from '@/components/shared/layout/MainLayout';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return <MainLayout>{children}</MainLayout>;
}
