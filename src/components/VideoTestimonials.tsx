import { useState } from 'react';
import { Play, Star, Sparkles, MessageSquare, Award, ArrowRight } from 'lucide-react';

interface VideoTestimonial {
  id: string;
  name: string;
  rank: string;
  year: string;
  title: string;
  videoId: string;
  thumbnail: string;
  quote: string;
}

const TESTIMONIALS: VideoTestimonial[] = [
  {
    id: "test-1",
    name: "Sowmya R.",
    rank: "AIR 88",
    year: "UPSC 2023",
    title: "How D'code Mentorship Audits Doubled My Mains Scores",
    videoId: "-c_ipRkHk7A", // Updated video ID
    thumbnail: "https://img.youtube.com/vi/-c_ipRkHk7A/hqdefault.jpg",
    quote: "The paper-by-paper review loop with Sudhagaran Sir gave me structural clarity. Within weeks, my answer flow became incredibly scientific."
  },
  {
    id: "test-2",
    name: "Arun Kumar S.",
    rank: "AIR 142",
    year: "UPSC 2023",
    title: "Cracking Public Administration & Sociology Optional Papers",
    videoId: "zS7t6ZOgRH8", // Updated video ID
    thumbnail: "https://img.youtube.com/vi/zS7t6ZOgRH8/hqdefault.jpg",
    quote: "Standard optional strategies are often bloated. At D'code Academy, we focused strictly on thinker interlinking which secured my rank."
  },
  {
    id: "test-3",
    name: "Divya Bharathi K.",
    rank: "AIR 210",
    year: "UPSC 2023",
    title: "Daily Answer Writing Drills and Handling Academic Fatigue",
    videoId: "U4JlJvOTQaQ", // Updated video ID
    thumbnail: "https://img.youtube.com/vi/U4JlJvOTQaQ/hqdefault.jpg",
    quote: "The personalized counselor desk synced me directly to milestones, making sure I never drifted away from daily answers practice."
  }
];

export default function VideoTestimonials() {
  const [playingId, setPlayingId] = useState<string | null>(null);

  return (
    <section id="testimonials" className="py-20 bg-slate-900 text-white border-b border-gray-800">
      <div className="max-w-(--size-container-max) mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-space text-xs font-bold uppercase tracking-widest text-[#ff8c8f] bg-white/10 px-3 py-1 rounded inline-block mb-3 border border-white/5">
            Topper Interviews
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white">
            YouTube Video Testimonials
          </h2>
          <p className="font-sans text-xs text-gray-400 mt-2 max-w-md mx-auto leading-relaxed">
            Listen directly to successful candidates who unlocked top All India Ranks using D'code's systematic mentorship pipeline.
          </p>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((video) => (
            <div 
              key={video.id} 
              className="bg-white/5 rounded-3xl overflow-hidden border border-white/10 hover:border-[#D31218]/40 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Video Player / Thumbnail Area */}
              <div className="relative aspect-video w-full bg-black flex items-center justify-center">
                {playingId === video.id ? (
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0`}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="absolute inset-0 w-full h-full group cursor-pointer" onClick={() => setPlayingId(video.id)}>
                    {/* Cover Image */}
                    <img 
                      src={video.thumbnail} 
                      alt={video.name} 
                      className="w-full h-full object-cover opacity-65 group-hover:scale-105 transition-transform duration-500 object-top"
                      referrerPolicy="no-referrer"
                    />
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                    
                    {/* Pulsing Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-[#D31218] text-white flex items-center justify-center shadow-lg group-hover:bg-[#A30D12] group-hover:scale-110 transition-all duration-300">
                        <Play className="w-6 h-6 fill-white ml-0.5" />
                      </div>
                    </div>

                    {/* Rank Badge overlay */}
                    <div className="absolute top-4 left-4 bg-[#D31218] text-white px-3 py-1 rounded-full text-[10px] font-space font-extrabold uppercase tracking-wider shadow-md">
                      {video.rank} • {video.year}
                    </div>
                  </div>
                )}
              </div>

              {/* Text content */}
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <h4 className="font-serif text-base font-bold text-white mb-2 leading-snug">
                    {video.title}
                  </h4>
                  <p className="font-sans text-xs text-gray-400 italic leading-relaxed">
                    "{video.quote}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-6 border-t border-white/5 mt-6">
                  <div className="w-8 h-8 rounded-full bg-[#D31218]/10 flex items-center justify-center text-[#ffb6b6]">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-space text-xs font-bold text-white leading-none">{video.name}</p>
                    <p className="font-sans text-[10px] text-gray-500 mt-0.5">{video.rank}, {video.year}</p>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Call to action to visit YouTube channel */}
        <div className="text-center mt-12">
          <a
            href="https://www.youtube.com/@SudhagaranSirOfficial"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-xs font-space font-bold uppercase tracking-widest text-[#ff8c8f] hover:text-white bg-white/5 hover:bg-white/10 px-6 py-3 rounded-full border border-white/10 transition-all"
          >
            <span>Visit Our YouTube Channel for More Videos</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

      </div>
    </section>
  );
}
