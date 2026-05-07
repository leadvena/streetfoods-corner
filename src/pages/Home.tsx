import { motion } from 'motion/react';
import { ArrowRight, Star, Clock, Heart, ThumbsUp, MapPin, Phone, MessageCircle, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MENU_ITEMS } from '../constants';
import { useCart } from '../lib/cartContext';
import { formatPrice } from '../lib/utils';

export default function Home() {
  const { addToCart } = useCart();
  const featuredItems = MENU_ITEMS.slice(0, 4);

  return (
    <div className="flex flex-col gap-24 overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center px-6 md:px-12 overflow-hidden py-24 md:py-0">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 md:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="badge-premium mb-8 rotate-[-2deg] bg-brand-accent text-brand-charcoal border-brand-charcoal">
              <span className="text-[10px] font-black uppercase tracking-widest italic">Electric & Fresh in Tabogon</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-[calc(-0.04em)] leading-[0.9] uppercase mb-8 italic">
              Street Food.<br /><span className="text-brand-primary">Fast. Blue.</span><br />Nitro.
            </h1>
            <p className="text-lg text-brand-charcoal/70 font-medium leading-relaxed mb-12 max-w-sm">
              The high-velocity flavor of Tabogon. Traditional Filipino favorites re-engineered with a premium cobalt twist.
            </p>
            <div className="flex flex-wrap gap-6">
              <Link to="/menu" className="btn-primary">
                Start Your Order
              </Link>
              <Link to="/menu" className="btn-secondary">
                View Menu
              </Link>
            </div>
            
            {/* Interactive Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8 border-t-[1.5px] border-brand-charcoal/10 pt-10">
              <div>
                <div className="text-3xl font-black italic">15m</div>
                <div className="text-[10px] uppercase font-bold text-brand-charcoal/50">Avg Delivery</div>
              </div>
              <div>
                <div className="text-3xl font-black italic">4.9/5</div>
                <div className="text-[10px] uppercase font-bold text-brand-charcoal/50">User Rating</div>
              </div>
              <div>
                <div className="text-3xl font-black italic">24/7</div>
                <div className="text-[10px] uppercase font-bold text-brand-charcoal/50">Live Support</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative flex items-center justify-center p-8"
          >
            <div className="relative w-full aspect-square max-h-[550px]">
              <div className="absolute inset-0 bg-brand-primary rounded-[60px] rotate-6 shadow-inner opacity-20 transform translate-x-4 translate-y-4"></div>
              <div className="absolute inset-0 bg-brand-primary rounded-[60px] rotate-3 shadow-inner"></div>
              <div className="absolute inset-0 bg-white rounded-[60px] border-[1.5px] border-brand-charcoal overflow-hidden shadow-neo-blue">
                <img 
                  src="https://images.unsplash.com/photo-1626509653295-ff204780775d?auto=format&fit=crop&q=80&w=1000" 
                  className="w-full h-full object-cover brightness-90"
                  alt="Delicious blue energy food"
                />
                
                {/* Custom Overlay Badge */}
                <div className="absolute top-6 left-6 w-24 h-24 bg-brand-accent rounded-full border-[1.5px] border-brand-charcoal flex items-center justify-center rotate-[-15deg] shadow-lg z-20">
                  <div className="text-center">
                    <div className="text-[10px] font-black uppercase leading-none">Flash</div>
                    <div className="text-2xl font-black italic tracking-tighter">DEAL</div>
                  </div>
                </div>

                <div className="absolute bottom-6 left-6 right-6 p-5 bg-brand-charcoal rounded-3xl flex items-center justify-between text-brand-cream shadow-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-secondary rounded-full flex items-center justify-center text-brand-charcoal animate-pulse">
                      <Star size={16} fill="currentColor" />
                    </div>
                    <div>
                      <span className="text-[11px] font-black uppercase tracking-tight block">Nitro Express Active!</span>
                      <span className="text-[9px] opacity-50 uppercase font-bold tracking-widest">Rider 1m away</span>
                    </div>
                  </div>
                  <button className="bg-brand-primary text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase shadow-neo-sm">Track</button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Menu Section */}
      <section className="max-w-7xl mx-auto w-full px-6 md:px-12 py-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div>
            <div className="badge-premium mb-4 bg-brand-red text-white border-brand-charcoal">
              <span className="text-[10px] font-black uppercase tracking-widest">Trending Now</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black uppercase italic mb-4">The Favorites</h2>
          </div>
          <Link to="/menu" className="btn-secondary !rounded-full py-3 px-10 flex items-center gap-3 group">
            FULL CATALOG <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {featuredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group animate-in"
            >
              <div className="card-immersive group mb-6 aspect-[4/5] relative">
                <img 
                  src={item.image} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  alt={item.name}
                />
                <button 
                  onClick={() => addToCart(item)}
                  className="absolute bottom-6 right-6 w-14 h-14 bg-brand-charcoal text-white rounded-2xl flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-neo-orange z-20"
                >
                  <Plus size={24} />
                </button>
                <div className="absolute top-4 left-4 badge-premium bg-white/90 backdrop-blur pb-1">
                  <span className="text-sm font-black italic">{formatPrice(item.price)}</span>
                </div>
              </div>
              <h3 className="text-xl font-black uppercase italic mb-1 group-hover:text-brand-red transition-colors">{item.name}</h3>
              <p className="text-brand-charcoal/50 font-bold text-[10px] uppercase tracking-widest">{item.category} • Top Seller</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-brand-charcoal text-white py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">Built for the Streets</h2>
            <p className="text-white/60 text-lg">We take pride in our local flavors and fast service.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { icon: Clock, title: 'Super-Fast Delivery', desc: 'From our grill to your doorstep in under 20 minutes.' },
              { icon: ThumbsUp, title: 'Quality Ingredients', desc: 'We only use fresh local produce and top-tier meats.' },
              { icon: Heart, title: 'Local Favorite', desc: 'Owned and operated right here in Tabogon, Cebu.' }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-white/5 border border-white/10 p-10 rounded-[48px] hover:bg-white/10 transition-colors"
              >
                <div className="w-16 h-16 bg-brand-orange/20 text-brand-orange flex items-center justify-center rounded-3xl mb-8">
                  <feature.icon size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-white/50 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="max-w-7xl mx-auto w-full px-6 mb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-8">Visit Our Hub</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="bg-brand-orange/10 p-4 rounded-2xl text-brand-orange h-fit">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-1">Our Location</h4>
                  <p className="text-brand-charcoal/60">J.P. Rizal Street, Poblacion, Tabogon, Cebu, Philippines 6009</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-brand-orange/10 p-4 rounded-2xl text-brand-orange h-fit">
                  <Clock size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-1">Operating Hours</h4>
                  <p className="text-brand-charcoal/60">Monday - Sunday: 10:00 AM - 10:00 PM</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-brand-orange/10 p-4 rounded-2xl text-brand-orange h-fit">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-1">Contact Us</h4>
                  <p className="text-brand-charcoal/60">+63 955 853 3678</p>
                </div>
              </div>
            </div>
            
            <div className="mt-12 flex gap-4">
              <a href="tel:+639558533678" className="btn-primary flex items-center gap-2">
                <Phone size={20} /> Call Now
              </a>
              <a href="https://m.me/" target="_blank" rel="noreferrer" className="btn-secondary flex items-center gap-2">
                <MessageCircle size={20} /> Messenger
              </a>
            </div>
          </motion.div>

          <div className="h-[500px] w-full rounded-[60px] overflow-hidden shadow-2xl relative border-8 border-white">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15664.123456789!2d123.9934!3d10.9272!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a84e1b2c3d4e5f%3A0x6a7b8c9d0e1f2g3h!2sTabogon%2C%20Cebu!5e0!3m2!1sen!2sph!4v1715050000000!5m2!1sen!2sph" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-charcoal text-white/40 py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-2xl font-display font-bold text-brand-orange">
            STREET<span className="text-white">FOODS</span>
          </div>
          <p className="text-sm">© 2026 Street Foods Corner Tabogon. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
