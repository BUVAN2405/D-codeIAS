import { Landmark, Globe, Mail, Phone, Calendar, ShieldCheck, Twitter, Facebook, Disc } from 'lucide-react';
import LogoImage from '../LOGO.jpeg';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0D2C54] text-gray-200 border-t border-[#D31218]/20 pt-16 pb-8 font-sans">
      <div className="max-w-(--size-container-max) mx-auto px-4 md:px-8">
        
        {/* Core Content Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Intro Column */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <img 
                src={LogoImage} 
                alt="D'code IAS Academy Logo" 
                className="w-9 h-9 shrink-0 rounded-full object-cover border border-white/15 shadow-sm"
                referrerPolicy="no-referrer"
              />
              <h3 className="font-serif text-lg font-bold tracking-tight text-white">
                D'code IAS Academy
              </h3>
            </div>
            
            <p className="text-xs text-gray-300 leading-relaxed max-w-sm font-medium">
              We Simplify Your IAS Journey. Pioneering civil services coaching in Tamil Nadu. Under the leadership of Sudhagaran Sir, D'code IAS Academy simplifies your preparation with structured content and dynamic mentorship feedback loops.
            </p>

            <div className="text-xs text-gray-400 mt-2 space-y-1">
              <p className="font-semibold text-white">Anna Nagar Center:</p>
              <p>825, 1st St, G Block, Ranganathan Garden,</p>
              <p>Anna Nagar, Chennai – 600040</p>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-space text-[10px] font-bold uppercase text-[#D31218] tracking-widest">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-gray-300">
              <li>
                <a href="#home" className="hover:text-[#D31218] transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#courses" className="hover:text-[#D31218] transition-colors">Terms of Service</a>
              </li>
              <li>
                <a href="#results" className="hover:text-[#D31218] transition-colors">Sitemap</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-[#D31218] transition-colors">Contact Us</a>
              </li>
              <li>
                <a href="#faculty" className="hover:text-[#D31218] transition-colors">Careers</a>
              </li>
            </ul>
          </div>

          {/* Connect Column (Circular Icons as in prompt) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-space text-[10px] font-bold uppercase text-[#D31218] tracking-widest">
              Connect
            </h4>
            <div className="flex gap-2.5">
              
              {/* @ symbol icon container */}
              <a
                href="mailto:info@dcodeias.com"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#D31218] text-white flex items-center justify-center transition-all shadow-xs border-none"
                aria-label="Direct Email Link"
              >
                <span className="font-space text-xs font-black">@</span>
              </a>

              {/* Web Icon Link */}
              <a
                href="#home"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#D31218] text-white flex items-center justify-center transition-all shadow-xs"
                aria-label="Global Portal Directory"
              >
                <Globe className="w-3.5 h-3.5" />
              </a>

              {/* WhatsApp Share connector icon */}
              <a
                href="https://chat.whatsapp.com/JaLf2Lf9uMiB1ZKzhrCnGp"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#D31218] text-white flex items-center justify-center transition-all shadow-xs"
                aria-label="WhatsApp Community Chat"
              >
                <span className="font-space text-xs font-bold font-mono">⇄</span>
              </a>

            </div>
          </div>

        </div>

        {/* Legal and Metadata Details Row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-gray-400 lowercase tracking-wider">
          
          <div>
            © 2026 D'code IAS Academy. All rights reserved. Shaping the future of Indian Governance.
          </div>

          <div className="flex items-center gap-6 italic">
            <span className="flex items-center gap-1.5 not-italic text-gray-300">
              <Phone className="w-3 h-3 text-[#D31218]" />
              +91 96000 60393 / 96000 60349
            </span>
            <span className="flex items-center gap-1.5 not-italic text-gray-300">
              <Mail className="w-3 h-3 text-[#D31218]" />
              info@dcodeias.com
            </span>
          </div>

        </div>

      </div>
    </footer>
  );
}
