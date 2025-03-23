"use client";

import { IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner';
import { useState } from 'react';

import { toast } from 'sonner';

export default function Page() {
    const [data, setData] = useState<string | null>(null);

    const onScan = (detectedCodes: IDetectedBarcode[]) => {
        if (detectedCodes.length && detectedCodes[0]?.rawValue) {
            toast.success('QR code detected');
            setData(detectedCodes[0].rawValue);
        }
    };

    const onError = (error: unknown) => {
        console.error(error);
        toast.error('Error scanning QR code');
    };

    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="w-[80%] max-w-[500px] mx-auto">
                <Scanner
                    formats={['qr_code']}
                    onScan={onScan}
                    onError={onError}
                    components={{ finder: true, audio: false }}
                    allowMultiple
                    scanDelay={2000}
                />
            </div>
        </div>
    );
};