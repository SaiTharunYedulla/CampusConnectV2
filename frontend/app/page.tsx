'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth.store';
import LandingNav         from '@/components/landing/LandingNav';
import HeroSection        from '@/components/landing/HeroSection';
import ProductPreview     from '@/components/landing/ProductPreview';
import ProblemSection     from '@/components/landing/ProblemSection';
import SolutionSection    from '@/components/landing/SolutionSection';
import FeaturesSection    from '@/components/landing/FeaturesSection';
import AchievementJourney from '@/components/landing/AchievementJourney';
import CommunityPreview   from '@/components/landing/CommunityPreview';
import RolesSection       from '@/components/landing/RolesSection';
import TrustSection       from '@/components/landing/TrustSection';
import TechStackSection   from '@/components/landing/TechStackSection';
import CTASection         from '@/components/landing/CTASection';
import LandingFooter      from '@/components/landing/LandingFooter';

export default function HomePage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // By the time useEffect runs, Zustand persist has already rehydrated
    // from localStorage — getState() is synchronous and safe here.
    const { user } = useAuthStore.getState();
    if (user) {
      if      (user.role === 'STUDENT') router.replace('/student/dashboard');
      else if (user.role === 'TEACHER') router.replace('/teacher/dashboard');
      else if (user.role === 'ADMIN')   router.replace('/admin/dashboard');
    } else {
      setReady(true);
    }
  }, [router]);

  // Hold render until we confirm the user is not logged in
  if (!ready) return null;

  return (
    <div style={{ background: 'var(--background)', overflowX: 'hidden' }}>
      <LandingNav />
      <main>
        <HeroSection />
        <ProductPreview />
        <ProblemSection />
        <SolutionSection />
        <FeaturesSection />
        <AchievementJourney />
        <CommunityPreview />
        <RolesSection />
        <TrustSection />
        <TechStackSection />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  );
}
