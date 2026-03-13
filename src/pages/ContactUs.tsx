import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Instagram, Linkedin, Twitter } from 'lucide-react';

export default function ContactUs() {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className="min-h-screen pt-24 pb-16 px-6" style={{ background: '#FFF5F7' }}>
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-200 rounded-full blur-[80px] opacity-60"></div>
                    <div className="relative">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-5"
                            style={{ background: 'rgba(212,97,122,0.10)', color: '#D4617A', border: '1px solid rgba(212,97,122,0.2)' }}>
                            Get In Touch
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-5" style={{ color: '#3D1520' }}>
                            We'd love to <span style={{ background: 'linear-gradient(135deg, #D4617A, #EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>hear from you</span>
                        </h1>
                        <p className="max-w-xl mx-auto text-lg" style={{ color: '#7A3545', opacity: 0.8 }}>
                            Whether you have a question, need support, or just want to say hi, our team is ready to respond.
                        </p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-5 gap-10">
                    {/* Contact Information */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="p-8 rounded-[2.5rem] relative overflow-hidden"
                            style={{ background: 'linear-gradient(135deg, #D4617A, #C44A6A)', boxShadow: '0 20px 40px rgba(212,97,122,0.3)' }}>
                            <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
                            
                            <h3 className="text-2xl font-black text-white mb-8">Contact Information</h3>
                            
                            <div className="space-y-8">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                                        style={{ background: 'rgba(255,255,255,0.2)' }}>
                                        <Mail className="text-white" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-pink-100 text-sm font-bold mb-1">Email Us</p>
                                        <a href="mailto:support@mindease.edu" className="text-white text-lg hover:underline transition-all">support@mindease.edu</a>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                                        style={{ background: 'rgba(255,255,255,0.2)' }}>
                                        <Phone className="text-white" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-pink-100 text-sm font-bold mb-1">Call Us</p>
                                        <a href="tel:+919876543210" className="text-white text-lg hover:underline transition-all">+91 98765 43210</a>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                                        style={{ background: 'rgba(255,255,255,0.2)' }}>
                                        <MapPin className="text-white" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-pink-100 text-sm font-bold mb-1">Visit Us</p>
                                        <p className="text-white text-lg leading-relaxed">NIT Kurukshetra Campus<br/>Kurukshetra, Haryana 136119</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 pt-8 border-t border-white/20">
                                <p className="text-pink-100 text-sm font-bold mb-4">Follow our journey</p>
                                <div className="flex gap-4">
                                    {[Instagram, Linkedin, Twitter].map((Icon, i) => (
                                        <a key={i} href="#" className="w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                                            style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
                                            <Icon size={18} />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-3">
                        <div className="p-8 md:p-10 rounded-[2.5rem]"
                            style={{ background: 'rgba(255,255,255,0.7)', border: '2px solid rgba(212,97,122,0.15)', backdropFilter: 'blur(20px)', boxShadow: '0 20px 40px rgba(0,0,0,0.03)' }}>
                            <h3 className="text-2xl font-black mb-6" style={{ color: '#3D1520' }}>Send us a message</h3>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold" style={{ color: '#7A3545' }}>Your Name</label>
                                        <input type="text" name="name" value={formData.name} onChange={handleChange} required
                                            className="w-full px-5 py-4 rounded-2xl outline-none transition-all"
                                            style={{ background: 'white', border: '1px solid rgba(212,97,122,0.2)', color: '#3D1520' }}
                                            placeholder="John Doe" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold" style={{ color: '#7A3545' }}>Email Address</label>
                                        <input type="email" name="email" value={formData.email} onChange={handleChange} required
                                            className="w-full px-5 py-4 rounded-2xl outline-none transition-all"
                                            style={{ background: 'white', border: '1px solid rgba(212,97,122,0.2)', color: '#3D1520' }}
                                            placeholder="john@example.com" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold" style={{ color: '#7A3545' }}>Subject</label>
                                    <input type="text" name="subject" value={formData.subject} onChange={handleChange} required
                                        className="w-full px-5 py-4 rounded-2xl outline-none transition-all"
                                        style={{ background: 'white', border: '1px solid rgba(212,97,122,0.2)', color: '#3D1520' }}
                                        placeholder="How can we help you?" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold" style={{ color: '#7A3545' }}>Message</label>
                                    <textarea name="message" value={formData.message} onChange={handleChange} required rows={5}
                                        className="w-full px-5 py-4 rounded-2xl outline-none transition-all resize-none"
                                        style={{ background: 'white', border: '1px solid rgba(212,97,122,0.2)', color: '#3D1520' }}
                                        placeholder="Tell us everything..."></textarea>
                                </div>
                                <button type="submit"
                                    className="w-full py-4 rounded-2xl text-white font-black text-lg flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
                                    style={{ background: 'linear-gradient(135deg, #D4617A, #C44A6A)', boxShadow: '0 10px 25px rgba(212,97,122,0.3)' }}>
                                    Send Message <Send size={18} />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
