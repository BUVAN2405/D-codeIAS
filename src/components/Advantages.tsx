import { ComponentType } from 'react';
import { motion } from 'motion/react';
import { Advantage } from '../types';
import { Award, Layers, FileText, Users, TrendingUp, BookMarked } from 'lucide-react';

interface AdvantagesProps {
  advantages: Advantage[];
}

const IconMap: { [key: string]: ComponentType<any> } = {
  Award: Award,
  Layers: Layers,
  FileText: FileText,
  Users: Users,
  TrendingUp: TrendingUp,
  BookMarked: BookMarked,
};

export default function Advantages({ advantages }: AdvantagesProps) {
  return (
    <section className="py-20 bg-surface-cream/40 border-b border-brand-violet/10">
      <div className="max-w-(--size-container-max) mx-auto px-4 md:px-8">
        
        {/* Split Header: Title Left, Brand Policy Paragraph Right */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 items-end mb-16">
          <div className="md:col-span-7">
            <span className="font-space text-xs font-bold uppercase tracking-widest text-brand-violet block mb-2">
              WHY D'CODE?
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-accent tracking-tight leading-tight">
              The Institutional Advantage
            </h2>
          </div>
          <div className="md:col-span-5 font-sans text-xs text-brand-accent/80 leading-relaxed md:border-l border-brand-violet/20 md:pl-6 pb-1">
            We provide an ecosystem that nurtures intellectual curiosity and prepares you for the rigorous standard of the Union Civil Services examination framework.
          </div>
        </div>

        {/* Dynamic Advantages Grid (6 items) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {advantages.map((adv, idx) => {
            const IconComponent = IconMap[adv.iconName] || Award;

            return (
              <motion.div
                key={adv.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="bg-white rounded-lg p-6 sm:p-7 border border-brand-violet/10 flex items-start gap-4 transition-all hover:bg-white hover:shadow-sm"
              >
                <div className="w-10 h-10 rounded bg-brand-violet/5 flex items-center justify-center text-brand-violet flex-shrink-0">
                  <IconComponent className="w-5 h-5 stroke-[1.5]" />
                </div>

                <div>
                  <h3 className="font-serif text-base font-bold text-brand-accent mb-2">
                    {adv.title}
                  </h3>
                  <p className="font-sans text-xs text-brand-accent/70 leading-relaxed">
                    {adv.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
