'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface QrCodeDisplayProps {
  url: string;
  size?: number;
}

export function QrCodeDisplay({ url, size = 200 }: QrCodeDisplayProps) {
  const handleDownload = () => {
    const svg = document.getElementById('qr-code');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    canvas.width = size;
    canvas.height = size;

    img.onload = () => {
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');

      const downloadLink = document.createElement('a');
      downloadLink.download = 'qr-code.png';
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className='flex flex-col items-center gap-4'>
      <div className='bg-white p-4 rounded-lg'>
        <QRCodeSVG
          id='qr-code'
          value={url}
          size={size}
          level='H'
          includeMargin={true}
        />
      </div>
      <Button onClick={handleDownload} variant='outline' size='sm'>
        <Download className='h-4 w-4 mr-2' />
        Download QR Code
      </Button>
    </div>
  );
}
