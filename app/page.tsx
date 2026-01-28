'use client';

import { UrlResult } from '@/components/url-result';
import { UrlShortenerForm } from '@/components/url-shortener-form';
import { CreateUrlResponse } from '@/lib/types';
import { BarChart, Link2, Shield, Zap } from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const [result, setResult] = useState<CreateUrlResponse | null>(null);

  return (
    <main className='min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-green-50'>
      {/* Hero Section */}
      <div className='container mx-auto px-4 py-16'>
        <div className='text-center mb-12'>
          {/* Logo */}
          <div className='flex justify-center mb-8'>
            <img
              src='/logo.jpg'
              alt='link.achievagemilang.live'
              className='h-32 w-auto'
            />
          </div>

          <h1 className='text-5xl md:text-7xl font-bold mb-6'>
            <span className='gradient-text'>Shorten URLs</span>
            <br />
            <span className='text-gray-800'>Instantly</span>
          </h1>
          <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
            Create short, memorable links in seconds. Track clicks, generate QR
            codes, and share with confidence.
          </p>
        </div>

        {/* Main Form */}
        <div className='flex flex-col items-center gap-8 mb-16'>
          <UrlShortenerForm onSuccess={setResult} />

          {result && <UrlResult result={result} />}
        </div>

        {/* Features Section */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mt-24'>
          <div className='glass rounded-xl p-6 text-center border border-white/20'>
            <div className='w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4'>
              <Zap className='h-6 w-6 text-white' />
            </div>
            <h3 className='font-semibold text-lg mb-2'>Lightning Fast</h3>
            <p className='text-sm text-gray-600'>
              Create short URLs in milliseconds with our high-performance
              backend
            </p>
          </div>

          <div className='glass rounded-xl p-6 text-center border border-white/20'>
            <div className='w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4'>
              <Link2 className='h-6 w-6 text-white' />
            </div>
            <h3 className='font-semibold text-lg mb-2'>Custom Aliases</h3>
            <p className='text-sm text-gray-600'>
              Create branded short links with custom aliases that match your
              brand
            </p>
          </div>

          <div className='glass rounded-xl p-6 text-center border border-white/20'>
            <div className='w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4'>
              <BarChart className='h-6 w-6 text-white' />
            </div>
            <h3 className='font-semibold text-lg mb-2'>Analytics</h3>
            <p className='text-sm text-gray-600'>
              Track click counts and see when your links were last accessed
            </p>
          </div>

          <div className='glass rounded-xl p-6 text-center border border-white/20'>
            <div className='w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4'>
              <Shield className='h-6 w-6 text-white' />
            </div>
            <h3 className='font-semibold text-lg mb-2'>Secure & Reliable</h3>
            <p className='text-sm text-gray-600'>
              Built with Go and PostgreSQL for maximum reliability and security
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className='text-center mt-24 text-gray-600'>
          <p className='text-sm'>
            Built with ❤️ using Next.js, Go, PostgreSQL, and Redis
          </p>
        </footer>
      </div>
    </main>
  );
}
