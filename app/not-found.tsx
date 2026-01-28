'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ArrowRight, Home, Link as LinkIcon, Search } from 'lucide-react';
import Link from 'next/link';

export default function LinkNotFound() {
  return (
    <main className='min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-green-50 flex items-center justify-center p-4'>
      <div className='max-w-md w-full text-center'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className='flex justify-center mb-8'>
            <div className='relative'>
              <div className='absolute inset-0 bg-blue-400 blur-2xl opacity-20 animate-pulse'></div>
              <div className='relative bg-white p-6 rounded-full shadow-xl border border-blue-100'>
                <LinkIcon className='w-12 h-12 text-blue-600' />
                <motion.div
                  className='absolute -top-1 -right-1 bg-red-500 rounded-full p-1 border-2 border-white'
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring' }}
                >
                  <Search className='w-4 h-4 text-white' />
                </motion.div>
              </div>
            </div>
          </div>

          <h1 className='text-4xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-600'>
            Link Not Found
          </h1>

          <p className='text-lg text-gray-600 mb-8'>
            The short link you followed does not exist or has expired. Please
            check the URL or create a new short link.
          </p>

          <Card className='bg-white/50 backdrop-blur-md border-white/50 shadow-xl mb-8'>
            <CardContent className='pt-6'>
              <h3 className='font-semibold text-gray-800 mb-4'>
                What happened?
              </h3>
              <ul className='text-left space-y-3 text-sm text-gray-600'>
                <li className='flex items-start gap-3'>
                  <div className='h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5'>
                    <span className='text-blue-600 font-bold'>1</span>
                  </div>
                  <span>The link might have expired (reached its TTL).</span>
                </li>
                <li className='flex items-start gap-3'>
                  <div className='h-5 w-5 rounded-full bg-cyan-100 flex items-center justify-center flex-shrink-0 mt-0.5'>
                    <span className='text-cyan-600 font-bold'>2</span>
                  </div>
                  <span>There&apos;s a typo in the short code.</span>
                </li>
                <li className='flex items-start gap-3'>
                  <div className='h-5 w-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5'>
                    <span className='text-green-600 font-bold'>3</span>
                  </div>
                  <span>The custom alias has been deleted or changed.</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Button
              asChild
              size='lg'
              className='bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 shadow-lg'
            >
              <Link href='/'>
                <Home className='mr-2 h-4 w-4' />
                Back to Home
              </Link>
            </Button>
            <Button
              asChild
              variant='outline'
              size='lg'
              className='bg-white/50 backdrop-blur-sm border-blue-200 hover:bg-blue-50'
            >
              <Link href='/'>
                Create New Link
                <ArrowRight className='ml-2 h-4 w-4' />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
