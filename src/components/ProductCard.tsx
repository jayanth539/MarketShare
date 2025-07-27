import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/listings/${product.id}`} className="group">
      <Card className="h-full overflow-hidden transition-all duration-300 ease-in-out group-hover:shadow-xl group-hover:-translate-y-1">
        <CardHeader className="p-0">
          <div className="aspect-w-16 aspect-h-9 overflow-hidden">
            <Image
              src={product.image_url || 'https://placehold.co/600x400.png'}
              alt={product.title}
              width={600}
              height={400}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={`${product.category} ${product.title}`}
            />
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <CardTitle className="text-lg font-headline leading-tight pr-2">
              {product.title}
            </CardTitle>
            <Badge variant={product.type === 'sale' ? 'default' : 'secondary'} className="capitalize bg-accent text-accent-foreground flex-shrink-0">
              {product.type}
            </Badge>
          </div>
          <p className="text-xl font-semibold text-primary">
            ${product.price.toLocaleString()}
            {product.type === 'rent' && <span className="text-sm font-normal text-muted-foreground">/day</span>}
          </p>
          <p className="text-sm text-muted-foreground mt-1 capitalize">{product.category} &bull; {product.condition}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
