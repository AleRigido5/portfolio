import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { Experience } from "@/components/sections/experience";
import { Hero } from "@/components/sections/hero";
import { Projects } from "@/components/sections/projects";
import { WaveDivider } from "@/components/ui/wave-divider";

export default function HomePage() {
  return (
    <>
      <Hero />
      <WaveDivider />
      <About />
      <WaveDivider />
      <Projects />
      <WaveDivider />
      <Experience />
      <WaveDivider />
      <Contact />
    </>
  );
}
