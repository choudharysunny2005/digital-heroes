import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ShieldCheck,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mega-footer">
      <div className="footer-columns grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div className="footer-col text-left">
          <h3 className="text-2xl font-extrabold text-[var(--accent-color)] mb-6">
            Digital Heroes
          </h3>
          <p className="opacity-80 leading-relaxed">
            Premium quality tech, fashion, and lifestyle goods delivered
            straight to you at unbeatable prices.
          </p>
          <div className="social-icons flex gap-5 mt-6">
            <Link href="#" aria-label="Facebook">
              <Facebook
                size={24}
                className="social-icon hover:text-[var(--accent-color)] transition-colors"
              />
            </Link>
            <Link href="#" aria-label="Twitter">
              <Twitter
                size={24}
                className="social-icon hover:text-[var(--accent-color)] transition-colors"
              />
            </Link>
            <Link href="#" aria-label="Instagram">
              <Instagram
                size={24}
                className="social-icon hover:text-[var(--accent-color)] transition-colors"
              />
            </Link>
            <Link href="#" aria-label="Linkedin">
              <Linkedin
                size={24}
                className="social-icon hover:text-[var(--accent-color)] transition-colors"
              />
            </Link>
          </div>
        </div>

        <div className="footer-col text-left">
          <h3 className="text-xl font-bold mb-6 text-white">Quick Links</h3>
          <ul className="footer-links space-y-3">
            <li>
              <Link
                href="/"
                className="hover:text-[var(--accent-color)] transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/shop"
                className="hover:text-[var(--accent-color)] transition-colors"
              >
                Shop All
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="hover:text-[var(--accent-color)] transition-colors"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:text-[var(--accent-color)] transition-colors"
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        <div className="footer-col text-left">
          <h3 className="text-xl font-bold mb-6 text-white">
            Customer Support
          </h3>
          <ul className="footer-links space-y-3">
            <li>
              <Link
                href="#"
                className="hover:text-[var(--accent-color)] transition-colors"
              >
                Shipping Policy
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="hover:text-[var(--accent-color)] transition-colors"
              >
                Returns & Exchanges
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="hover:text-[var(--accent-color)] transition-colors"
              >
                Track Order
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="hover:text-[var(--accent-color)] transition-colors"
              >
                FAQ & Help Center
              </Link>
            </li>
          </ul>
        </div>

        <div className="footer-col text-left">
          <h3 className="text-xl font-bold mb-6 text-white">
            100% Secure Shopping
          </h3>
          <p className="opacity-80 leading-relaxed mb-6">
            We use industry-standard encryption for all transactions.
          </p>
          <div className="flex items-center gap-3 text-[var(--accent-color)]">
            <ShieldCheck size={32} />
            <span className="font-bold tracking-tight">SECURE CHECKOUT</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom border-t border-white/10 mt-12 pt-8 text-center text-sm opacity-60">
        <p>
          &copy; {currentYear} Digital Heroes. All Rights Reserved. |{" "}
          <Link href="#" className="hover:text-white transition-colors">
            Terms of Service
          </Link>{" "}
          |{" "}
          <Link href="#" className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
        </p>
      </div>
    </footer>
  );
}
