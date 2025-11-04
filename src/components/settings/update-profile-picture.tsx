'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Camera, Upload, RotateCw, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UpdateProfilePictureProps {
  onPictureSelected: (dataUrl: string) => void;
  currentPicture?: string;
}

export function UpdateProfilePicture({ onPictureSelected, currentPicture }: UpdateProfilePictureProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('upload');
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(currentPicture || null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getCameraPermission = useCallback(async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast({
            variant: 'destructive',
            title: 'Camera Not Supported',
            description: 'Your browser does not support camera access.',
        });
        setHasCameraPermission(false);
        return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setHasCameraPermission(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasCameraPermission(false);
      toast({
        variant: 'destructive',
        title: 'Camera Access Denied',
        description: 'Please enable camera permissions in your browser settings.',
      });
    }
  }, [toast]);
  
  useEffect(() => {
    if (activeTab === 'camera') {
        getCameraPermission();
    } else {
        // Stop camera stream when switching away
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    }
  }, [activeTab, getCameraPermission]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        setImagePreview(dataUrl);
        setActiveTab('upload'); // Switch to preview
      }
    }
  };

  const handleSave = () => {
    if (imagePreview) {
      onPictureSelected(imagePreview);
    }
  };
  
  const CameraView = () => (
     <div className="space-y-4">
        {hasCameraPermission === false && (
            <Alert variant="destructive">
                <AlertTitle>Camera Access Required</AlertTitle>
                <AlertDescription>
                Please allow camera access in your browser to use this feature. You may need to refresh the page after granting permission.
                </AlertDescription>
            </Alert>
        )}
        <div className="relative aspect-video w-full overflow-hidden rounded-md border bg-muted">
            <video ref={videoRef} className="h-full w-full object-cover" autoPlay playsInline muted />
            <canvas ref={canvasRef} className="hidden" />
        </div>
        <Button onClick={handleCapture} disabled={!hasCameraPermission} className="w-full">
            <Camera className="mr-2" />
            Capture Photo
        </Button>
    </div>
  );

  const UploadView = () => (
    <div className="space-y-4">
        <div className="relative aspect-square w-full max-w-[250px] mx-auto overflow-hidden rounded-full border-2 border-dashed flex items-center justify-center bg-muted">
            {imagePreview ? (
                 <img src={imagePreview} alt="Profile Preview" className="h-full w-full object-cover" />
            ) : (
                <div className="text-center text-muted-foreground p-4">
                    <Upload className="mx-auto h-12 w-12" />
                    <p className="mt-2 text-sm">Image Preview</p>
                </div>
            )}
        </div>
        <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/gif"
            className="hidden"
        />
        <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full">
            <Upload className="mr-2" />
            Choose a file
        </Button>
    </div>
  );

  return (
    <div className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">
                    <Upload className="mr-2 h-4 w-4"/> Upload
                </TabsTrigger>
                <TabsTrigger value="camera">
                    <Camera className="mr-2 h-4 w-4"/> Take Photo
                </TabsTrigger>
            </TabsList>
            <TabsContent value="upload" className="mt-4">
                <UploadView />
            </TabsContent>
            <TabsContent value="camera" className="mt-4">
                <CameraView />
            </TabsContent>
        </Tabs>
        <div className="flex justify-end gap-2 pt-4">
            {imagePreview && imagePreview !== currentPicture && (
                 <Button variant="ghost" onClick={() => setImagePreview(currentPicture || null)}>
                    <RotateCw className="mr-2 h-4 w-4" />
                    Reset
                </Button>
            )}
            <Button onClick={handleSave} disabled={!imagePreview || imagePreview === currentPicture}>
                <Check className="mr-2 h-4 w-4" />
                Save Picture
            </Button>
        </div>
    </div>
  );
}
