'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { apiClient } from '@/lib/api';
import { CreateUrlResponse } from '@/lib/types';
import { isValidUrl } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

interface UrlShortenerFormProps {
  onSuccess: (result: CreateUrlResponse) => void;
}

export function UrlShortenerForm({ onSuccess }: UrlShortenerFormProps) {
  const [longUrl, setLongUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [ttlDays, setTtlDays] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!longUrl.trim()) {
      setError('Please enter a URL');
      return;
    }

    if (!isValidUrl(longUrl)) {
      setError('Please enter a valid URL (including http:// or https://)');
      return;
    }

    setIsLoading(true);

    try {
      const data: any = { long_url: longUrl };

      if (customAlias.trim()) {
        data.custom_alias = customAlias.trim();
      }

      if (ttlDays) {
        data.ttl_days = parseInt(ttlDays);
      }

      const result = await apiClient.createShortUrl(data);
      onSuccess(result);

      // Reset form
      setLongUrl('');
      setCustomAlias('');
      setTtlDays('');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to create short URL',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className='w-full max-w-2xl glass border-white/20'>
      <CardHeader>
        <CardTitle className='text-2xl'>Shorten Your URL</CardTitle>
        <CardDescription>
          Enter a long URL to get a short, shareable link
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <label htmlFor='longUrl' className='text-sm font-medium'>
              Long URL *
            </label>
            <Input
              id='longUrl'
              type='url'
              placeholder='https://example.com/very/long/url'
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              disabled={isLoading}
              className='bg-white/50'
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <label htmlFor='customAlias' className='text-sm font-medium'>
                Custom Alias (optional)
              </label>
              <Input
                id='customAlias'
                type='text'
                placeholder='my-link'
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value)}
                disabled={isLoading}
                className='bg-white/50'
              />
            </div>

            <div className='space-y-2'>
              <label htmlFor='ttl' className='text-sm font-medium'>
                Expires In (optional)
              </label>
              <select
                id='ttl'
                value={ttlDays}
                onChange={(e) => setTtlDays(e.target.value)}
                disabled={isLoading}
                className='flex h-10 w-full rounded-md border border-input bg-white/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
              >
                <option value=''>Never</option>
                <option value='1'>1 Day</option>
                <option value='7'>7 Days</option>
                <option value='30'>30 Days</option>
                <option value='90'>90 Days</option>
              </select>
            </div>
          </div>

          {error && (
            <div className='text-sm text-red-500 bg-red-50 border border-red-200 rounded-md p-3'>
              {error}
            </div>
          )}

          <Button
            type='submit'
            disabled={isLoading}
            variant='gradient'
            size='lg'
            className='w-full'
          >
            {isLoading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Shortening...
              </>
            ) : (
              'Shorten URL'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
