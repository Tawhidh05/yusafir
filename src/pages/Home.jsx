import useTitle from '../hooks/useTitle';
import BlogPreview from '../components/home/BlogPreview';
import CategoriesSection from '../components/home/CategoriesSection';
import CtaSection from '../components/home/CtaSection';
import DestinationsSection from '../components/home/DestinationsSection';
import FaqSection from '../components/home/FaqSection';
import FeaturedStays from '../components/home/FeaturedStays';
import Hero from '../components/home/Hero';
import HowItWorks from '../components/home/HowItWorks';
import Newsletter from '../components/home/Newsletter';
import StatsSection from '../components/home/StatsSection';

export default function Home() {
  useTitle('');
  return (
    <>
      <Hero />
      <StatsSection />
      <DestinationsSection />
      <CategoriesSection />
      <FeaturedStays />
      <HowItWorks />
      <BlogPreview />
      <FaqSection />
      <Newsletter />
      <CtaSection />
    </>
  );
}
