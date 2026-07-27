import React, { useState, useMemo } from 'react';
import { QrItem } from '../../../types/api';
import { GlassPanel } from '../../../components/brand/GlassPanel';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { downloadQrItem, renameSavedCode } from '../../../lib/api/dashboard';
import { Link } from 'react-router-dom';
import {
  Copy,
  Trash2,
  Star,
  ExternalLink,
  QrCode,
  Search,
  Check,
  Folder,
  Plus,
  Download,
  Pencil,
  X,
} from 'lucide-react';
import { useDebouncedPreview } from '../../../hooks/useDebouncedPreview';
import { DEFAULT_QR_CONFIG, QrConfig } from '../../../types/qr';

interface QrGridProps {
  items: QrItem[];
  onToggleFavorite: (id: string, currentFav: boolean) => void;
  onDelete: (id: string) => void;
}

function QrGridCard({
  qr,
  onToggleFavorite,
  onDelete,
}: {
  qr: QrItem;
  onToggleFavorite: (id: string, currentFav: boolean) => void;
  onDelete: (id: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Inline rename state
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(qr.name);
  const [isSavingName, setIsSavingName] = useState(false);

  const cardConfig = useMemo<QrConfig>(() => {
    if (qr.renderOptions) {
      try {
        const opts = JSON.parse(qr.renderOptions);
        return {
          ...DEFAULT_QR_CONFIG,
          ...opts,
          content: qr.content || opts.content || 'https://qrfusion.io',
          size: 180,
        };
      } catch (e) {
        console.warn('Failed to parse renderOptions for preview:', e);
      }
    }
    return {
      ...DEFAULT_QR_CONFIG,
      content: qr.content || 'https://qrfusion.io',
      size: 180,
    };
  }, [qr.content, qr.renderOptions]);

  const { result } = useDebouncedPreview(cardConfig, null, null, null, 150);
  const previewUrl = result?.blobUrl || result?.objectUrl;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(qr.redirectUrl || qr.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDownloading(true);
    try {
      await downloadQrItem(qr);
    } catch (err) {
      console.warn('Failed to re-download QR code item:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSaveRename = async () => {
    if (!nameInput.trim() || nameInput.trim() === qr.name) {
      setIsEditingName(false);
      return;
    }
    setIsSavingName(true);
    try {
      await renameSavedCode(qr.id, nameInput.trim());
      qr.name = nameInput.trim();
    } catch (err) {
      console.warn('Failed to rename saved QR code:', err);
    } finally {
      setIsSavingName(false);
      setIsEditingName(false);
    }
  };

  const handleEditInStudio = () => {
    let editConfigPayload: any = { content: qr.content };
    if (qr.renderOptions) {
      try {
        const opts = JSON.parse(qr.renderOptions);
        editConfigPayload = {
          ...opts,
          content: qr.content || opts.content || 'https://qrfusion.io',
        };
      } catch (e) {
        console.warn('Failed to parse renderOptions for studio resume:', e);
      }
    }
    sessionStorage.setItem('qrfusion_edit_config', JSON.stringify(editConfigPayload));
  };

  return (
    <GlassPanel className="relative group p-5 space-y-4 flex flex-col justify-between overflow-hidden hover:border-primary/40 transition-colors">
      <div className="space-y-3 relative z-10">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <Badge variant="outline" className="font-mono text-[10px]">
                {qr.format}
              </Badge>
              <span className="text-[11px] text-text-secondary flex items-center gap-1">
                <Folder className="h-3 w-3 text-primary" /> {qr.folder}
              </span>
            </div>

            {/* Editable Title */}
            {isEditingName ? (
              <div className="flex items-center gap-1.5 mt-1">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveRename();
                    if (e.key === 'Escape') setIsEditingName(false);
                  }}
                  autoFocus
                  className="w-full px-2 py-1 text-sm font-bold rounded-lg bg-surface border border-primary text-text focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                <button
                  onClick={handleSaveRename}
                  disabled={isSavingName}
                  className="p-1 rounded-md bg-primary text-white hover:bg-primary-hover transition-colors cursor-pointer"
                  title="Save Name"
                >
                  <Check className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => {
                    setNameInput(qr.name);
                    setIsEditingName(false);
                  }}
                  className="p-1 rounded-md bg-surface border border-border text-text-secondary hover:text-text transition-colors cursor-pointer"
                  title="Cancel"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 group/title">
                <h4
                  onClick={() => setIsEditingName(true)}
                  className="text-base font-bold font-heading text-text group-hover:text-primary transition-colors truncate cursor-pointer"
                  title="Click to rename"
                >
                  {qr.name}
                </h4>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="opacity-0 group-hover/title:opacity-100 p-1 text-text-secondary hover:text-primary transition-opacity cursor-pointer"
                  title="Rename QR Code"
                >
                  <Pencil className="h-3 w-3" />
                </button>
              </div>
            )}

            <p className="text-xs text-text-secondary truncate max-w-[220px] font-mono mt-0.5">
              {qr.content}
            </p>
          </div>

          {/* Favorite Star Button */}
          <button
            onClick={() => onToggleFavorite(qr.id, qr.favorite)}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              qr.favorite
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-500 shadow-xs scale-105'
                : 'bg-surface/60 border-border text-text-secondary/40 hover:text-amber-500 hover:border-amber-500/30'
            }`}
            title={qr.favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star
              className="h-5 w-5 transition-transform active:scale-125"
              fill={qr.favorite ? '#F59E0B' : 'none'}
              color={qr.favorite ? '#F59E0B' : 'currentColor'}
              strokeWidth={1.75}
            />
          </button>
        </div>

        {/* Generated Real QR Preview Box */}
        <div className="w-full h-40 rounded-xl bg-white p-3 border border-border/80 flex items-center justify-center relative overflow-hidden shadow-inner">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt={qr.name}
              className="max-h-full max-w-full object-contain rounded-xs transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-24 h-24 rounded-md border border-slate-300 bg-white p-2 flex flex-col justify-between shadow-xs animate-pulse">
              <div className="flex justify-between">
                <div className="w-4 h-4 bg-slate-400 rounded-xs" />
                <div className="w-4 h-4 bg-slate-400 rounded-xs" />
              </div>
              <div className="w-4 h-4 bg-slate-400 rounded-xs" />
            </div>
          )}
        </div>
      </div>

      {/* Meta info & Action Buttons */}
      <div className="pt-2 border-t border-border/60 relative z-10 flex items-center justify-between">
        <div className="text-xs text-text-secondary font-medium">
          <strong className="text-text font-bold">{qr.scansCount.toLocaleString()}</strong> scans
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant="primary"
            size="sm"
            onClick={handleDownload}
            disabled={isDownloading}
            title="Download Image"
            className="h-8 px-2.5 text-xs shadow-xs gap-1"
          >
            <Download className="h-3.5 w-3.5" strokeWidth={1.5} />
            {isDownloading ? 'Exporting...' : 'Download'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            title="Copy URL"
            className="h-8 px-2 text-xs"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-success" strokeWidth={2} />
            ) : (
              <Copy className="h-3.5 w-3.5" strokeWidth={1.5} />
            )}
          </Button>

          <Link to="/generator" onClick={handleEditInStudio}>
            <Button variant="outline" size="sm" className="h-8 px-2 text-xs" title="Edit in Studio">
              <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.5} />
            </Button>
          </Link>

          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(qr.id)}
            title="Delete"
            className="h-8 px-2 text-xs"
          >
            <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
          </Button>
        </div>
      </div>
    </GlassPanel>
  );
}

export function QrGrid({ items, onToggleFavorite, onDelete }: QrGridProps) {
  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'favorites'>('all');

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.content.toLowerCase().includes(search.toLowerCase()) ||
        item.folder.toLowerCase().includes(search.toLowerCase());

      const matchesFilter = selectedFilter === 'favorites' ? item.favorite : true;

      return matchesSearch && matchesFilter;
    });
  }, [items, search, selectedFilter]);

  return (
    <div className="space-y-6">
      {/* Header + Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-extrabold font-heading text-text tracking-tight">Active QR Codes</h3>
          <p className="text-xs text-text-secondary mt-0.5">Manage, rename, favorite, re-download, copy, and organize your saved QR assets.</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary pointer-events-none" />
            <input
              type="text"
              placeholder="Search QR codes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-surface border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 text-text placeholder:text-text-secondary"
            />
          </div>

          <Link to="/generator" className="shrink-0">
            <Button variant="primary" size="md" className="shadow-md shadow-primary/20">
              <QrCode className="h-4 w-4" strokeWidth={1.5} />
              <span>Create QR</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 pb-1">
        <button
          onClick={() => setSelectedFilter('all')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
            selectedFilter === 'all'
              ? 'bg-primary text-white border-primary shadow-xs'
              : 'bg-surface/60 border-border text-text-secondary hover:text-text'
          }`}
        >
          All Codes ({items.length})
        </button>
        <button
          onClick={() => setSelectedFilter('favorites')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
            selectedFilter === 'favorites'
              ? 'bg-primary text-white border-primary shadow-xs'
              : 'bg-surface/60 border-border text-text-secondary hover:text-text'
          }`}
        >
          ★ Favorites ({items.filter((i) => i.favorite).length})
        </button>
      </div>

      {/* Empty State for Genuine New Users or Filter Mismatch */}
      {items.length === 0 ? (
        <GlassPanel className="p-12 text-center text-text-secondary space-y-4 max-w-lg mx-auto border-dashed">
          <QrCode className="h-12 w-12 mx-auto text-primary" strokeWidth={1.5} />
          <div className="space-y-1">
            <h4 className="text-xl font-bold font-heading text-text">No QR codes yet</h4>
            <p className="text-sm text-text-secondary">
              Create your first studio-grade QR code to start tracking scans and managing vector assets.
            </p>
          </div>
          <Link to="/generator" className="inline-block pt-2">
            <Button variant="primary" size="lg" className="shadow-lg shadow-primary/25">
              <Plus className="h-4 w-4 mr-1.5" />
              Create your first QR Code
            </Button>
          </Link>
        </GlassPanel>
      ) : filteredItems.length === 0 ? (
        <GlassPanel className="p-10 text-center text-text-secondary space-y-2">
          <div className="font-bold text-base text-text">No matching QR codes found</div>
          <p className="text-xs text-text-secondary">Try adjusting your search term or filter.</p>
        </GlassPanel>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((qr) => (
            <QrGridCard
              key={qr.id}
              qr={qr}
              onToggleFavorite={onToggleFavorite}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
