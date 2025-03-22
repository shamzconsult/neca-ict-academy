import { Footer } from "@/components/atom/Footer";
import { Navbar } from "@/components/atom/Navbar";
import ProgramProcess from "@/components/atom/Program-Process";
import ProgramProcessBody from "@/components/atom/Program-Process-Body";

export default function ProgramProcessPage() {
  return (
    <main>
      <Navbar />
      <ProgramProcess />
      <ProgramProcessBody />
      <Footer />
    </main>
  );
}
