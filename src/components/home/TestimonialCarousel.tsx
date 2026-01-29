"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
    {
        text: "I was honestly lost before I found these guys. My SOP was a mess, and I had no idea how visa interviews worked. They sat with me, fixed everything, and now I'm actually in Toronto studying Computer Science. Still feels unreal.",
        author: "Rahim Ahmed",
        university: "University of Toronto, Canada",
        flag: "🇨🇦",
        initials: "RA",
    },
    {
        text: "They found me a scholarship I had never even heard of. Like, who knew these things existed? The team is super chill and actually listens to what you want. Made the whole UK dream possible for my family.",
        author: "Fatima Akter",
        university: "University of Manchester, UK",
        flag: "🇬🇧",
        initials: "FA",
    },
    {
        text: "What I loved is they didn't just help with applications, they helped me figure out where to live, how to manage money abroad, everything. It's like having an older sibling who's been through it all.",
        author: "Tanvir Hasan",
        university: "Monash University, Australia",
        flag: "🇦🇺",
        initials: "TH",
    },
    {
        text: "No pushy sales tactics, no fake promises. Just real people doing their job well. I respected that, and it made me trust them with something as big as my education.",
        author: "Nusrat Jahan",
        university: "University of Leeds, UK",
        flag: "🇬🇧",
        initials: "NJ",
    },
    {
        text: "From choosing the right program to getting my visa approved, NexTep was there every step of the way. The team genuinely cares about your success, and that made all the difference.",
        author: "Sadia Khan",
        university: "TU Munich, Germany",
        flag: "🇩🇪",
        initials: "SK",
    },
];

export function TestimonialCarousel() {
    return (
        <section id="stories" className="py-24 bg-surface dark:bg-card/50 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_rgba(212,175,55,0.05)_0%,_transparent_50%),_radial-gradient(circle_at_80%_20%,_rgba(212,175,55,0.05)_0%,_transparent_50%)] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-semibold mb-4">
                        Real Stories
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold font-heading mb-4 text-primary">From Students Who've Been There</h2>
                    <p className="text-lg text-muted-foreground">
                        We could tell you how great we are, but honestly? These stories say it better than we ever could.
                    </p>
                </div>

                {/* Card Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((story, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <div className="bg-gradient-to-br from-card to-slate-50 dark:from-slate-800 dark:to-slate-900 p-6 md:p-8 rounded-2xl border border-accent/10 hover:border-accent/30 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 h-full flex flex-col relative group">
                                {/* Top Accent Line */}
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-yellow-400 to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl" />

                                {/* Header with Quote and Stars */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                                        <Quote className="w-5 h-5 fill-current" />
                                    </div>
                                    <div className="flex gap-0.5 text-yellow-400">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star key={s} className="w-4 h-4 fill-current" />
                                        ))}
                                    </div>
                                </div>

                                {/* Testimonial Text */}
                                <p className="text-muted-foreground italic mb-6 flex-grow leading-relaxed text-sm md:text-base">
                                    "{story.text}"
                                </p>

                                {/* Author Info */}
                                <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-yellow-400 flex items-center justify-center text-slate-900 font-bold text-sm shadow-lg flex-shrink-0">
                                        {story.initials}
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="font-bold text-primary text-sm">{story.author}</h4>
                                        <p className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                                            <span>{story.flag}</span> {story.university}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
