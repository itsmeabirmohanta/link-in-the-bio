'use client'

import { useState, useEffect, useRef } from 'react';
import { Profile, SocialLink } from '@/types/social';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Icon } from '@iconify/react';
import { X, Upload, LogOut, Check } from 'lucide-react';
import { ChangeEvent } from 'react';
import { createPortal } from 'react-dom';
import { signOut } from 'next-auth/react';
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

const ImageComponent = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
  const imgRef = useRef<HTMLImageElement>(null);
  return (
    <div className={className}>
      <Image
        ref={imgRef}
        src={src}
        alt={alt}
        fill
        className="object-contain"
        unoptimized
      />
    </div>
  );
};

export default function SettingsPanel({ profile, onUpdate, onClose, isOpen }: SettingsPanelProps) {
  const [localProfile, setLocalProfile] = useState<Profile>(profile);
  const [mounted, setMounted] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<CropType>({
    unit: '%',
    width: 100,
    height: 100,
    x: 0,
    y: 0
  });
  const [isCropping, setIsCropping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Mount check for client-side portal rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleProfileUpdate = (field: keyof Profile, value: string) => {
    setLocalProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleLinkUpdate = (id: string, field: keyof SocialLink, value: string) => {
    const updatedLinks = localProfile.links.map(link =>
      link.id === id ? { ...link, [field]: value } : link
    );
    setLocalProfile({ ...localProfile, links: updatedLinks });
  };

  const getCroppedImg = (image: HTMLImageElement, crop: CropType): Promise<string> => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const size = 400; // Target size for the cropped image
    
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('No 2d context');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      size,
      size
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error('Canvas is empty');
          return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
      }, 'image/jpeg', 0.95);
    });
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB');
      return;
    }

    try {
      setImageLoading(true);
      const reader = new FileReader();
      reader.onload = () => {
        setTempImage(reader.result as string);
        setIsCropping(true);
        setImageLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
      setImageLoading(false);
    }
  };

  const handleCropComplete = async () => {
    if (!imgRef.current || !tempImage) return;

    try {
      setImageLoading(true);
      const croppedImageUrl = await getCroppedImg(imgRef.current, crop);
      handleProfileUpdate('avatar', croppedImageUrl);
      setTempImage(null);
      setIsCropping(false);
      toast.success('Profile picture updated');
    } catch (error) {
      console.error('Error cropping image:', error);
      toast.error('Failed to crop image');
    } finally {
      setImageLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeLink = (id: string) => {
    const updatedLinks = localProfile.links.filter(link => link.id !== id);
    setLocalProfile({ ...localProfile, links: updatedLinks });
  };

  const handleSave = () => {
    onUpdate(localProfile);
    onClose();
  };

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-xl shadow-2xl z-[101]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Edit Profile
                </h2>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    className="hover:bg-red-100 dark:hover:bg-red-900/20 rounded-full text-red-600 dark:text-red-400"
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Profile Picture</label>
                  <div className="flex items-center gap-4">
                    {isCropping ? (
                      <div className="w-full space-y-4">
                        <div className="max-w-full overflow-hidden rounded-lg">
                          <ReactCrop
                            crop={crop}
                            onChange={c => setCrop(c)}
                            aspect={1}
                            circularCrop
                          >
                            <div className="relative w-full h-[400px]">
                              <Image
                                ref={imgRef}
                                src={tempImage || ''}
                                alt="Crop preview"
                                fill
                                className="object-contain"
                                unoptimized
                              />
                            </div>
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
                          <Button
                            onClick={handleCropComplete}
                            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Apply Crop
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="relative w-20 h-20">
                          <div className="absolute inset-0 rounded-full overflow-hidden">
                            <Image
                              src={localProfile.avatar}
                              alt={localProfile.name}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          {imageLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            accept="image/*"
                            className="hidden"
                          />
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={imageLoading}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            {imageLoading ? 'Processing...' : 'Upload Image'}
                          </Button>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            Upload an image to crop and set as your profile picture.
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <Input
                    value={localProfile.name}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleProfileUpdate('name', e.target.value)}
                    placeholder="Your Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Bio</label>
                  <Textarea
                    value={localProfile.bio}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleProfileUpdate('bio', e.target.value)}
                    placeholder="Tell us about yourself"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Social Links</label>
                  <div className="space-y-3">
                    {localProfile.links.map((link) => (
                      <div key={link.id} className="flex gap-3">
                        <Input
                          value={link.title}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => handleLinkUpdate(link.id, 'title', e.target.value)}
                          placeholder="Link Title"
                        />
                        <Input
                          value={link.url}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => handleLinkUpdate(link.id, 'url', e.target.value)}
                          placeholder="URL"
                        />
                        <Input
                          value={link.icon}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => handleLinkUpdate(link.id, 'icon', e.target.value)}
                          placeholder="Icon name"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => removeLink(link.id)}
                          className="shrink-0"
                        >
                          <Icon icon="solar:trash-bin-trash-linear" className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    className="mt-3 w-full"
                    onClick={() => {
                      const newLink = {
                        id: Date.now().toString(),
                        title: '',
                        url: '',
                        icon: '',
                        backgroundColor: '#ffffff'
                      };
                      setLocalProfile({
                        ...localProfile,
                        links: [...localProfile.links, newLink],
                      });
                    }}
                  >
                    Add Link
                  </Button>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t dark:border-gray-800">
                <Button
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                  onClick={handleSave}
                >
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={onClose}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>

          {tempImage && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg max-w-md w-full">
                <div className="relative aspect-square mb-4">
                  <Image
                    src={tempImage}
                    alt="Crop preview"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setTempImage(null)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCropComplete}>
                    Apply Crop
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;

  // Render using portal
  return createPortal(modalContent, document.body);
} 