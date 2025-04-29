import { Suspense, lazy, ComponentType } from 'react'
import { Loader2 } from 'lucide-react'

interface LazyLoadProps {
  component: () => Promise<{ default: ComponentType<any> }>
  fallback?: React.ReactNode
}

export function LazyLoad({ component, fallback }: LazyLoadProps) {
  const LazyComponent = lazy(component)

  return (
    <Suspense
      fallback={
        fallback || (
          <div className="flex items-center justify-center w-full h-full min-h-[200px]">
            <Loader2 className="w-8 h-8 animate-spin text-[#002654]" />
          </div>
        )
      }
    >
      <LazyComponent />
    </Suspense>
  )
} 