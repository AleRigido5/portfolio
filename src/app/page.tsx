import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { Experience } from "@/components/sections/experience";
import { Hero } from "@/components/sections/hero";
import { Projects } from "@/components/sections/projects";

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Projects />
      <Experience />
      <Contact />
    </>
  );
}