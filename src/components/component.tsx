import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

const ComponentClient = dynamic(() => 
  import('./ComponentClient').then((mod) => mod.ComponentClient as ComponentType<{}>), 
  { ssr: false }
);

export function Component() {
  return <ComponentClient />
}
