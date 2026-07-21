import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
import Stack from "@/components/Stack";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main className="h-screen overflow-y-auto overscroll-contain scroll-smooth snap-y snap-mandatory">
      <Header />
      <Hero />
      <Services />
      <About />
      <Stack />
      <Projects />
      <Contact />
    </main>
  );
}
