import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PhoneCall, ShieldAlert, HeartPulse, AlertTriangle, ArrowRight } from 'lucide-react';

export default function Emergency() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <div className="min-h-screen py-20 px-4" style={{ background: '#FFF5F7' }}>
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center p-3 rounded-full mb-4" style={{ background: 'rgba(212,97,122,0.12)', color: '#D4617A' }}>
                        <AlertTriangle size={32} />
                    </div>
                    <h1
                        className="text-4xl md:text-5xl font-bold mb-4"
                        style={{
                            background: 'linear-gradient(135deg,#D4617A,#C44A6A)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        Emergency Help
                    </h1>

                    <p
                        className="text-lg max-w-xl mx-auto font-medium"
                        style={{ color: '#7A3545' }}
                    >
                        If you or someone else is in immediate danger, please reach out right away. You are not alone, and help is available 24/7.
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">

                    {/* National Mental Health Helpline */}
                    <a
                        href="tel:18005990019"
                        className="group p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1"
                        style={{
                            background: 'rgba(255,255,255,0.85)',
                            backdropFilter: 'blur(20px)',
                            boxShadow: '0 10px 35px rgba(212,97,122,0.08)',
                            border: '1px solid rgba(212,97,122,0.1)'
                        }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div
                                className="p-3 rounded-xl"
                                style={{
                                    background: 'rgba(212,97,122,0.12)',
                                    color: '#D4617A',
                                }}
                            >
                                <HeartPulse size={26} />
                            </div>
                            <PhoneCall
                                size={22}
                                className="transition-all group-hover:scale-110"
                                style={{ color: '#D4617A' }}
                            />
                        </div>
                        <h2 className="text-xl font-bold mb-2" style={{ color: '#3D1520' }}>
                            KIRAN Helpline
                        </h2>
                        <p className="text-sm leading-relaxed mb-4" style={{ color: '#7A3545' }}>
                            Govt. of India's 24/7 toll-free mental health rehabilitation helpline. Support in 13 languages.
                        </p>
                        <div className="text-lg font-bold" style={{ color: '#D4617A' }}>
                            1800-599-0019
                        </div>
                    </a>

                    {/* AASRA Suicide Prevention */}
                    <a
                        href="tel:9820466726"
                        className="group p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1"
                        style={{
                            background: 'rgba(255,255,255,0.85)',
                            backdropFilter: 'blur(20px)',
                            boxShadow: '0 10px 35px rgba(212,97,122,0.08)',
                            border: '1px solid rgba(212,97,122,0.1)'
                        }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div
                                className="p-3 rounded-xl"
                                style={{
                                    background: 'rgba(212,97,122,0.12)',
                                    color: '#D4617A',
                                }}
                            >
                                <HeartPulse size={26} />
                            </div>
                            <PhoneCall
                                size={22}
                                className="transition-all group-hover:scale-110"
                                style={{ color: '#D4617A' }}
                            />
                        </div>
                        <h2 className="text-xl font-bold mb-2" style={{ color: '#3D1520' }}>
                            AASRA Crisis Intervention
                        </h2>
                        <p className="text-sm leading-relaxed mb-4" style={{ color: '#7A3545' }}>
                            24x7 voluntary, professional, and confidential service for emotional support and suicide prevention.
                        </p>
                        <div className="text-lg font-bold" style={{ color: '#D4617A' }}>
                            +91-9820466726
                        </div>
                    </a>

                    {/* NIT KKR Health Centre */}
                    <a
                        href="tel:01744233222" // Replace with actual NIT KKR Health Centre Number
                        className="group p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1"
                        style={{
                            background: 'rgba(255,255,255,0.85)',
                            backdropFilter: 'blur(20px)',
                            boxShadow: '0 10px 35px rgba(212,97,122,0.08)',
                            border: '1px solid rgba(212,97,122,0.1)'
                        }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div
                                className="p-3 rounded-xl"
                                style={{
                                    background: 'rgba(212,97,122,0.12)',
                                    color: '#D4617A',
                                }}
                            >
                                <ShieldAlert size={26} />
                            </div>
                            <PhoneCall
                                size={22}
                                className="transition-all group-hover:scale-110"
                                style={{ color: '#D4617A' }}
                            />
                        </div>
                        <h2 className="text-xl font-bold mb-2" style={{ color: '#3D1520' }}>
                            NIT KKR Health Centre
                        </h2>
                        <p className="text-sm leading-relaxed mb-4" style={{ color: '#7A3545' }}>
                            Immediate medical assistance and initial psychiatric evaluation right here on the campus.
                        </p>
                        <div className="text-lg font-bold" style={{ color: '#D4617A' }}>
                            01744-233-421
                        </div>
                    </a>

                    {/* Campus Security & Ambulance */}
                    <a
                        href="tel:112" // Or specific campus security number
                        className="group p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1"
                        style={{
                            background: 'rgba(255,255,255,0.85)',
                            backdropFilter: 'blur(20px)',
                            boxShadow: '0 10px 35px rgba(212,97,122,0.08)',
                            border: '1px solid rgba(212,97,122,0.1)'
                        }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div
                                className="p-3 rounded-xl"
                                style={{
                                    background: 'rgba(212,97,122,0.12)',
                                    color: '#D4617A',
                                }}
                            >
                                <ShieldAlert size={26} />
                            </div>
                            <PhoneCall
                                size={22}
                                className="transition-all group-hover:scale-110"
                                style={{ color: '#D4617A' }}
                            />
                        </div>
                        <h2 className="text-xl font-bold mb-2" style={{ color: '#3D1520' }}>
                            Emergency Ambulance / Police
                        </h2>
                        <p className="text-sm leading-relaxed mb-4" style={{ color: '#7A3545' }}>
                            For immediate physical danger or life-threatening situations inside or outside the campus.
                        </p>
                        <div className="text-lg font-bold" style={{ color: '#D4617A' }}>
                            112 <span className="text-sm font-normal">(National Emergency)</span>
                        </div>
                    </a>

                </div>

                {/* Info Section */}
                <div
                    className="mt-10 p-6 rounded-2xl max-w-4xl mx-auto flex flex-col md:flex-row gap-5 items-start md:items-center"
                    style={{
                        background: 'rgba(255,255,255,0.9)',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.05)',
                        borderLeft: '4px solid #D4617A'
                    }}
                >
                    <div className="flex-1">
                        <h3
                            className="text-lg font-bold mb-2"
                            style={{ color: '#3D1520' }}
                        >
                            Not an immediate emergency, but need someone to talk to?
                        </h3>
                        <p
                            className="text-sm leading-relaxed"
                            style={{ color: '#7A3545' }}
                        >
                            Our campus counselors are available during regular working hours. You can book a confidential session online or drop by the student welfare office. Don't hesitate to reach out.
                        </p>
                    </div>

                    <Link
                        to="/Appointment"
                        className="px-6 py-3 rounded-xl font-semibold transition-all hover:opacity-90 flex items-center gap-2 whitespace-nowrap"
                        style={{
                            background: 'linear-gradient(135deg,#D4617A,#C44A6A)',
                            color: 'white',
                            boxShadow: '0 4px 15px rgba(212,97,122,0.3)',
                        }}
                    >
                        Book Appointment
                        <ArrowRight size={18} />
                    </Link>
                </div>

            </div>
        </div>
    );
}