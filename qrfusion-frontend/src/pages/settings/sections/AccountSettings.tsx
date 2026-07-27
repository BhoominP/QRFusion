import React, { useEffect, useRef, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Label } from '../../../components/ui/Label';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { getCurrentUser, updateProfile, uploadAvatar, UserDto } from '../../../lib/api/auth';
import { Camera, Trash2, CheckCircle2, AlertCircle, ShieldCheck, User, Sparkles, Lock } from 'lucide-react';

export function AccountSettings() {
  const [user, setUser] = useState<UserDto | null>(null);
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    setIsLoading(true);
    try {
      const u = await getCurrentUser();
      if (u) {
        setUser(u);
        setName(u.name || '');
        setAvatarUrl(u.avatarUrl || null);
      }
    } catch (err: any) {
      console.warn('Failed to load user profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsUploading(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      try {
        const updatedUser = await uploadAvatar(file);
        setUser(updatedUser);
        setAvatarUrl(updatedUser.avatarUrl || null);
        setSuccessMsg('Profile picture updated successfully!');
        window.dispatchEvent(new CustomEvent('qrfusion_user_updated', { detail: updatedUser }));
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to upload profile picture.');
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveAvatar = async () => {
    setIsSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const updatedUser = await updateProfile({ avatarUrl: null });
      setUser(updatedUser);
      setAvatarUrl(null);
      setSuccessMsg('Profile picture removed.');
      window.dispatchEvent(new CustomEvent('qrfusion_user_updated', { detail: updatedUser }));
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to remove profile picture.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Name cannot be empty.');
      return;
    }

    setIsSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const updatedUser = await updateProfile({ name: name.trim(), avatarUrl });
      setUser(updatedUser);
      setSuccessMsg('Profile settings saved successfully!');
      window.dispatchEvent(new CustomEvent('qrfusion_user_updated', { detail: updatedUser }));
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update profile settings.');
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = (fullName: string) => {
    if (!fullName) return 'U';
    const parts = fullName.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return fullName.slice(0, 2).toUpperCase();
  };

  if (isLoading) {
    return (
      <Card className="p-6 space-y-4 animate-pulse">
        <div className="h-6 w-48 bg-border/40 rounded-md" />
        <div className="h-20 w-full bg-border/20 rounded-xl" />
        <div className="h-10 w-full bg-border/30 rounded-lg" />
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-6 shadow-md border-border/80">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border/60">
        <div>
          <h3 className="text-xl font-bold font-heading text-text flex items-center gap-2">
            <User className="h-5 w-5 text-primary dark:text-secondary" />
            Account & Profile Settings
          </h3>
          <p className="text-xs text-text-secondary mt-0.5">
            Manage your personal profile photo, account display name, and preferences.
          </p>
        </div>
        <Badge variant="accent" className="font-mono text-xs shadow-2xs">
          {user?.authProvider === 'google' ? 'Google Account' : 'Email/Password'}
        </Badge>
      </div>

      {/* Success / Error Banners */}
      {successMsg && (
        <div className="p-3.5 rounded-xl border border-success/30 bg-success/10 text-success text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-xl border border-danger/30 bg-danger/10 text-danger text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Profile Picture Uploader Section */}
      <div className="p-5 rounded-2xl border border-border bg-surface/50 space-y-4">
        <Label className="text-xs font-bold uppercase tracking-wider text-text-secondary">
          Profile Photo
        </Label>

        <div className="flex flex-col sm:flex-row items-center gap-5">
          {/* Avatar Display Container */}
          <div className="relative group">
            <div className="w-24 h-24 rounded-full border-2 border-primary/30 bg-primary/10 flex items-center justify-center overflow-hidden shadow-inner shrink-0">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={user?.name || 'Profile Avatar'}
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <span className="text-2xl font-extrabold font-heading text-primary dark:text-secondary tracking-wider">
                  {getInitials(name || user?.name || '')}
                </span>
              )}
            </div>

            {/* Quick Change Badge Overlay */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 p-2 rounded-full bg-primary text-white hover:bg-primary-hover shadow-md transition-transform hover:scale-110 cursor-pointer"
              title="Change Profile Photo"
            >
              <Camera className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Upload & Actions Control */}
          <div className="space-y-2 text-center sm:text-left">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/jpg"
              onChange={handleAvatarFileChange}
              className="hidden"
            />

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="gap-2 text-xs"
              >
                <Camera className="h-4 w-4 text-primary dark:text-secondary" />
                {isUploading ? 'Uploading...' : 'Upload Profile Picture'}
              </Button>

              {avatarUrl && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveAvatar}
                  disabled={isSaving}
                  className="text-danger hover:bg-danger/10 text-xs gap-1.5"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </Button>
              )}
            </div>
            <p className="text-[11px] text-text-secondary">
              Recommended: Square PNG, JPG or WEBP image, up to 5MB.
            </p>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSaveChanges} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="profile-name">Full Name</Label>
            <Input
              id="profile-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="profile-email">Email Address</Label>
            <div className="relative">
              <Input
                id="profile-email"
                value={user?.email || ''}
                disabled
                className="bg-bg/60 text-text-secondary cursor-not-allowed pr-8 font-mono text-xs"
              />
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-secondary" />
            </div>
          </div>
        </div>

        {/* Footer Info & Submit */}
        <div className="pt-4 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-text-secondary font-medium">
            <ShieldCheck className="h-4 w-4 text-success shrink-0" />
            <span>Authenticated session active</span>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isSaving || isUploading}
            className="w-full sm:w-auto shadow-md shadow-primary/20"
          >
            {isSaving ? 'Saving profile...' : 'Save Profile Changes'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
