import { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Dialog } from '../../../components/ui/Dialog';
import { Input } from '../../../components/ui/Input';
import { Label } from '../../../components/ui/Label';
import { Eye, EyeOff, Copy, Trash2, Key, Check, Plus } from 'lucide-react';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed: string;
  masked: boolean;
}

export function ApiKeySettings() {
  const [keys, setKeys] = useState<ApiKey[]>([
    {
      id: 'key-1',
      name: 'Production Web App',
      key: 'qrf_live_948201fa8723bc12049e',
      created: '2026-07-01',
      lastUsed: '5 minutes ago',
      masked: true,
    },
    {
      id: 'key-2',
      name: 'Mobile SDK Staging',
      key: 'qrf_test_31094857120394857102',
      created: '2026-07-15',
      lastUsed: '2 days ago',
      masked: true,
    },
  ]);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');

  const toggleMask = (id: string) => {
    setKeys((prev) =>
      prev.map((k) => (k.id === id ? { ...k, masked: !k.masked } : k))
    );
  };

  const copyToClipboard = (id: string, fullKey: string) => {
    navigator.clipboard.writeText(fullKey);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const revokeKey = (id: string) => {
    setKeys((prev) => prev.filter((k) => k.id !== id));
  };

  const handleGenerateKey = () => {
    if (!newKeyName.trim()) return;
    const newKey: ApiKey = {
      id: `key-${Date.now()}`,
      name: newKeyName,
      key: `qrf_live_${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`,
      created: new Date().toISOString().split('T')[0],
      lastUsed: 'Never',
      masked: false,
    };
    setKeys([newKey, ...keys]);
    setNewKeyName('');
    setIsGenerateOpen(false);
  };

  const maskKeyString = (str: string) => {
    const prefix = str.substring(0, 9);
    return `${prefix}••••••••••••••••`;
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold font-heading text-text">REST API Secret Keys</h3>
          <p className="text-xs text-text-secondary">Authenticate Spring Boot API requests via HTTP Bearer Token.</p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setIsGenerateOpen(true)}>
          <Plus className="h-4 w-4" strokeWidth={1.5} /> Generate New Key
        </Button>
      </div>

      {/* Key List */}
      <div className="space-y-3">
        {keys.map((k) => (
          <div
            key={k.id}
            className="p-4 rounded-xl border border-border bg-surface flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4 text-primary" strokeWidth={1.5} />
                <span className="text-sm font-bold text-text">{k.name}</span>
                <Badge variant="outline" className="text-[10px]">Active</Badge>
              </div>
              <p className="text-xs font-mono text-text-secondary">
                {k.masked ? maskKeyString(k.key) : k.key}
              </p>
              <div className="text-[11px] text-text-secondary">
                Created: {k.created} • Last Used: {k.lastUsed}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleMask(k.id)}
                title={k.masked ? 'Reveal API Key' : 'Hide API Key'}
              >
                {k.masked ? (
                  <>
                    <Eye className="h-3.5 w-3.5 mr-1" strokeWidth={1.5} /> Reveal
                  </>
                ) : (
                  <>
                    <EyeOff className="h-3.5 w-3.5 mr-1" strokeWidth={1.5} /> Hide
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(k.id, k.key)}
              >
                {copiedId === k.id ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-success mr-1" strokeWidth={2} /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 mr-1" strokeWidth={1.5} /> Copy
                  </>
                )}
              </Button>

              <Button
                variant="danger"
                size="icon"
                onClick={() => revokeKey(k.id)}
                title="Revoke API Key"
              >
                <Trash2 className="h-4 w-4" strokeWidth={1.5} />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Generate Key Modal */}
      <Dialog
        isOpen={isGenerateOpen}
        onClose={() => setIsGenerateOpen(false)}
        title="Generate New REST API Key"
        description="Provide a descriptive name to identify where this key will be used."
      >
        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="key-name">API Key Identifier Name</Label>
            <Input
              id="key-name"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="e.g. Staging Server Batch Script"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setIsGenerateOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleGenerateKey} disabled={!newKeyName.trim()}>
              Create Key
            </Button>
          </div>
        </div>
      </Dialog>
    </Card>
  );
}
