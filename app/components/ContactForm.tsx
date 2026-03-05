"use client";

import { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { motion, AnimatePresence } from 'framer-motion';

export default function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // These keys should match your EmailJS setup in .env.local
      await emailjs.sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'service_id_placeholder',
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'template_id_placeholder',
        formRef.current,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'public_key_placeholder'
      );
      setSubmitStatus('success');
      formRef.current.reset();
    } catch (error) {
      console.error('FAILED...', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      
      // Reset status after a few seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 relative">
      <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="user_name" className="text-sm font-semibold text-gray-300 ml-1">Name</label>
            <input 
              type="text" 
              name="user_name" 
              id="user_name"
              required 
              placeholder="John Doe"
              className="px-4 py-3 bg-white/10 border-2 border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="user_email" className="text-sm font-semibold text-gray-300 ml-1">Email</label>
            <input 
              type="email" 
              name="user_email" 
              id="user_email"
              required 
              placeholder="john@example.com"
              className="px-4 py-3 bg-white/10 border-2 border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>
        
        <div className="flex flex-col gap-1">
          <label htmlFor="message" className="text-sm font-semibold text-gray-300 ml-1">Message</label>
          <textarea 
            name="message" 
            id="message"
            required 
            rows={5}
            placeholder="Tell me about your project..."
            className="px-4 py-3 bg-white/10 border-2 border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-primary resize-none transition-colors"
          />
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="mt-2 relative overflow-hidden bg-primary text-black font-bold py-4 px-8 border-4 border-white hover:bg-yellow-400 transition-colors disabled:opacity-70 disabled:cursor-not-allowed group"
        >
          <span className={`transition-opacity duration-300 ${isSubmitting ? 'opacity-0' : 'opacity-100'}`}>
            SEND MESSAGE
          </span>
          {isSubmitting && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </button>
      </form>

      <AnimatePresence>
        {submitStatus === 'success' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute -bottom-16 left-0 right-0 bg-green-500 text-black font-bold text-center py-3 px-4 border-2 border-white shadow-lg z-20"
          >
            Message sent successfully! I&apos;ll get back to you soon.
          </motion.div>
        )}
        
        {submitStatus === 'error' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute -bottom-16 left-0 right-0 bg-red-500 text-white font-bold text-center py-3 px-4 border-2 border-white shadow-lg z-20"
          >
            Failed to send message. Please try again or use direct email.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
