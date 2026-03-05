import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import {
Play, Users, Heart, Clock, User, DollarSign,
CheckCircle, Calendar, Sparkles, X, Video, ShieldCheck,
} from 'lucide-react';

interface VideoSession {
id: string;
title: string;
description: string;
videoUrl: string;
duration: string;
category: 'meditation' | 'therapy' | 'coping';
createdAt?: any;
}

interface BookableSession {
id: string;
title: string;
description: string;
therapistName: string;
sessionType: string;
duration: string;
availableSlots: string;
price: string;
createdAt?: any;
}

const Sessions: React.FC = () => {

const [videoSessions, setVideoSessions] = useState<VideoSession[]>([]);
const [bookableSessions, setBookableSessions] = useState<BookableSession[]>([]);
const [loading, setLoading] = useState(true);
const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
const [selectedBooking, setSelectedBooking] = useState<BookableSession | null>(null);

useEffect(() => {

let loadedCount = 0;

const checkDone = () => {
loadedCount++;
if (loadedCount === 2) setLoading(false);
};

const videoUnsub = onSnapshot(
query(collection(db, 'videoSessions'), orderBy('createdAt', 'desc')),
snap => {
setVideoSessions(snap.docs.map(d => ({ id: d.id, ...d.data() })) as VideoSession[]);
checkDone();
},
() => checkDone()
);

const bookableUnsub = onSnapshot(
query(collection(db, 'bookableSessions'), orderBy('createdAt', 'desc')),
snap => {
setBookableSessions(snap.docs.map(d => ({ id: d.id, ...d.data() })) as BookableSession[]);
checkDone();
},
() => checkDone()
);

return () => {
videoUnsub();
bookableUnsub();
};

}, []);

const getEmbedUrl = (url: string) => {
if (!url) return '';
if (url.includes('youtube.com/watch?v=')) return `https://www.youtube.com/embed/${url.split('v=')[1]?.split('&')[0]}`;
if (url.includes('youtu.be/')) return `https://www.youtube.com/embed/${url.split('youtu.be/')[1]?.split('?')[0]}`;
return url;
};

const categoryBadge = (cat: string) => {
const map: Record<string, { bg: string; color: string; label: string }> = {
meditation: {
bg: 'rgba(255,228,230,0.9)',
color: '#BE123C',
label: '🧘 Meditation'
},
therapy: {
bg: 'rgba(252,231,243,0.9)',
color: '#9D174D',
label: '💬 Therapy'
},
coping: {
bg: 'rgba(240,253,244,0.9)',
color: '#166534',
label: '🌱 Coping'
}
};

return map[cat] || {
bg: 'rgba(255,245,247,0.9)',
color: '#7A3545',
label: cat
};
};

const sessionTypeBadge = (type: string) => {
const map: Record<string, { bg: string; color: string }> = {
individual: { bg: 'rgba(255,228,230,0.8)', color: '#BE123C' },
group: { bg: 'rgba(252,231,243,0.8)', color: '#9D174D' },
peer: { bg: 'rgba(240,253,244,0.8)', color: '#166534' },
};

return map[type] || { bg: 'rgba(255,245,247,0.8)', color: '#7A3545' };
};

return (

<div
className="min-h-screen pb-24"
style={{
background: 'linear-gradient(160deg,#FFF5F7 0%,#FFE8ED 50%,#FFF0F3 100%)'
}}
>

{/* HERO */}

<div
className="relative overflow-hidden pt-24 pb-28 px-6"
style={{
background: 'linear-gradient(135deg,#D4617A 0%,#C44A6A 40%,#9B2C5A 100%)'
}}
>

<div className="relative max-w-5xl mx-auto text-center text-white">

<div
className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5 text-xs font-black uppercase tracking-widest"
style={{
background: 'rgba(255,255,255,0.15)',
backdropFilter: 'blur(8px)',
border: '1px solid rgba(255,255,255,0.2)'
}}
>
<Sparkles size={14}/> Wellness Hub
</div>

<h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
Everything you need for
<br/>
<span className="text-pink-100">
emotional resilience.
</span>
</h1>

<p className="text-white/75 text-lg max-w-xl mx-auto mb-8">
Book professional therapy sessions and explore wellness videos tailored to your journey.
</p>

</div>
</div>

<div className="max-w-6xl mx-auto px-6 mt-8 space-y-16">

{/* THERAPY SESSIONS */}

<section>

<div className="flex items-center gap-4 mb-8">

<div
className="p-3 rounded-2xl shadow-lg"
style={{
background: 'linear-gradient(135deg,#D4617A,#C44A6A)'
}}
>
<Users className="text-white" size={24}/>
</div>

<div>
<h2
className="text-2xl font-black"
style={{ color:'#3D1520' }}
>
Book Therapy Sessions
</h2>

<p
className="text-sm"
style={{ color:'#7A3545', opacity:0.7 }}
>
Schedule sessions with licensed therapists
</p>

</div>
</div>
{bookableSessions.length === 0 ? (

<div
className="p-12 rounded-[2rem] text-center"
style={{
background:'rgba(255,255,255,0.6)',
border:'2px dashed rgba(249,197,204,0.8)'
}}
>

<Calendar className="mx-auto mb-4" size={48} style={{color:'#F9C5CC'}}/>

<h3
className="text-lg font-black mb-2"
style={{color:'#3D1520'}}
>
No Sessions Available Yet
</h3>

<p
className="text-sm"
style={{color:'#7A3545',opacity:0.65}}
>
Check back soon for upcoming therapy sessions!
</p>

</div>

) : (

<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

{bookableSessions.map((session)=>{

const badge=sessionTypeBadge(session.sessionType);

return(

<div
key={session.id}
className="rounded-[2rem] overflow-hidden group transition-all duration-300 hover:-translate-y-2"
style={{
background:'rgba(255,255,255,0.75)',
backdropFilter:'blur(16px)',
border:'1.5px solid rgba(249,197,204,0.6)',
boxShadow:'0 8px 30px rgba(212,97,122,0.08)'
}}
onMouseEnter={e=>{
e.currentTarget.style.boxShadow='0 20px 50px rgba(212,97,122,0.18)'
}}
onMouseLeave={e=>{
e.currentTarget.style.boxShadow='0 8px 30px rgba(212,97,122,0.08)'
}}
>

<div className="p-6 pb-4">

<div className="flex items-start justify-between mb-4">

<div
className="p-3 rounded-2xl shadow-md group-hover:scale-110 transition-transform"
style={{background:'linear-gradient(135deg,#D4617A,#C44A6A)'}}
>
<Heart className="text-white" size={22}/>
</div>

<span
className="text-[10px] font-black px-3 py-1.5 rounded-full uppercase"
style={{background:badge.bg,color:badge.color}}

>

{session.sessionType} </span>

</div>

<h3
className="text-lg font-black mb-3"
style={{color:'#3D1520'}}
>
{session.title}
</h3>

<div className="space-y-2 mb-4">

<div className="flex items-center gap-2 text-sm" style={{color:'#7A3545'}}>
<User size={14} style={{color:'#D4617A'}}/>
<span className="font-medium">{session.therapistName}</span>
</div>

<div className="flex items-center gap-2 text-sm" style={{color:'#7A3545'}}>
<Clock size={14} style={{color:'#D4617A'}}/>
<span className="font-medium">{session.duration}</span>
</div>

<div className="flex items-center gap-2 text-sm" style={{color:'#7A3545'}}>
<Calendar size={14} style={{color:'#D4617A'}}/>
<span className="font-medium">{session.availableSlots}</span>
</div>

<div
className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-black"
style={{
background:'rgba(209,250,229,0.6)',
color:'#065F46'
}}
>
<DollarSign size={14}/>
{session.price}
</div>

</div>

<p
className="text-sm leading-relaxed line-clamp-2"
style={{color:'#7A3545',opacity:0.8}}
>
{session.description}
</p>

</div>

<div className="px-6 pb-6">

<button
onClick={()=>setSelectedBooking(session)}
className="w-full py-3 rounded-2xl font-black text-white text-sm transition-all flex items-center justify-center gap-2"
style={{
background:'linear-gradient(135deg,#D4617A,#C44A6A)',
boxShadow:'0 6px 20px rgba(212,97,122,0.28)'
}}
onMouseEnter={e=>{
e.currentTarget.style.boxShadow='0 12px 35px rgba(212,97,122,0.45)'
}}
onMouseLeave={e=>{
e.currentTarget.style.boxShadow='0 6px 20px rgba(212,97,122,0.28)'
}}

>

<CheckCircle size={16}/>
Book Session

</button>

</div>

</div>

)

})}

</div>

)}

</section>

{/* VIDEO SESSIONS */}

<section>

<div className="flex items-center gap-4 mb-8">

<div
className="p-3 rounded-2xl shadow-lg"
style={{
background:'linear-gradient(135deg,#D4617A,#C44A6A)'
}}
>
<Video className="text-white" size={24}/>
</div>

<div>

<h2
className="text-2xl font-black"
style={{color:'#3D1520'}}
>
Video Therapy
</h2>

<p
className="text-sm"
style={{color:'#7A3545',opacity:0.7}}
>
Watch educational videos anytime
</p>

</div>

</div>

<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

{videoSessions.map((session)=>{

const badge=categoryBadge(session.category)

return(

<div
key={session.id}
className="rounded-[2rem] overflow-hidden group transition-all duration-300 hover:-translate-y-2"
style={{
background:'rgba(255,255,255,0.75)',
backdropFilter:'blur(16px)',
border:'1.5px solid rgba(249,197,204,0.6)',
boxShadow:'0 8px 30px rgba(212,97,122,0.08)'
}}
>

<div className="relative aspect-video overflow-hidden">

<iframe
className="w-full h-full"
src={getEmbedUrl(session.videoUrl)}
title={session.title}
frameBorder="0"
allowFullScreen
/>

</div>

<div className="p-5">

<div className="flex items-center justify-between mb-3">

<span
className="text-[10px] font-black px-3 py-1 rounded-full uppercase"
style={{background:badge.bg,color:badge.color}}

>

{badge.label} </span>

<div className="flex items-center gap-1 text-sm font-bold" style={{color:'#7A3545'}}>
<Clock size={12} style={{color:'#D4617A'}}/>
{session.duration}
</div>

</div>

<h3
className="text-base font-black mb-2"
style={{color:'#3D1520'}}
>
{session.title}
</h3>

<p
className="text-sm leading-relaxed line-clamp-2 mb-4"
style={{color:'#7A3545',opacity:0.8}}
>
{session.description}
</p>



</div>

</div>

)

})}

</div>

</section>

{/* FEATURE CARDS */}

<div className="grid md:grid-cols-3 gap-5">

{[
{icon:<ShieldCheck size={24}/>,title:'Licensed Therapists',desc:'Book with certified professionals',color:'#D4617A'},
{icon:<Play size={24}/>,title:'Watch Anytime',desc:'Access videos 24/7',color:'#C44A6A'},
{icon:<Heart size={24}/>,title:'Confidential',desc:'Your privacy is protected',color:'#059669'}
].map((item,i)=>(

<div
key={i}
className="p-6 rounded-[1.8rem] text-center transition-all duration-300 hover:-translate-y-1"
style={{
background:'rgba(255,255,255,0.75)',
backdropFilter:'blur(16px)',
border:'1.5px solid rgba(249,197,204,0.5)',
boxShadow:'0 4px 16px rgba(212,97,122,0.06)'
}}
>

<div
className="inline-flex p-4 rounded-2xl mb-4"
style={{background:`${item.color}18`}}
>
<span style={{color:item.color}}>
{item.icon}
</span>
</div>

<h3
className="font-black mb-1"
style={{color:'#3D1520'}}
>
{item.title}
</h3>

<p
className="text-sm"
style={{color:'#7A3545',opacity:0.7}}
>
{item.desc}
</p>

</div>

))}

</div>

</div>

</div>

)

}

export default Sessions;
