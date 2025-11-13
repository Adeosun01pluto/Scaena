import Container from "./UI/Container.jsx";
import { ArrowRight } from "lucide-react";
import { FaInstagram, FaTiktok, FaPinterest } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-stone-800 text-stone-100">
      <Container className="py-12">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Subscribe */}
          <div className="fade-in-up">
            <p className="mb-3 text-lg font-medium">Subscribe to our newsletter</p>
            <div className="flex items-center gap-2">
              <input
                type="email"
                placeholder="Email"
                className="w-full rounded-lg border border-stone-600 bg-stone-700 px-3 py-2 text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400"
              />
              <button className="rounded-lg border border-stone-600 p-2 hover:bg-stone-700">
                <ArrowRight />
              </button>
            </div>
          </div>

          {/* Social / follow */}
          <div className="flex items-center justify-start gap-4 md:justify-end">
            <button className="rounded-full bg-violet-500/10 px-4 py-2 text-sm hover:bg-violet-500/20">
              ♥ Follow on shop
            </button>
            <div className="flex items-center gap-4 text-xl">
              <FaInstagram />
              <FaTiktok />
              <FaPinterest />
              <FaXTwitter />
            </div>
          </div>
        </div>

        {/* Payment badges */}
        <div className="mt-10 flex flex-wrap items-center gap-2 opacity-80">
          {["Apple Pay","Google Pay","Shop Pay","Visa","Mastercard"].map((p) => (
            <span key={p} className="rounded-md border border-stone-600 px-3 py-1 text-xs">
              {p}
            </span>
          ))}
        </div>

        <p className="mt-6 text-xs opacity-60">
          © {new Date().getFullYear()}, Scaena Studio — Eques Fortuna — Privacy policy
        </p>
      </Container>
    </footer>
  );
}
