'use client';

import { useState } from 'react';
import styled from 'styled-components';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Icons } from '@/components/icons';

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #EDEDED;
  margin: 0;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
`;

const Button = styled.button<{ $primary?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: ${({ $primary }) => ($primary ? '#3ECF8E' : '#232323')};
  color: ${({ $primary }) => ($primary ? '#171717' : '#EDEDED')};
  border: 1px solid ${({ $primary }) => ($primary ? '#3ECF8E' : '#2E2E2E')};
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ $primary }) => ($primary ? '#4FF5A8' : '#2A2A2A')};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  gap: 0;
  height: calc(100vh - 140px);
  background: #1C1C1C;
  border: 1px solid #2E2E2E;
  border-radius: 8px;
  overflow: hidden;
`;

const BucketList = styled.div`
  width: 260px;
  background: #1C1C1C;
  border-right: 1px solid #2E2E2E;
  display: flex;
  flex-direction: column;
`;

const BucketListHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid #2E2E2E;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const BucketListTitle = styled.h3`
  font-size: 13px;
  font-weight: 600;
  color: #8F8F8F;
  margin: 0;
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: #8F8F8F;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #2A2A2A;
    color: #EDEDED;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const BucketSection = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
`;

const BucketItem = styled.button<{ $active?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  background: ${({ $active }) => ($active ? 'rgba(62, 207, 142, 0.1)' : 'transparent')};
  border: none;
  border-left: 2px solid ${({ $active }) => ($active ? '#3ECF8E' : 'transparent')};
  color: ${({ $active }) => ($active ? '#EDEDED' : '#8F8F8F')};
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #EDEDED;
  }

  svg {
    width: 16px;
    height: 16px;
    opacity: 0.6;
  }
`;

const BucketIcon = styled.span`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #5E5E5E;
`;

const BucketBadge = styled.span<{ $public?: boolean }>`
  margin-left: auto;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  background: ${({ $public }) => ($public ? 'rgba(62, 207, 142, 0.2)' : 'rgba(142, 142, 142, 0.2)')};
  color: ${({ $public }) => ($public ? '#3ECF8E' : '#8F8F8F')};
`;

const FileSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const FileToolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: #232323;
  border-bottom: 1px solid #2E2E2E;
`;

const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #8F8F8F;
`;

const BreadcrumbItem = styled.button`
  background: none;
  border: none;
  color: #8F8F8F;
  cursor: pointer;
  font-size: 14px;
  padding: 0;

  &:hover {
    color: #EDEDED;
  }

  &:last-child {
    color: #EDEDED;
    font-weight: 500;
  }
`;

const ToolbarActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FileGrid = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
  align-content: start;
`;

const FileCard = styled.div<{ $selected?: boolean }>`
  background: ${({ $selected }) => ($selected ? 'rgba(62, 207, 142, 0.1)' : '#232323')};
  border: 1px solid ${({ $selected }) => ($selected ? '#3ECF8E' : '#2E2E2E')};
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${({ $selected }) => ($selected ? '#3ECF8E' : '#3E3E3E')};
  }
`;

const FilePreview = styled.div<{ $type: string }>`
  width: 100%;
  aspect-ratio: 1;
  background: ${({ $type }) =>
    $type === 'folder' ? '#2A2A2A' :
    $type === 'image' ? '#1C1C1C' :
    '#2E2E2E'
  };
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  overflow: hidden;
`;

const FileIcon = styled.div<{ $type: string }>`
  color: ${({ $type }) =>
    $type === 'folder' ? '#F5A623' :
    $type === 'image' ? '#3B82F6' :
    $type === 'video' ? '#8B5CF6' :
    $type === 'document' ? '#3ECF8E' :
    '#8F8F8F'
  };

  svg {
    width: 48px;
    height: 48px;
  }
