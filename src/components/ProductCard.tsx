import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface ProductCardProps {
  product: Product;
  isOwner: boolean;
  onDelete: () => void;
}

export default function ProductCard({ product, isOwner, onDelete }: ProductCardProps) {
  
  const manageMenu = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Manage Listing</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/listings/${product.id}/edit`}><Edit className="mr-2 h-4 w-4"/>Edit</Link>
        </DropdownMenuItem>
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}><Trash2 className="mr-2 h-4 w-4"/>Delete</DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your listing.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 group">
      <Link href={`/listings/${product.id}`} className="group/link flex-grow">
          <CardHeader className="p-0">
            <div className="aspect-w-16 aspect-h-9 overflow-hidden">
              <Image
                src={product.image_url || 'https://placehold.co/600x400.png'}
                alt={product.title}
                width={600}
                height={400}
                className="object-cover w-full h-full transition-transform duration-300 group-hover/link:scale-105"
                data-ai-hint={`${product.category} ${product.title}`}
              />
            </div>
          </CardHeader>
          <CardContent className="p-4 flex-grow">
            <div className="flex justify-between items-start mb-2">
              <CardTitle className="text-lg font-headline leading-tight pr-2">
                {product.title}
              </CardTitle>
              <Badge variant={product.type === 'sale' ? 'default' : 'secondary'} className="capitalize bg-accent text-accent-foreground flex-shrink-0">
                {product.type}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1 capitalize">{product.category} &bull; {product.condition}</p>
          </CardContent>
      </Link>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <p className="text-xl font-semibold text-primary">
            ${product.price.toLocaleString()}
            {product.type === 'rent' && <span className="text-sm font-normal text-muted-foreground">/day</span>}
        </p>
        {isOwner && manageMenu}
      </CardFooter>
    </Card>
  );
}
