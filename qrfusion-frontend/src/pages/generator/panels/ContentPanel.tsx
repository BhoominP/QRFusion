import React, { useState, useEffect } from 'react';
import { QrConfig } from '../../../types/qr';
import { Input } from '../../../components/ui/Input';
import { Label } from '../../../components/ui/Label';
import { Globe, Wifi, Contact, Type, CheckCircle2, Tag } from 'lucide-react';

interface ContentPanelProps {
  config: QrConfig;
  updateConfig: (updates: Partial<QrConfig>) => void;
}

export function ContentPanel({ config, updateConfig }: ContentPanelProps) {
  const [contentType, setContentType] = useState<'url' | 'text' | 'wifi' | 'vcard'>('url');

  // WiFi State
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [wifiEncryption, setWifiEncryption] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');

  // vCard Detailed State
  const [vcardName, setVcardName] = useState('Bhoomin Patel');
  const [vcardCompany, setVcardCompany] = useState('QRFusion');
  const [vcardTitle, setVcardTitle] = useState('Lead Engineer');
  const [vcardPhone, setVcardPhone] = useState('+1 555-0199');
  const [vcardEmail, setVcardEmail] = useState('bhoomin@qrfusion.io');
  const [vcardUrl, setVcardUrl] = useState('https://qrfusion.io');

  // Helper to format iOS/Android compliant vCard 3.0 payload
  const buildVCardPayload = (
    name: string,
    phone: string,
    email: string,
    company: string,
    title: string,
    url: string
  ) => {
    const trimmedName = name.trim() || 'Contact Name';
    const nameParts = trimmedName.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const lines = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${trimmedName}`,
      `N:${lastName};${firstName};;;`,
    ];

    if (company.trim()) lines.push(`ORG:${company.trim()}`);
    if (title.trim()) lines.push(`TITLE:${title.trim()}`);
    if (phone.trim()) lines.push(`TEL;TYPE=CELL:${phone.trim()}`);
    if (email.trim()) lines.push(`EMAIL;TYPE=INTERNET:${email.trim()}`);
    if (url.trim()) lines.push(`URL:${url.trim()}`);

    lines.push('END:VCARD');
    return lines.join('\n');
  };

  // Helper to format WiFi payload
  const buildWifiPayload = (ssid: string, pass: string, enc: string) => {
    return `WIFI:S:${ssid};T:${enc};P:${pass};;`;
  };

  // Auto-detect initial content mode & parse existing content if vCard/WiFi
  useEffect(() => {
    if (config.content.includes('BEGIN:VCARD')) {
      setContentType('vcard');
      const fnMatch = config.content.match(/FN:(.*)/);
      const telMatch = config.content.match(/TEL.*:(.*)/);
      const emailMatch = config.content.match(/EMAIL.*:(.*)/);
      const orgMatch = config.content.match(/ORG:(.*)/);
      const titleMatch = config.content.match(/TITLE:(.*)/);
      const urlMatch = config.content.match(/URL:(.*)/);

      if (fnMatch) setVcardName(fnMatch[1].trim());
      if (telMatch) setVcardPhone(telMatch[1].trim());
      if (emailMatch) setVcardEmail(emailMatch[1].trim());
      if (orgMatch) setVcardCompany(orgMatch[1].trim());
      if (titleMatch) setVcardTitle(titleMatch[1].trim());
      if (urlMatch) setVcardUrl(urlMatch[1].trim());
    } else if (config.content.startsWith('WIFI:')) {
      setContentType('wifi');
      const ssidMatch = config.content.match(/S:([^;]*)/);
      const passMatch = config.content.match(/P:([^;]*)/);
      if (ssidMatch) setWifiSsid(ssidMatch[1]);
      if (passMatch) setWifiPassword(passMatch[1]);
    }
  }, []);

  // Update vCard dynamically on field change
  const handleVCardChange = (
    name = vcardName,
    phone = vcardPhone,
    email = vcardEmail,
    company = vcardCompany,
    title = vcardTitle,
    url = vcardUrl
  ) => {
    setVcardName(name);
    setVcardPhone(phone);
    setVcardEmail(email);
    setVcardCompany(company);
    setVcardTitle(title);
    setVcardUrl(url);

    const payload = buildVCardPayload(name, phone, email, company, title, url);
    updateConfig({ content: payload });
  };

  // Update WiFi dynamically on field change
  const handleWifiChange = (ssid = wifiSsid, pass = wifiPassword, enc = wifiEncryption) => {
    setWifiSsid(ssid);
    setWifiPassword(pass);
    setWifiEncryption(enc);

    const payload = buildWifiPayload(ssid, pass, enc);
    updateConfig({ content: payload });
  };

  // Tab switch handler
  const handleTabSwitch = (type: 'url' | 'text' | 'wifi' | 'vcard') => {
    setContentType(type);
    if (type === 'vcard') {
      const payload = buildVCardPayload(
        vcardName,
        vcardPhone,
        vcardEmail,
        vcardCompany,
        vcardTitle,
        vcardUrl
      );
      updateConfig({ content: payload });
    } else if (type === 'wifi') {
      const payload = buildWifiPayload(wifiSsid, wifiPassword, wifiEncryption);
      updateConfig({ content: payload });
    } else if (type === 'url' && (config.content.includes('BEGIN:VCARD') || config.content.startsWith('WIFI:'))) {
      updateConfig({ content: 'https://qrfusion.io' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Custom QR Code Title / Name Input */}
      <div className="space-y-1.5 p-4 rounded-xl bg-surface border border-border/80 shadow-2xs">
        <Label htmlFor="qr-title-name" className="flex items-center gap-1.5 font-bold text-text">
          <Tag className="h-4 w-4 text-primary" />
          QR Code Title / Name
        </Label>
        <Input
          id="qr-title-name"
          value={config.frameCaptionText ? (config.frameCaptionText !== 'SCAN ME' ? config.frameCaptionText : '') : ''}
          onChange={(e) => updateConfig({ frameCaptionText: e.target.value || 'SCAN ME' })}
          placeholder="e.g. My Website Link, Cafe Menu, Office Wi-Fi"
        />
        <p className="text-[11px] text-text-secondary">
          Label your QR code so you can easily identify and manage it in your Dashboard.
        </p>
      </div>

      {/* Content Type Selector */}
      <div>
        <Label>Select Content Type</Label>
        <div className="grid grid-cols-4 gap-2 mt-1.5">
          <button
            type="button"
            onClick={() => handleTabSwitch('url')}
            className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              contentType === 'url'
                ? 'border-primary bg-primary/10 text-primary dark:text-secondary shadow-xs'
                : 'border-border bg-surface text-text-secondary hover:text-text'
            }`}
          >
            <Globe className="h-4 w-4" strokeWidth={1.5} />
            URL
          </button>

          <button
            type="button"
            onClick={() => handleTabSwitch('text')}
            className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              contentType === 'text'
                ? 'border-primary bg-primary/10 text-primary dark:text-secondary shadow-xs'
                : 'border-border bg-surface text-text-secondary hover:text-text'
            }`}
          >
            <Type className="h-4 w-4" strokeWidth={1.5} />
            Text
          </button>

          <button
            type="button"
            onClick={() => handleTabSwitch('wifi')}
            className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              contentType === 'wifi'
                ? 'border-primary bg-primary/10 text-primary dark:text-secondary shadow-xs'
                : 'border-border bg-surface text-text-secondary hover:text-text'
            }`}
          >
            <Wifi className="h-4 w-4" strokeWidth={1.5} />
            WiFi
          </button>

          <button
            type="button"
            onClick={() => handleTabSwitch('vcard')}
            className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              contentType === 'vcard'
                ? 'border-primary bg-primary/10 text-primary dark:text-secondary shadow-xs'
                : 'border-border bg-surface text-text-secondary hover:text-text'
            }`}
          >
            <Contact className="h-4 w-4" strokeWidth={1.5} />
            vCard
          </button>
        </div>
      </div>

      {/* URL Content Mode */}
      {contentType === 'url' && (
        <div className="space-y-2">
          <Label htmlFor="target-url">Website URL or Destination Link</Label>
          <Input
            id="target-url"
            value={config.content}
            onChange={(e) => updateConfig({ content: e.target.value })}
            placeholder="https://qrfusion.io"
          />
          <p className="text-[11px] text-text-secondary">
            Scanners will open this web address directly upon scanning.
          </p>
        </div>
      )}

      {/* Plain Text Mode */}
      {contentType === 'text' && (
        <div className="space-y-2">
          <Label htmlFor="target-text">Raw Text Message</Label>
          <textarea
            id="target-text"
            rows={4}
            value={config.content}
            onChange={(e) => updateConfig({ content: e.target.value })}
            className="flex w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-text-secondary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/50 focus-visible:border-secondary transition-all"
            placeholder="Enter custom plain text..."
          />
        </div>
      )}

      {/* WiFi Mode */}
      {contentType === 'wifi' && (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="wifi-ssid">WiFi Network Name (SSID)</Label>
            <Input
              id="wifi-ssid"
              value={wifiSsid}
              onChange={(e) => handleWifiChange(e.target.value, wifiPassword, wifiEncryption)}
              placeholder="e.g. QRFusion_Office_5G"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="wifi-pass">Network Password</Label>
            <Input
              id="wifi-pass"
              type="password"
              value={wifiPassword}
              onChange={(e) => handleWifiChange(wifiSsid, e.target.value, wifiEncryption)}
              placeholder="Network Password"
            />
          </div>
        </div>
      )}

      {/* vCard Form Mode (iOS & Android Compliant vCard 3.0) */}
      {contentType === 'vcard' && (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="vcard-name">Full Name *</Label>
            <Input
              id="vcard-name"
              value={vcardName}
              onChange={(e) => handleVCardChange(e.target.value)}
              placeholder="Bhoomin Patel"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="vcard-phone">Phone Number</Label>
              <Input
                id="vcard-phone"
                value={vcardPhone}
                onChange={(e) => handleVCardChange(vcardName, e.target.value)}
                placeholder="+1 555-0199"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="vcard-email">Email Address</Label>
              <Input
                id="vcard-email"
                value={vcardEmail}
                onChange={(e) => handleVCardChange(vcardName, vcardPhone, e.target.value)}
                placeholder="bhoomin@qrfusion.io"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="vcard-company">Company / Org</Label>
              <Input
                id="vcard-company"
                value={vcardCompany}
                onChange={(e) => handleVCardChange(vcardName, vcardPhone, vcardEmail, e.target.value)}
                placeholder="QRFusion Studio"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="vcard-title">Job Title</Label>
              <Input
                id="vcard-title"
                value={vcardTitle}
                onChange={(e) => handleVCardChange(vcardName, vcardPhone, vcardEmail, vcardCompany, e.target.value)}
                placeholder="Lead Engineer"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="vcard-url">Website / Portfolio URL</Label>
            <Input
              id="vcard-url"
              value={vcardUrl}
              onChange={(e) => handleVCardChange(vcardName, vcardPhone, vcardEmail, vcardCompany, vcardTitle, e.target.value)}
              placeholder="https://qrfusion.io"
            />
          </div>

          {/* Compliance Status Badge */}
          <div className="p-3 rounded-xl bg-surface border border-border/80 flex items-center justify-between text-xs text-text-secondary">
            <span className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              vCard 3.0 standard active (iOS & Android ready)
            </span>
          </div>

          {/* Raw Payload Preview */}
          <div className="space-y-1">
            <Label className="text-[11px] uppercase tracking-wider text-text-secondary">Raw vCard Payload</Label>
            <pre className="p-3 rounded-xl bg-slate-950 text-slate-300 font-mono text-[11px] leading-tight overflow-x-auto border border-border/60">
              {config.content}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
