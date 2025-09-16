import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/data-table';
import { DataService } from '@/lib/data-service';
import { Plus, Upload, Folder, FolderPlus, File, Download } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Document {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: number;
  parentId?: string;
  description?: string;
  category: string;
  uploadedBy: string;
  uploadedAt: Date;
  lastModified: Date;
  tags: string[];
  url?: string;
}

export default function DocumentManager() {
  const [documents, setDocuments] = React.useState<Document[]>([]);
  const [currentFolder, setCurrentFolder] = React.useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = React.useState<Document | null>(null);
  const [isUploadOpen, setIsUploadOpen] = React.useState(false);
  const [isFolderOpen, setIsFolderOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  const [uploadForm, setUploadForm] = React.useState({
    name: '',
    description: '',
    category: '',
    tags: ''
  });

  const [folderForm, setFolderForm] = React.useState({
    name: '',
    description: ''
  });

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const allDocuments = await DataService.readAll<Document>('documents');
      setDocuments(allDocuments);
      
      // Initialize with sample data if empty
      if (allDocuments.length === 0) {
        const sampleDocuments = [
          {
            name: 'Project Documents',
            type: 'folder' as const,
            description: 'Main project documentation folder',
            category: 'Project',
            uploadedBy: 'admin@college.edu',
            uploadedAt: new Date('2024-01-15'),
            lastModified: new Date('2024-01-15'),
            tags: ['project', 'main']
          },
          {
            name: 'Legal Documents',
            type: 'folder' as const,
            description: 'Legal and compliance documents',
            category: 'Legal',
            uploadedBy: 'admin@college.edu',
            uploadedAt: new Date('2024-01-16'),
            lastModified: new Date('2024-01-16'),
            tags: ['legal', 'compliance']
          },
          {
            name: 'Land Purchase Agreement.pdf',
            type: 'file' as const,
            size: 2048576,
            description: 'Legal agreement for college land purchase',
            category: 'Legal',
            uploadedBy: 'manager@college.edu',
            uploadedAt: new Date('2024-02-01'),
            lastModified: new Date('2024-02-01'),
            tags: ['land', 'purchase', 'agreement'],
            url: '#'
          },
          {
            name: 'Budget Proposal 2024.xlsx',
            type: 'file' as const,
            size: 1024000,
            description: 'Annual budget proposal for college establishment',
            category: 'Finance',
            uploadedBy: 'admin@college.edu',
            uploadedAt: new Date('2024-01-20'),
            lastModified: new Date('2024-03-15'),
            tags: ['budget', 'finance', '2024'],
            url: '#'
          }
        ];

        for (const doc of sampleDocuments) {
          await DataService.create<Document>('documents', doc);
        }
        
        const updatedDocuments = await DataService.readAll<Document>('documents');
        setDocuments(updatedDocuments);
      }
    } catch (error) {
      console.error('Failed to load documents:', error);
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadDocuments();
  }, []);

  const handleCreateFolder = async () => {
    try {
      const folderData = {
        name: folderForm.name,
        type: 'folder' as const,
        parentId: currentFolder,
        description: folderForm.description,
        category: 'General',
        uploadedBy: 'current-user@college.edu',
        uploadedAt: new Date(),
        lastModified: new Date(),
        tags: []
      };

      await DataService.create<Document>('documents', folderData);
      await loadDocuments();
      toast.success('Folder created successfully');
      setIsFolderOpen(false);
      setFolderForm({ name: '', description: '' });
    } catch (error) {
      console.error('Failed to create folder:', error);
      toast.error('Failed to create folder');
    }
  };

  const handleUploadDocument = async () => {
    try {
      const documentData = {
        name: uploadForm.name,
        type: 'file' as const,
        size: Math.floor(Math.random() * 5000000) + 100000, // Random size for demo
        parentId: currentFolder,
        description: uploadForm.description,
        category: uploadForm.category,
        uploadedBy: 'current-user@college.edu',
        uploadedAt: new Date(),
        lastModified: new Date(),
        tags: uploadForm.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        url: '#'
      };

      await DataService.create<Document>('documents', documentData);
      await loadDocuments();
      toast.success('Document uploaded successfully');
      setIsUploadOpen(false);
      setUploadForm({ name: '', description: '', category: '', tags: '' });
    } catch (error) {
      console.error('Failed to upload document:', error);
      toast.error('Failed to upload document');
    }
  };

  const handleDeleteDocument = async (document: Document) => {
    if (!confirm(`Are you sure you want to delete "${document.name}"?`)) return;
    
    try {
      await DataService.delete('documents', document.id);
      await loadDocuments();
      toast.success('Document deleted successfully');
    } catch (error) {
      console.error('Failed to delete document:', error);
      toast.error('Failed to delete document');
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const filteredDocuments = documents.filter(doc => doc.parentId === currentFolder);

  const columns = [
    {
      key: 'name' as keyof Document,
      label: 'Name',
      render: (value: string, doc: Document) => (
        <div className="flex items-center">
          {doc.type === 'folder' ? (
            <Folder className="h-4 w-4 mr-2 text-blue-600" />
          ) : (
            <File className="h-4 w-4 mr-2 text-gray-600" />
          )}
          <div>
            <div className="font-medium">{value}</div>
            <div className="text-sm text-muted-foreground">{doc.description}</div>
          </div>
        </div>
      )
    },
    {
      key: 'category' as keyof Document,
      label: 'Category',
      render: (value: string) => (
        <Badge variant="outline">{value}</Badge>
      )
    },
    {
      key: 'size' as keyof Document,
      label: 'Size',
      render: (value: number, doc: Document) => (
        <div>{doc.type === 'folder' ? '-' : formatFileSize(value)}</div>
      )
    },
    {
      key: 'uploadedBy' as keyof Document,
      label: 'Uploaded By',
      render: (value: string) => value
    },
    {
      key: 'lastModified' as keyof Document,
      label: 'Last Modified',
      render: (value: Date) => (
        <div>{value ? new Date(value).toLocaleDateString() : 'Unknown'}</div>
      )
    },
    {
      key: 'tags' as keyof Document,
      label: 'Tags',
      render: (value: string[]) => (
        <div className="flex flex-wrap gap-1">
          {value?.slice(0, 2).map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {value?.length > 2 && (
            <Badge variant="secondary" className="text-xs">
              +{value.length - 2}
            </Badge>
          )}
        </div>
      )
    }
  ];

  const documentStats = React.useMemo(() => {
    const totalFiles = documents.filter(d => d.type === 'file').length;
    const totalFolders = documents.filter(d => d.type === 'folder').length;
    const totalSize = documents
      .filter(d => d.type === 'file')
      .reduce((sum, d) => sum + (d.size || 0), 0);
    
    return { totalFiles, totalFolders, totalSize, total: documents.length };
  }, [documents]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading documents...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Document Management</h1>
          <p className="text-muted-foreground">Upload and organize project documents</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setIsFolderOpen(true)}>
            <FolderPlus className="h-4 w-4 mr-2" />
            New Folder
          </Button>
          <Button onClick={() => setIsUploadOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </div>
      </div>

      {/* Document Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Files</CardTitle>
            <File className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documentStats.totalFiles}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Folders</CardTitle>
            <Folder className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documentStats.totalFolders}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Size</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatFileSize(documentStats.totalSize)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documentStats.total}</div>
          </CardContent>
        </Card>
      </div>

      {/* Documents Table */}
      <Card>
        <CardHeader>
          <CardTitle>Documents & Folders</CardTitle>
          <CardDescription>
            Manage files and folders for your project
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={filteredDocuments}
            columns={columns}
            onDelete={handleDeleteDocument}
            searchable={true}
          />
        </CardContent>
      </Card>

      {/* Upload Document Dialog */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="fileName">File Name</Label>
              <Input
                id="fileName"
                value={uploadForm.name}
                onChange={(e) => setUploadForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="document.pdf"
                required
              />
            </div>
            <div>
              <Label htmlFor="fileDescription">Description</Label>
              <Textarea
                id="fileDescription"
                value={uploadForm.description}
                onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="fileCategory">Category</Label>
              <Select value={uploadForm.category} onValueChange={(value) => setUploadForm(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Legal">Legal</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Project">Project</SelectItem>
                  <SelectItem value="HR">Human Resources</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="fileTags">Tags (comma separated)</Label>
              <Input
                id="fileTags"
                value={uploadForm.tags}
                onChange={(e) => setUploadForm(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="legal, contract, important"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUploadDocument}>
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Folder Dialog */}
      <Dialog open={isFolderOpen} onOpenChange={setIsFolderOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="folderName">Folder Name</Label>
              <Input
                id="folderName"
                value={folderForm.name}
                onChange={(e) => setFolderForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="New Folder"
                required
              />
            </div>
            <div>
              <Label htmlFor="folderDescription">Description</Label>
              <Textarea
                id="folderDescription"
                value={folderForm.description}
                onChange={(e) => setFolderForm(prev => ({ ...prev, description: e.target.value }))}
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFolderOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateFolder}>
              Create Folder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}