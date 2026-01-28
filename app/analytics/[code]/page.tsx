'use client';

import { QrCodeDisplay } from '@/components/qr-code-display';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { apiClient } from '@/lib/api';
import { Analytics } from '@/lib/types';
import { getRelativeTime } from '@/lib/utils';
import {
  ArrowLeft,
  Clock,
  ExternalLink,
  Link2,
  TrendingUp,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AnalyticsPage() {
  const params = useParams();
  const router = useRouter();
  const shortCode = params.code as string;

  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  const shortUrl = `${baseUrl}/${shortCode}`;

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await apiClient.getAnalytics(shortCode);
        setAnalytics(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load analytics',
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [shortCode]);

  if (isLoading) {
    return (
      <main className='min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-green-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading analytics...</p>
        </div>
      </main>
    );
  }

  if (error || !analytics) {
    return (
      <main className='min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-green-50 flex items-center justify-center'>
        <Card className='max-w-md'>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>{error || 'Analytics not found'}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/')}>
              <ArrowLeft className='mr-2 h-4 w-4' />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className='min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-green-50'>
      <div className='container mx-auto px-4 py-16'>
        <div className='max-w-4xl mx-auto'>
          {/* Header */}
          <div className='mb-8'>
            <Button
              onClick={() => router.push('/')}
              variant='ghost'
              className='mb-4'
            >
              <ArrowLeft className='mr-2 h-4 w-4' />
              Back to Home
            </Button>
            <h1 className='text-4xl font-bold mb-2'>
              <span className='gradient-text'>Analytics</span>
            </h1>
            <p className='text-gray-600'>
              Detailed statistics for your short URL
            </p>
          </div>

          {/* Short URL Card */}
          <Card className='glass border-white/20 mb-6'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Link2 className='h-5 w-5' />
                Short URL
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex items-center gap-2'>
                <code className='flex-1 bg-white/50 rounded-md p-3 font-mono text-sm break-all'>
                  {shortUrl}
                </code>
                <a href={shortUrl} target='_blank' rel='noopener noreferrer'>
                  <Button variant='outline' size='icon'>
                    <ExternalLink className='h-4 w-4' />
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
            <Card className='glass border-white/20'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-lg'>
                  <TrendingUp className='h-5 w-5 text-cyan-600' />
                  Total Clicks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-4xl font-bold gradient-text'>
                  {analytics.click_count.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card className='glass border-white/20'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-lg'>
                  <Clock className='h-5 w-5 text-cyan-600' />
                  Last Accessed
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analytics.last_accessed ? (
                  <div>
                    <div className='text-2xl font-semibold text-gray-800'>
                      {getRelativeTime(analytics.last_accessed)}
                    </div>
                    <div className='text-sm text-gray-500 mt-1'>
                      {new Date(analytics.last_accessed).toLocaleString()}
                    </div>
                  </div>
                ) : (
                  <div className='text-gray-500'>Never accessed</div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* QR Code Card */}
          <Card className='glass border-white/20'>
            <CardHeader>
              <CardTitle>QR Code</CardTitle>
              <CardDescription>
                Share your short URL with a QR code
              </CardDescription>
            </CardHeader>
            <CardContent>
              <QrCodeDisplay url={shortUrl} size={256} />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