`;

const FileName = styled.p`
  font-size: 13px;
  font-weight: 500;
  color: #EDEDED;
  margin: 0 0 4px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const FileSize = styled.p`
  font-size: 12px;
  color: #5E5E5E;
  margin: 0;
`;

const mockBuckets = [
  { name: 'avatars', public: true, fileCount: 234 },
  { name: 'documents', public: false, fileCount: 89 },
  { name: 'images', public: true, fileCount: 567 },
  { name: 'uploads', public: false, fileCount: 156 },
];

const mockFiles = [
  { name: 'profile-1.jpg', type: 'image', size: '245 KB', preview: true },
  { name: 'profile-2.jpg', type: 'image', size: '312 KB', preview: true },
  { name: 'banner.png', type: 'image', size: '1.2 MB', preview: true },
  { name: 'documents', type: 'folder', size: '12 files' },
  { name: 'thumbnail.webp', type: 'image', size: '45 KB', preview: true },
  { name: 'video.mp4', type: 'video', size: '24 MB' },
  { name: 'report.pdf', type: 'document', size: '2.4 MB' },
  { name: 'backup', type: 'folder', size: '5 files' },
];

export default function StoragePage() {
  const [selectedBucket, setSelectedBucket] = useState('avatars');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  const toggleFileSelection = (fileName: string) => {
    setSelectedFiles((prev) =>
      prev.includes(fileName)
        ? prev.filter((f) => f !== fileName)
        : [...prev, fileName]
    );
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'folder': return Icons.folder;
      case 'image': return Icons.file;
      case 'video': return Icons.play;
      case 'document': return Icons.file;
      default: return Icons.file;
    }
  };

  return (
    <DashboardLayout>
      <PageHeader>
        <Title>Storage</Title>
        <HeaderActions>
          <Button>
            {Icons.plus} New Bucket
          </Button>
          <Button $primary>
            {Icons.upload} Upload Files
          </Button>
        </HeaderActions>
      </PageHeader>

      <ContentWrapper>
        <BucketList>
          <BucketListHeader>
            <BucketListTitle>Buckets</BucketListTitle>
            <IconButton>{Icons.plus}</IconButton>
          </BucketListHeader>
          <BucketSection>
            {mockBuckets.map((bucket) => (
              <BucketItem
                key={bucket.name}
                $active={selectedBucket === bucket.name}
                onClick={() => setSelectedBucket(bucket.name)}
              >
                <BucketIcon>{Icons.folder}</BucketIcon>
                {bucket.name}
                <BucketBadge $public={bucket.public}>
                  {bucket.public ? 'public' : 'private'}
                </BucketBadge>
              </BucketItem>
            ))}
          </BucketSection>
        </BucketList>

        <FileSection>
          <FileToolbar>
            <Breadcrumb>
              <BreadcrumbItem>{selectedBucket}</BreadcrumbItem>
            </Breadcrumb>
            <ToolbarActions>
              <IconButton title="Grid view">
                {Icons.overview}
              </IconButton>
              <IconButton title="List view">
                {Icons.menu}
              </IconButton>
              <IconButton title="Refresh">
                {Icons.refresh}
              </IconButton>
            </ToolbarActions>
          </FileToolbar>

          <FileGrid>
            {mockFiles.map((file) => (
              <FileCard
                key={file.name}
                $selected={selectedFiles.includes(file.name)}
                onClick={() => toggleFileSelection(file.name)}
              >
                <FilePreview $type={file.type}>
                  {file.preview ? (
                    <FileIcon $type={file.type}>{getFileIcon(file.type)}</FileIcon>
                  ) : (
                    <FileIcon $type={file.type}>{getFileIcon(file.type)}</FileIcon>
                  )}
                </FilePreview>
                <FileName>{file.name}</FileName>
                <FileSize>{file.size}</FileSize>
              </FileCard>
            ))}
          </FileGrid>
        </FileSection>
      </ContentWrapper>
    </DashboardLayout>
  );
}
