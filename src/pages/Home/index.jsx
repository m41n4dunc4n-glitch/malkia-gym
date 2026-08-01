import Hero from "../../components/common/Hero";
import WhyChoose from "../../components/home/WhyChoose";
import MembershipPreview from "../../components/home/MembershipPreview";
import TrainersPreview from "../../components/home/TrainersPreview";
import GalleryPreview from "../../components/home/GalleryPreview";
import Testimonials from "../../components/home/Testimonials";
import CTA from "../../components/home/CTA";

function Home() {
  return (
    <>
      <Hero />
      <WhyChoose />
      <MembershipPreview />
      <TrainersPreview />
      <GalleryPreview />
      <Testimonials />
      <CTA />
    </>
  );
}

export default Home;