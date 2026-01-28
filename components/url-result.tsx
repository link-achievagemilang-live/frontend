'use client';

import { QrCodeDisplay } from '@/components/qr-code-display';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CreateUrlResponse } from '@/lib/types';
import { copyToClipboard, formatDate } from '@/lib/utils';
import { BarChart3, Check, Copy, QrCode } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface UrlResultProps {
  result: CreateUrlResponse;
}

export function UrlResult({ result }: UrlResultProps) {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const handleCopy = async () => {
    try {
      await copyToClipboard(result.short_url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shortCode = result.short_url.split('/').pop() || '';

  return (
    <Card className='w-full max-w-2xl glass border-white/20 animate-in fade-in slide-in-from-bottom-4 duration-500'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Check className='h-5 w-5 text-green-500' />
          URL Shortened Successfully!
        </CardTitle>
        <CardDescription>Your short URL is ready to share</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-2'>
          <label className='text-sm font-medium'>Short URL</label>
          <div className='flex gap-2'>
            <div className='flex-1 bg-white/50 rounded-md p-3 font-mono text-sm break-all'>
              {result.short_url}
            </div>
            <Button
              onClick={handleCopy}
              variant='outline'
              size='icon'
              className='shrink-0'
            >
              {copied ? (
                <Check className='h-4 w-4 text-green-500' />
              ) : (
                <Copy className='h-4 w-4' />
              )}
            </Button>
          </div>
        </div>

        {result.expires_at && (
          <div className='flex items-center gap-2'>
            <Badge variant='secondary'>
              Expires: {formatDate(result.expires_at)}
            </Badge>
          </div>
        )}

        <div className='flex flex-wrap gap-2'>
          <Button
            onClick={() => setShowQr(!showQr)}
            variant='outline'
            size='sm'
          >
            <QrCode className='h-4 w-4 mr-2' />
            {showQr ? 'Hide' : 'Show'} QR Code
          </Button>

          <Link href={`/analytics/${shortCode}`}>
            <Button variant='outline' size='sm'>
              <BarChart3 className='h-4 w-4 mr-2' />
              View Analytics
            </Button>
          </Link>
        </div>

        {showQr && (
          <div className='pt-4 border-t'>
            <QrCodeDisplay url={result.short_url} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
