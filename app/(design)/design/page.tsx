import type { Metadata } from 'next';
import { DesignHome } from '@/components/divisions/design/DesignHome';

export const metadata: Metadata = {
  title: 'Gridsmith Design — from line to form',
  description: 'Visual identity, illustration, motion, 3D and technical drawing. One connected design practice. A trading division of Gridsmith Ltd.',
};

export default function Page() { return <DesignHome />; }
