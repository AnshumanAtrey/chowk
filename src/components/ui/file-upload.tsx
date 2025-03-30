
import { useState, useRef, ChangeEvent } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { uploadImage } from '@/lib/upload';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onUploadComplete: (url: string) => void;
  initialImage?: string;
  className?: string;
}

export function FileUpload({ onUploadComplete, initialImage, className }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(initialImage || null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }
    
    setError(null);
    setIsUploading(true);
    
    // Create local preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    // Upload to supabase storage
    try {
      const { url, error } = await uploadImage(file);
      if (error) {
        throw error;
      }
      if (url) {
        onUploadComplete(url);
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      setError('Failed to upload image: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onUploadComplete(''); // Clear the image URL
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn('w-full', className)}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      {preview ? (
        <div className="relative rounded-lg overflow-hidden border border-gray-300">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-48 object-cover"
          />
          <Button 
            variant="destructive" 
            size="icon" 
            className="absolute top-2 right-2 rounded-full h-8 w-8"
            onClick={handleRemoveImage}
            type="button"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div 
          onClick={triggerFileInput}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-chowk-primary transition-colors"
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4 flex text-sm text-gray-600">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer font-semibold text-chowk-primary hover:text-chowk-secondary focus-within:outline-none"
            >
              <span>Upload an image</span>
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
        </div>
      )}
      
      {isUploading && (
        <div className="mt-2 text-sm text-gray-600">Uploading...</div>
      )}
      
      {error && (
        <div className="mt-2 text-sm text-red-500">{error}</div>
      )}
    </div>
  );
}
