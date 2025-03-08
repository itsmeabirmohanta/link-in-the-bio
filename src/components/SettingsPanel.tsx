'use client'

import { useState, useEffect } from 'react';
import { Profile } from '@/types/social';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { X, Upload, Check } from 'lucide-react';
import { ChangeEvent } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';
import Image from 'next/image';
import ReactCrop, { Crop as CropType } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface SettingsPanelProps {
  profile: Profile;
  onUpdate: (updatedProfile: Profile) => void;
  onClose: () => void;
  isOpen: boolean;
}

export default function SettingsPanel({ profile, onUpdate, onClose, isOpen }: SettingsPanelProps) {
  const [editedProfile, setEditedProfile] = useState<Profile>(profile);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [crop, setCrop] = useState<CropType>({
    unit: '%',
    width: 100,
    height: 100,
    x: 0,
    y: 0,
  });

  useEffect(() => {
    setEditedProfile(profile);
  }, [profile]);

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB');
      return;
    }

    try {
      const reader = new FileReader();
      
      const loadImage = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result;
          if (typeof result === 'string' && result) {
            resolve(result);
          } else {
            reject(new Error('Failed to read image'));
          }
        };
        reader.onerror = () => reject(new Error('Failed to read image file'));
      });

      reader.readAsDataURL(file);
      const imageData = await loadImage;

      // Pre-process image to ensure it's not too large
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 800;
            const MAX_HEIGHT = 800;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
              }
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Failed to get canvas context');

            ctx.drawImage(img, 0, 0, width, height);
            const resizedImage = canvas.toDataURL('image/jpeg', 0.8);
            setTempImage(resizedImage);
            setIsCropping(true);
            setCrop({
              unit: '%',
              width: 100,
              height: 100,
              x: 0,
              y: 0,
            });
            resolve();
          } catch (error) {
            reject(error);
          }
        };
        img.onerror = () => reject(new Error('Invalid image format'));
        img.src = imageData;
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to process image');
    }
  };

  const getCroppedImage = async (sourceImage: string, cropConfig: CropType): Promise<string> => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      
      image.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }

          // Calculate dimensions
          const scaleX = image.naturalWidth / image.width;
          const scaleY = image.naturalHeight / image.height;

          // Set canvas size to the cropped size
          canvas.width = Math.floor(cropConfig.width * scaleX);
          canvas.height = Math.floor(cropConfig.height * scaleY);

          // Ensure high-quality downscaling
          ctx.imageSmoothingQuality = 'high';
          ctx.imageSmoothingEnabled = true;

          // Draw the cropped image
          ctx.drawImage(
            image,
            cropConfig.x * scaleX,
            cropConfig.y * scaleY,
            cropConfig.width * scaleX,
            cropConfig.height * scaleY,
            0,
            0,
            canvas.width,
            canvas.height
          );

          // Convert to JPEG for better compression
          const croppedImage = canvas.toDataURL('image/jpeg', 0.85);
          
          // Validate the output
          if (!croppedImage.startsWith('data:image/')) {
            reject(new Error('Failed to generate image'));
            return;
          }

          resolve(croppedImage);
        } catch (error) {
          reject(error);
        }
      };

      image.onerror = () => reject(new Error('Failed to load image'));
      image.src = sourceImage;
    });
  };

  const handleCropComplete = async () => {
    if (!tempImage) return;

    try {
      const croppedImage = await getCroppedImage(tempImage, crop);
      
      // Validate the cropped image size
      const base64Size = croppedImage.length * 0.75; // Approximate size in bytes
      if (base64Size > 2 * 1024 * 1024) { // 2MB limit
        throw new Error('Cropped image is too large. Please try a smaller selection.');
      }

      setEditedProfile(prev => ({ ...prev, avatar: croppedImage }));
      setTempImage(null);
      setIsCropping(false);
      toast.success('Image cropped successfully');
    } catch (error) {
      console.error('Error cropping image:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to crop image');
      setTempImage(null);
      setIsCropping(false);
    }
  };

  const handleSave = async () => {
    try {
      // Validate profile data before saving
      if (!editedProfile.name.trim()) {
        toast.error('Name is required');
        return;
      }
      if (!editedProfile.bio.trim()) {
        toast.error('Bio is required');
        return;
      }
      if (!editedProfile.avatar) {
        toast.error('Profile picture is required');
        return;
      }
      
      // Validate links
      for (const link of editedProfile.links) {
        if (!link.title.trim() || !link.url.trim() || !link.icon.trim()) {
          toast.error('All social link fields are required');
          return;
        }
        try {
          new URL(link.url); // Validate URL format
        } catch {
          toast.error('Invalid URL format in social links');
          return;
        }
      }

      onUpdate(editedProfile);
      onClose();
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save changes');
    }
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-lg shadow-xl mx-4"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-semibold">Edit Profile</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-6">
              {/* Profile Picture */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Profile Picture
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative w-24 h-24">
                    <Image
                      src={editedProfile.avatar}
                      alt={editedProfile.name}
                      width={96}
                      height={96}
                      className="rounded-full object-cover ring-2 ring-purple-500/20"
                      priority
                      unoptimized
                    />
                  </div>
                  <div>
                    <label className="cursor-pointer">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Button variant="outline" className="gap-2">
                        <Upload className="h-4 w-4" />
                        Upload Image
                      </Button>
                    </label>
                  </div>
                </div>
              </div>

              {/* Image Cropper */}
              {isCropping && tempImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                  <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-xl max-w-2xl w-full mx-4">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Crop Image</h3>
                      <div className="max-h-[60vh] overflow-hidden">
                        <ReactCrop
                          crop={crop}
                          onChange={c => setCrop(c)}
                          aspect={1}
                          circularCrop
                        >
                          <img src={tempImage} alt="Crop preview" />
                        </ReactCrop>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setTempImage(null);
                            setIsCropping(false);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleCropComplete}>
                          <Check className="h-4 w-4 mr-2" />
                          Apply
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Name
                </label>
                <Input
                  value={editedProfile.name}
                  onChange={(e) => setEditedProfile(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Your name"
                />
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Bio
                </label>
                <Textarea
                  value={editedProfile.bio}
                  onChange={(e) => setEditedProfile(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell us about yourself"
                  rows={3}
                />
              </div>

              {/* Social Links */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Social Links
                </label>
                {editedProfile.links.map((link, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={link.title}
                      onChange={(e) => {
                        const newLinks = [...editedProfile.links];
                        newLinks[index] = { ...link, title: e.target.value };
                        setEditedProfile(prev => ({ ...prev, links: newLinks }));
                      }}
                      placeholder="Title"
                    />
                    <Input
                      value={link.url}
                      onChange={(e) => {
                        const newLinks = [...editedProfile.links];
                        newLinks[index] = { ...link, url: e.target.value };
                        setEditedProfile(prev => ({ ...prev, links: newLinks }));
                      }}
                      placeholder="URL"
                    />
                    <Input
                      value={link.icon}
                      onChange={(e) => {
                        const newLinks = [...editedProfile.links];
                        newLinks[index] = { ...link, icon: e.target.value };
                        setEditedProfile(prev => ({ ...prev, links: newLinks }));
                      }}
                      placeholder="Icon"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 z-10 flex justify-end gap-2 p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
} 